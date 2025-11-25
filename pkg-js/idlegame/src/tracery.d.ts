declare module "tracery-grammar" {
  export type TraceryModifierCollection = Record<
    string,
    (input: string) => string
  >;

  export interface TraceryGrammar {
    addModifiers: (modifiers: TraceryModifierCollection) => void;
    flatten: (rule: string) => string;
  }

  export function createGrammar(definition: any): TraceryGrammar;
}
