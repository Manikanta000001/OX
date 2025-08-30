const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for OAuth
  googleId: { type: String }, // for Google OAuth
  name: { type: String, required: true }, // display name

  avatar: { type: String, default: '' }, // URL to avatar/profile picture
  statusMessage: { type: String, default: '' }, // user-set status
  isOnline: { type: Boolean, default: false },
  isInGame: { type: Boolean, default: false },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OxUser' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OxUser' }],

  gamesPlayed: [
    {
      opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'OxUser' },
      result: { type: String, enum: ['win', 'lose', 'draw'] },
      boardSnapshot: { type: String },
      playedAt: { type: Date, default: Date.now }
    }
  ],

  totalWins: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },

  notifications: [
    {
      type: { type: String }, // e.g. 'friendOnline', 'gameInvite'
      content: { type: String },
      read: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('OxUser', UserSchema);
