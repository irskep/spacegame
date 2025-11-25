import tracery from "tracery-grammar";

const grammar = tracery.createGrammar({
  peoplename: ["#firstname# #lastname#"],

  firstname: [
    "James",
    "Barnaby",
    "Kim",
    "Maia",
    "Mark",
    "Stephen",
    "Susan",
    "Talia",

    "Thane",
    "Samara",
    "Miranda",
    "Jack",
    "Jacob",
    "Morden",
    "Joker",
    "Garrus",
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

    "Shepard",
    "Krios",
    "Taylor",
    "Solus",
    "Vakerian",
  ],
});

export default grammar;
