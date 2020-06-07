import seedrandom from "seedrandom";
export class RNG {
  getRandom: () => number;

  constructor(seed: string) {
    this.getRandom = seedrandom(seed);
  }

  int(minInclusive: number, maxExclusive: number): number {
    return minInclusive + Math.floor(this.getRandom() * maxExclusive);
  }

  float(min: number, max: number): number {
    return min + this.getRandom() * (max - min);
  }

  choice<T>(items: Array<T>): T {
    return items[Math.floor(this.getRandom() * items.length)];
  }

  chooseAndRemove<T>(items: Array<T>): T {
    const ix = Math.floor(this.getRandom() * items.length);
    return items.splice(ix, 1)[0];
  }

  // Gives back N values between 0 and Math.PI * 2, where values are evenly
  // distributed but start at a random place
  getSlots(n: number): number[] {
    const slots = new Array<number>();
    let last = this.getRandom();
    for (let i = 0; i < n; i++) {
      if (last > Math.PI * 2) last -= Math.PI * 2;
      slots.push(last);
      last += (Math.PI * 2) / n;
    }
    return slots;
  }
}
