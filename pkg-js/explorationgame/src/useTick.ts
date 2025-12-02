import { onMounted, onUnmounted } from "vue";
import { usePlayerStore } from "./stores/playerStore";

export default function useTick() {
  const playerStore = usePlayerStore();

  const TRAVEL_SPEED = 0.5; // progress per second

  // Animation
  let animationHandle = 0;
  let lastTime: number | null = null;

  function tick(time: number) {
    if (lastTime !== null) {
      const dt = (time - lastTime) / 1000;
      playerStore.tick(dt, TRAVEL_SPEED);
    }

    lastTime = time;
    animationHandle = requestAnimationFrame(tick);
  }

  onMounted(() => {
    animationHandle = requestAnimationFrame(tick);
  });

  onUnmounted(() => {
    if (animationHandle) {
      cancelAnimationFrame(animationHandle);
    }
  });
}
