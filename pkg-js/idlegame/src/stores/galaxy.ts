import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Galaxy } from '@/game/exploration/types/Galaxy'
import type {
  GalaxyState,
  StarMetadataMap,
  PlanetInfo,
  Explorer,
  PlanetTemp,
} from '@/store/types'
import type { GovtMap } from '@/game/exploration/gen/StarGovtSystem'
import { GovtSystem } from '@/game/exploration/gen/StarGovtSystem'
import { StarMetadataSystem } from '@/game/exploration/gen/StarMetadataSystem'
import { generateExplorer } from '@/game/exploration/gen/explorers'
import { getGalaxy } from '@/store/getterHelpers/getGalaxy'
import { getStarSystem } from '@/store/getterHelpers/starSystems'
import { NEXTS, STARTS, TICKS } from '@/store/mutationHelpers/ticks'

export const useGalaxyStore = defineStore(
  'galaxy',
  () => {
    // State
    const animationHandle = ref(0)
    const timerHandle = ref(0)
    const messages = ref<string[]>([])
    const lowPowerMode = ref(true)
    const seed = ref('0')
    const starInfo = ref<StarMetadataMap>({})
    const govtInfo = ref<GovtMap>({})
    const planetInfo = ref<Record<string, PlanetInfo>>({})
    const explorers = ref<Record<string, Explorer>>({})

    // Getters
    const galaxy = computed<Galaxy>(() => {
      return getGalaxy(seed.value)
    })

    // Helper to get current state object (for compatibility with existing helpers)
    function getState(): GalaxyState {
      return {
        animationHandle: animationHandle.value,
        timerHandle: timerHandle.value,
        messages: messages.value,
        lowPowerMode: lowPowerMode.value,
        seed: seed.value,
        starInfo: starInfo.value,
        govtInfo: govtInfo.value,
        planetInfo: planetInfo.value,
        explorers: explorers.value,
      }
    }

    // Actions
    function newRandomSeed() {
      seed.value = `${Math.random()}`
      const g = getGalaxy(seed.value)
      starInfo.value = StarMetadataSystem.makeMetadata(seed.value, g)
      govtInfo.value = GovtSystem.makeGovts(seed.value, g)
      explorers.value = {}

      for (let i = 0; i < 5; i++) {
        const e = generateExplorer(
          g.homeStarID,
          Object.values(explorers.value).map((e) => e.name)
        )
        explorers.value[e.id] = e
      }

      starInfo.value[g.homeStarID].known = true
      starInfo.value[g.homeStarID].explored = true
      for (const neighborID of g.getNeighborIDs(g.homeStarID)) {
        starInfo.value[neighborID].known = true
      }

      for (const star of Object.values(g.stars)) {
        const sys = getStarSystem(star.id)
        starInfo.value[star.id].planetIDs.forEach((planetID, i) => {
          const planet = sys.planets[i]
          let temp: PlanetTemp = 'cold'
          if (planet.distance > sys.habitableZoneMax) {
            temp = 'cold'
          } else if (planet.distance < sys.habitableZoneMin) {
            temp = 'hot'
          } else {
            temp = 'hab'
          }
          const isTidallyLocked = temp !== 'cold' && sys.stars[0].starType === 'M'
          const isTerranHabitable =
            temp === 'hab' && !isTidallyLocked && planet.planetType === 'Terran'
          planetInfo.value[planetID] = {
            id: planetID,
            index: i,
            name: null,
            known: star.id === g.homeStarID,
            temp,
            type: planet.planetType,
            isTidallyLocked,
            isTerranHabitable,
          }
          if (isTerranHabitable) {
            starInfo.value[star.id].hasTerranHabitable = true
          }
        })
      }
    }

    function ensureSeeded() {
      if (seed.value === '0') {
        newRandomSeed()
      }
    }

    function tick(dt: number) {
      const g = galaxy.value
      const state = getState()

      for (const e of Object.values(explorers.value)) {
        TICKS[e.state](dt, state, g, e)

        const nextState = NEXTS[e.state](dt, state, g, e)
        if (nextState) {
          e.state = nextState
          STARTS[e.state](dt, state, g, e)
        }
      }

      // Sync state back (mutations in tick handlers modify state object)
      messages.value = state.messages
      starInfo.value = state.starInfo
      planetInfo.value = state.planetInfo
    }

    function beginTick() {
      stopTick()
      console.log('RESUME')
      if (animationHandle.value !== 0) return

      let lastTime: number | null = null
      const exec = (t: number) => {
        if (lowPowerMode.value) {
          timerHandle.value = window.setTimeout(() => {
            timerHandle.value = requestAnimationFrame(exec)
          }, 1000 / 15)
        } else {
          animationHandle.value = requestAnimationFrame(exec)
        }

        if (!lastTime) {
          lastTime = t
          return
        }
        const dt = t - lastTime
        tick(dt / 1000)
        lastTime = t
      }
      animationHandle.value = requestAnimationFrame(exec)
    }

    function stopTick() {
      if (animationHandle.value === 0 && timerHandle.value === 0) return
      console.log('PAUSE')
      if (animationHandle.value) {
        cancelAnimationFrame(animationHandle.value)
      }
      if (timerHandle.value) {
        clearTimeout(timerHandle.value)
      }
      animationHandle.value = 0
      timerHandle.value = 0
    }

    function starSystemPlanets(sid: string): PlanetInfo[] {
      return starInfo.value[sid].planetIDs.map((pid) => planetInfo.value[pid])
    }

    return {
      // State
      animationHandle,
      timerHandle,
      messages,
      lowPowerMode,
      seed,
      starInfo,
      govtInfo,
      planetInfo,
      explorers,
      // Getters
      galaxy,
      // Actions
      newRandomSeed,
      ensureSeeded,
      tick,
      beginTick,
      stopTick,
      starSystemPlanets,
    }
  },
  {
    persist: {
      pick: ['seed', 'starInfo', 'govtInfo', 'planetInfo', 'explorers', 'messages'],
    },
  }
)
