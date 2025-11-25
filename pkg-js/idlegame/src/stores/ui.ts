import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Vector2 } from '@/game/framework/Vector2'

export const useUIStore = defineStore('ui', () => {
  const hoveredStarID = ref<string | null>(null)
  const selectedStarID = ref<string | null>(null)
  const hoveredExplorerID = ref<string | null>(null)
  const selectedExplorerID = ref<string | null>(null)
  const imageSizes = ref<Record<string, Vector2>>({})

  function hoverStar(starID: string | null) {
    hoveredStarID.value = starID
  }

  function selectStar(starID: string | null) {
    selectedStarID.value = starID
  }

  function hoverExplorer(explorerID: string | null) {
    hoveredExplorerID.value = explorerID
  }

  function selectExplorer(explorerID: string | null) {
    selectedExplorerID.value = explorerID
  }

  function addImageSize(url: string, size: Vector2) {
    imageSizes.value[url] = size
  }

  return {
    hoveredStarID,
    selectedStarID,
    hoveredExplorerID,
    selectedExplorerID,
    imageSizes,
    hoverStar,
    selectStar,
    hoverExplorer,
    selectExplorer,
    addImageSize,
  }
})
