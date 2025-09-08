const express = require('express');
const cors = require('cors');
const http = require('http');
const {
  Server
} = require('socket.io');
const app = express()

const mongoose = require('mongoose');
const GameModel = require('./models/Gamemodel');
const MatchModel = require("./models/Match");

const PORT = process.env.PORT || "3001";
const server = http.createServer(app)
app.use(cors())
const io = new Server(server, {
  // https://oxfrontend.vercel.app/
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
})
mongoose.connect('mongodb+srv://Manikanta:Manikanta950@cluster0.cnqw0pm.mongodb.net/Users_emp?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("connetected"));
// Games object to store gamestates with respective room ids

app.get("/", (req, res) => {
  const userAgent = req.headers["user-agent"];
  if (userAgent && userAgent.includes("UptimeRobot")) {
    console.log("Pinged by UptimeRobot at:", new Date().toISOString());

  }
  res.json({
    status: "ok"
  });
});

let Games = {};

io.on('connection', (socket) => {
  console.log('user connected: ', socket.id)


  socket.on('join-game', async ({
    roomid,
    username
  }) => {
    try {
      console.log("join room requested", roomid, username);

      let game = Games[roomid];

      // 1. If not in memory, check DB
      if (!game) {
        let existingGame = await GameModel.findOne({
          roomId: roomid
        });

        if (!existingGame) {
          // Create fresh game in memory
          console.log("Createing a fresh room : " + roomid)
          game = {
            players: [],
            boards: Array(9).fill(null).map(() => ({
              cells: Array(9).fill(null),
              winner: null,
            })),
            currentplayer: 'X',
            activeBoard: null,
            bigwinner: null,
            strikeline: null,
            historySaved: false,
            cleanupTimer: null
          };

          // Persist new game
          await GameModel.create({
            roomId: roomid,
            players: game.players,
            boards: game.boards,
            currentplayer: game.currentplayer,
            activeBoard: game.activeBoard,
            bigwinner: game.bigwinner,
            strikeline: game.strikeline,
            status: "active"
          });

        } else {
          // Load from DB into memory
          console.log("loading a  room : " + roomid)


          game = {
            players: existingGame.players,
            boards: existingGame.boards,
            currentplayer: existingGame.currentplayer,
            activeBoard: existingGame.activeBoard,
            bigwinner: existingGame.bigwinner,
            strikeline: existingGame.strikeline,
            historySaved: false,
            cleanupTimer: null
          };
        }

        Games[roomid] = game;
      }

      // 2. Handle players
      let player = game.players.find(p => p.userNickname === username);

      if (player) {
        // Reconnecting
        player.id = socket.id;
        player.status = "connected";
        if (game.cleanupTimer) {
          clearTimeout(game.cleanupTimer);
          game.cleanupTimer = null;
          console.log(`✅ Cleanup timer cancelled for room ${roomid} (player ${username} reconnected)`);
        }
      } else {
        if (game.players.length >= 2) {
          socket.emit("roomfull");
          return;
        }

        const symbol = game.players.some(p => p.symbol === "X") ? "O" : "X";
        player = {
          id: socket.id,
          userNickname: username,
          symbol,
          status: "connected",
        };
        game.players.push(player);
      }

      // 3. Update DB only if already exists
      await GameModel.findOneAndUpdate({
        roomId: roomid
      }, {
        $set: {
          players: game.players
        }
      });

      // 4. Join socket room
      socket.join(roomid);
      socket.data.roomid = roomid;
      socket.data.username = username;

      // 5. Start game if both connected
      if (game.players.filter(p => p.status === "connected").length === 2 || (game.players.length === 2 && game.players.some(p => p.status === "connected"))) {
        io.to(roomid).emit("gamestarted");
        io.to(roomid).emit("Gamestate", game);
        console.log("Gamestate Emitted!!");
      }

    } catch (err) {
      console.error("Join-game error:", err);
    }
  });


  socket.on('requestInitialGamestate', (roomid) => {
    io.to(roomid).emit('Gamestate', Games[roomid])
    console.log("This is game" + Games[roomid]) //sending gamesate to Gamepage

  })


  socket.on('move', async ({
    roomid,
    boardIndex,
    cellIndex
  }) => {
    let game = Games[roomid];
    if (!game || game.bigwinner || game.boards[boardIndex].cells[cellIndex] !== null) return //preventing same cell clicks

    // need to be checked before changes

    if (socket.id !== game.players[game.currentplayer === 'X' ? 0 : 1].id) return // preventing extra moves

    game.boards[boardIndex].cells[cellIndex] = game.currentplayer;

    const checkwinner = (board) => {
      const patterns = [{
          combo: [0, 1, 2],
          strikeline: 'strike-row-1'
        },
        {
          combo: [3, 4, 5],
          strikeline: 'strike-row-2'
        },
        {
          combo: [6, 7, 8],
          strikeline: 'strike-row-3'
        },
        //columns
        {
          combo: [0, 3, 6],
          strikeline: 'strike-column-1'
        },
        {
          combo: [1, 4, 7],
          strikeline: 'strike-column-2'
        },
        {
          combo: [2, 5, 8],
          strikeline: 'strike-column-3'
        },
        //diagonals
        {
          combo: [0, 4, 8],
          strikeline: 'strike-diagonal-1'
        },
        {
          combo: [2, 4, 6],
          strikeline: 'strike-diagonal-2'
        }
      ]

      for (let pattern of patterns) {
        const [a, b, c] = pattern.combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {

          return [board[a], pattern.strikeline]; //return x or o (winner)
        }
      }
      return board.includes(null) ? [null] : ["Tie"];
    }

    const boardwinner = checkwinner(game.boards[boardIndex].cells);
    if (boardwinner[0]) {
      game.boards[boardIndex].winner = boardwinner[0];
    }
    //checking for the overal winner here
    const largeboradsate = game.boards.map((b) => b.winner);
    const bigwinner = checkwinner(largeboradsate);
    if (bigwinner[0]) {
      game.bigwinner = bigwinner[0];
      game.strikeline = bigwinner[1];

    }
    game.activeBoard = game.boards[cellIndex].winner ? null : cellIndex;
    game.currentplayer = game.currentplayer === "X" ? "O" : "X";
    console.log(game)

    if (game.bigwinner || bigwinner[0] === "Tie") {
      await saveMatchHistory(roomid, game);
      console.log("📖 Match saved at game finish (winner or tie) roomd id By WinnerRequest:" + roomid);
    }
    //modified here !

    await GameModel.findOneAndUpdate({
      roomId: roomid
    }, {
      boards: game.boards,
      currentplayer: game.currentplayer,
      activeBoard: game.activeBoard,
      bigwinner: game.bigwinner,
      strikeline: game.strikeline
    });

    io.to(roomid).emit("Gamestate", game)




  })


  socket.on('requestRematch', (roomid) => {
    socket.to(roomid).emit('rematchRequest')
  })


  socket.on('AcceptRematch', async (roomid) => {

    const game = Games[roomid];
    if (!game) return;

    // reset game state
    game.boards = Array(9).fill(null).map(() => ({
      cells: Array(9).fill(null),
      winner: null
    }));
    game.currentplayer = "X";
    game.activeBoard = null;
    game.bigwinner = null;
    game.strikeline = null;

    await GameModel.findOneAndUpdate({
      roomId: roomid
    }, {
      $set: {
        boards: game.boards,
        currentplayer: game.currentplayer,
        activeBoard: game.activeBoard,
        bigwinner: game.bigwinner,
        strikeline: game.strikeline,
        status: "active-rematch" // restart the game
      }
    });

    io.to(roomid).emit("rematchAccepted", game);

  })

  //someone rejected -- both navigated to homepage -- removes roomid
  socket.on('rejectRematch', (roomid) => {
    if (Games[roomid]) {
      socket.to(roomid).emit('rematchRejected') //navigating the rejected person to homepage with notification
      delete Games[roomid]
    }

  })


  //someone left -- both navigated to homepage -- removes roomid
  socket.on('leaveGame', async (roomid) => {

    if (!Games[roomid]) return;

    const game = Games[roomid];
    const player = game.players.find(p => p.id === socket.id);
    if (player) {
      player.status = "left";
      await GameModel.findOneAndUpdate({
        roomId: roomid,
        "players.userNickname": player.userNickname
      }, {
        $set: {
          "players.$.status": "left"
        }
      });

      socket.to(roomid).emit("playerleft", player.userNickname, game);
    }

    // If everyone left, cleanup
    if (game.players.every(p => p.status === "left")) {
      await saveMatchHistory(roomid, game);
      console.log("📖 Trying to save Match history for room By LeaveRequest:", roomid);

      // await GameModel.findOneAndUpdate({
      //   roomId: roomid
      // }, {
      //   status: "finished"
      // });

      await GameModel.deleteOne({
        roomId: roomid
      });
      delete Games[roomid];
      console.log(`🗑️ Room ${roomid} deleted (leave case)`);
      return
    }

  })



  // needs to be changed
  socket.on('disconnect', async () => {

    const roomid = socket.data ?.roomid;

    if (!roomid || !Games[roomid]) return;

    const game = Games[roomid];
    const player = game.players.find(p => p.id === socket.id);
    console.log("disconnected " + player)

    if (player) {
      player.status = "disconnected";
      await GameModel.findOneAndUpdate({
        roomId: roomid,
        "players.userNickname": player.userNickname
      }, {
        $set: {
          "players.$.status": "disconnected"
        }
      });

      socket.to(roomid).emit("playerdisconnected", player, game);
    }

    // Cleanup if all players left/disconnected
    if (game.players.every(p => p.status !== "connected")) {

      console.log(`⏳ All players disconnected in room ${roomid}, starting 2 min timer...`);
      if (game.cleanupTimer) return;

      game.cleanupTimer = setTimeout(async () => {
        try {
          // Double check: if still no one reconnected
          if (game.players.every(p => p.status !== "connected")) {
            await saveMatchHistory(roomid, game);
            console.log("📖 Match history saved after timeout for room:", roomid);

            await GameModel.deleteOne({
              roomId: roomid
            });
            delete Games[roomid];
            console.log(`🗑️ Room ${roomid} deleted (disconnect timeout)`);
          }
        } catch (err) {
          console.error("❌ Error during disconnect cleanup:", err);
        }
      }, 2 * 60 * 1000);
    }


  })

})
async function saveMatchHistory(roomid, game) {
  try {
    if (game.historySaved) {
      console.log("Game was already recorded ");
      return;
    }
    const matchStatus = game.bigwinner ? "finished" : "uncompleted";

    let winner = null;
    if (game.bigwinner) {
      winner = game.bigwinner;
    } else {
      // check if it's a tie (all boards filled and no bigwinner)
      const allBoardsDecided = game.boards.every(b => b.winner !== null);
      if (allBoardsDecided && !game.bigwinner) {
        winner = "Tie";
      }
    }



    const matchDoc = new MatchModel({
      roomId: roomid,
      players: game.players.map(p => ({
        playerId: p.id,
        userId: p.userId || null,
        userNickname: p.userNickname,
        symbol: p.symbol,
        result: winner === "Tie" ?
          "draw" : (winner === p.symbol ? "win" : "lose")
      })),
      boards: game.boards,
      currentplayer: game.currentplayer,
      activeBoard: game.activeBoard,
      bigwinner: game.bigwinner,
      strikeline: game.strikeline,
      winner: winner,
      status: matchStatus
    });

    await matchDoc.save();
    game.historySaved = true;
    console.log("✅ Match history saved for room:", roomid);
  } catch (err) {
    console.error("❌ Error saving match history:", err);
  }
}

server.listen(PORT, () => console.log("server running on port ", PORT))