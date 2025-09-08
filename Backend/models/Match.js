const mongoose = require("mongoose");

const matchPlayerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  }, // socket.id or session id
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  }, // optional: future user system
  userNickname: {
    type: String,
    required: true,
  }, // alias or chosen name
  symbol: {
    type: String,
    enum: ["X", "O"],
    required: true,
  },
  result: {
    type: String,
    enum: ["win", "lose", "draw"],
    default: "draw",
  },
});

const boardSchema = new mongoose.Schema({
  cells: {
    type: [String],
    default: Array(9).fill(null),
  }, // each small board
  winner: {
    type: String,
    default: null,
  },
});

const matchSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  players: [matchPlayerSchema], // both players with details

  // full game snapshot
  boards: {
    type: [boardSchema],
    default: [],
  },
  currentplayer: {
    type: String,
    default: "X",
  },
  activeBoard: {
    type: Number,
    default: null,
  },
  bigwinner: {
    type: String,
    default: null,
  },
  strikeline: {
    type: String,
    default: null,
  },

  winner: {
    type: String,
    default: null,
  }, // "X" / "O" / "Tie"
  status: {
    type: String,
    enum: ["finished", "uncompleted"],
    default: "uncompleted",
    required: true,
  },

  finishedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Matches", matchSchema);
