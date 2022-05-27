import { RNG } from "@/game/framework/RNG";
import { Vector2 } from "@/game/framework/Vector2";
import { Star } from "@/game/exploration/types/Star";
import { Galaxy } from "@/game/exploration/types/Galaxy";
import { distance } from "@/game/framework/util";
import shortUUID from "short-uuid";

export const MIN_STAR_SPACE = 40;
const MAX_STAR_SPACE = 80;

export function generateStars(
  seed: string,
  n = 100,
  size = { x: 800, y: 600 }
): Galaxy {
  const g = new Galaxy(size);

  const rng = new RNG(seed);

  const makeStarID = () => {
    return shortUUID.generate();
  };

  const centerStar: Star = {
    id: makeStarID(),
    point: { x: 400, y: 300 },
    slots: rng.getSlots(6),
  };
  const openStars = [centerStar];
  g.addStar(centerStar);

  let numPlaced = 0;
  let iters = 0;
  while (numPlaced < n && iters < n * 10) {
    if (openStars.length <= 0) {
      console.warn(
        "Ran out of stars at",
        numPlaced,
        "stars and",
        iters,
        "iters"
      );
      break;
    }
    iters += 1;
    const s = rng.choice(openStars);
    const slot = rng.chooseAndRemove(s.slots);
    if (!s.slots.length) {
      openStars.splice(openStars.indexOf(s), 1);
    }

    const dist = rng.float(MIN_STAR_SPACE, MIN_STAR_SPACE * 1.2);
    const p1: Vector2 = s.point;
    const p2: Vector2 = {
      x: Math.floor(p1.x + Math.cos(slot) * dist),
      y: Math.floor(p1.y + Math.sin(slot) * dist),
    };

    if (!g.getIsNewPointAllowed(p2)) continue;

    const newStar: Star = {
      id: makeStarID(),
      point: p2,
      slots: rng.getSlots(rng.int(3, 6)),
    };
    g.addStar(newStar);
    g.connect(s.id, newStar.id);
    openStars.push(newStar);
    numPlaced += 1;
  }

  for (const id1 in g.stars) {
    const s1 = g.stars[id1];
    for (const id2 in g.stars) {
      if (id2 === id1) continue;
      if (g.getIsConnected(id1, id2)) continue;
      const s2 = g.stars[id2];
      if (
        distance(s1.point, s2.point) < MAX_STAR_SPACE &&
        g.getIsConnectionAllowed(s1, s2) &&
        rng.getRandom() < 0.2 // only connect half of possible pairs
      ) {
        g.connect(id1, id2);
      }
    }
  }

  return g;
}
