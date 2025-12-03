import type { useEventStore } from "@/stores/eventStore";
import type { useTechStore } from "@/stores/techStore";
import { autoSurvey, registerAutoSurveyEffects } from "./autoSurvey";
import type { Technology } from "./Technology";

export const allTechnologies: Technology[] = [autoSurvey];

export function registerAllTechEffects(
  eventStore: ReturnType<typeof useEventStore>,
  techStore: ReturnType<typeof useTechStore>,
) {
  registerAutoSurveyEffects(eventStore, techStore);
}
