import tracery from "tracery-grammar";

const grammar = tracery.createGrammar({
  peoplename: ["#firstname# #lastname"],

  firstname: [
    "James",
    "Barnaby",
    "Kim",
    "Maia",
    "Mark",
    "Stephen",
    "Susan",
    "Talia",
  ],

  lastname: [
    "Winters",
    "Garibaldi",
    "Ivanovich",
    "Mollari",
    "Sheridan",
    "Sinclair",
    "Clark",
    "Reynolds",
  ],
});

export default grammar;
