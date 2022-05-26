import tracery from "tracery-grammar";

const grammar = tracery.createGrammar({
  shipname: ["#adj# #noun#"],

  adj: [
    "Bright",
    "Dark",
    "Lost",
    "Brave",
    "Shining",
    "Intrepid",
    "Swift",
    "Surly",
  ],

  noun: [
    "Bird",
    "Sparrow",
    "Wasp",
    "Squirrel",
    "Fox",
    "Worm",
    "Spider",
    "Arrow",
  ],
});

export default grammar;
