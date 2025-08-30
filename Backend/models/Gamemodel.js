// models/Game.js
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: String },                 // socket ID or unique session
  userNickname: { type: String },
  symbol: { type: String, enum: ["X", "O"] },
  status: { 
    type: String, 
    enum: ["connected", "disconnected", "left"], 
    default: "connected" 
  },
});

const gameSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  players: [playerSchema], // now players have individual status
  boards: { type: Array, default: [] },
  currentplayer: { type: String, default: "X" },
  activeBoard: { type: Number, default: null },
  bigwinner: { type: String, default: null },
  strikeline: { type: String, default: null },
  status: { type: String, enum: ["active", "finished"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Games", gameSchema);