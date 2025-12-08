export interface Noun {
  id: string;
  name: string;
  flavorTextShort?: string;
}

// Elements

export interface Element extends Noun {}

function makeElement(name: string, flavorTextShort?: string): Element {
  return {
    id: `element-${name.replaceAll(" ", "")}`,
    name,
    flavorTextShort,
  };
}

export const ELEMENTS = {
  ElementW: makeElement(
    "Element W",
    "Powers wormhole technology. Incredibly rare."
  ),
  ElementK: makeElement("Element K", "Powers kinetic engines."),
  StructuralMaterials: makeElement(
    "Structural Materials",
    "Steel, titanium, composites."
  ),
  Minerals: makeElement("Minerals", "Common industrial feedstock."),
  Crystals: makeElement("Crystals", "Required for electronics and optics."),
};

// Components

export interface Component extends Noun {}

function makeComponent(name: string, flavorTextShort?: string): Component {
  return {
    id: `component-${name.replaceAll(" ", "")}`,
    name,
    flavorTextShort,
  };
}

export const COMPONENTS = {
  SensorCommsPackage: makeComponent(
    "Sensor and Communications Package",
    "Eyes and ears across the void."
  ),
  WormholeClasp: makeComponent(
    "Wormhole Clasp",
    "Grips the fabric of spacetime."
  ),
  KineticEngine: makeComponent(
    "Kinetic Engine",
    "Propulsion for interplanetary travel."
  ),
  AstronomyPackage: makeComponent(
    "Astronomy Package",
    "Reveals stellar information for nearby star systems, as well as limited planetary data."
  ),
};

// Bodies

export interface Body extends Noun {}

function makeBody(name: string, flavorTextShort?: string): Body {
  return {
    id: `body-${name.replaceAll(" ", "")}`,
    name,
    flavorTextShort,
  };
}

export const BODIES = {
  Probe: makeBody(
    "Probe",
    "Autonomous explorer. Leaves beacon trails as long as it still has beacons."
  ),
  Beacon: makeBody("Beacon", "Relays data to neighboring star systems."),
  OrbitalStorage: makeBody("Orbital Storage", "Warehousing in the void."),
  Truck: makeBody("Truck", "Hauls cargo through wormholes."),
  Spidermech: makeBody("Spidermech", "Constructs and repairs."),
};

// Recipes

export interface CraftingRecipe {
  id: string;
  output: { component: Component } | { body: Body };
  elements?: { element: Element; count: number }[];
  components?: { component: Component; count: number }[];
}

export const RECIPES: CraftingRecipe[] = [
  // Components
  {
    id: "recipe-SensorCommsPackage",
    output: { component: COMPONENTS.SensorCommsPackage },
    elements: [
      { element: ELEMENTS.Minerals, count: 1 },
      { element: ELEMENTS.Crystals, count: 1 },
    ],
  },
  {
    id: "recipe-WormholeClasp",
    output: { component: COMPONENTS.WormholeClasp },
    elements: [
      { element: ELEMENTS.StructuralMaterials, count: 1 },
      { element: ELEMENTS.ElementW, count: 1 },
    ],
  },
  {
    id: "recipe-KineticEngine",
    output: { component: COMPONENTS.KineticEngine },
    elements: [
      { element: ELEMENTS.StructuralMaterials, count: 1 },
      { element: ELEMENTS.Minerals, count: 1 },
      { element: ELEMENTS.Crystals, count: 1 },
      { element: ELEMENTS.ElementK, count: 1 },
    ],
  },
  {
    id: "recipe-AstronomyPackage",
    output: { component: COMPONENTS.AstronomyPackage },
    elements: [
      { element: ELEMENTS.StructuralMaterials, count: 1 },
      { element: ELEMENTS.Minerals, count: 1 },
      { element: ELEMENTS.Crystals, count: 1 },
    ],
  },
  // Bodies
  {
    id: "recipe-Probe",
    output: { body: BODIES.Probe },
    components: [
      { component: COMPONENTS.SensorCommsPackage, count: 1 },
      { component: COMPONENTS.AstronomyPackage, count: 1 },
      { component: COMPONENTS.WormholeClasp, count: 1 },
    ],
  },
  {
    id: "recipe-Beacon",
    output: { body: BODIES.Beacon },
    elements: [{ element: ELEMENTS.StructuralMaterials, count: 1 }],
    components: [{ component: COMPONENTS.SensorCommsPackage, count: 1 }],
  },
  {
    id: "recipe-OrbitalStorage",
    output: { body: BODIES.OrbitalStorage },
    elements: [{ element: ELEMENTS.StructuralMaterials, count: 1 }],
  },
  {
    id: "recipe-Truck",
    output: { body: BODIES.Truck },
    elements: [{ element: ELEMENTS.StructuralMaterials, count: 1 }],
    components: [{ component: COMPONENTS.WormholeClasp, count: 1 }],
  },
  {
    id: "recipe-Spidermech",
    output: { body: BODIES.Spidermech },
    elements: [{ element: ELEMENTS.StructuralMaterials, count: 1 }],
  },
];
