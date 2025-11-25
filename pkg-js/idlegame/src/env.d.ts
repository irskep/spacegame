declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'seedrandom' {
  function seedrandom(seed?: string): () => number
  export default seedrandom
}

declare module 'tracery-grammar' {
  export interface TraceryGrammar {
    flatten: (rule: string) => string
  }
  export function createGrammar(
    definition: Record<string, string[]>
  ): TraceryGrammar
}
