const express = require('express');
const cors = require('cors');
const http = require('http');
const {
  Server
} = require('socket.io');
const app = express()

const mongoose = require('mongoose');
const GameModel = require('./models/Gamemodel');
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
mongoose.connect('mongodb+srv://Manikanta:Manikanta950@cluster0.cnqw0pm.mongodb.net/Users_emp?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("connetected"));
// Games object to store gamestates with respective room ids

app.get("/", (req, res) => {
  const userAgent = req.headers["user-agent"];
  if (userAgent && userAgent.includes("UptimeRobot")) {
    console.log("Pinged by UptimeRobot at:", new Date().toISOString());
    res.json("Pinged by UptimeRobot at:", new Date().toISOString())
  }
  res.json({ status: "ok" });
});

let Games = {};

io.on('connection', (socket) => {
  console.log('user connected: ', socket.id)

  // join the game 
  // socket.on('join-game', ({
  //   roomid,
  //   username
  // }) => {

  //   const game = Games[roomid];

  //   // 1️⃣ Check room capacity BEFORE joining
  //   if (game && game.players.length >= 2) {
  //     socket.emit('roomfull');
  //     return;
  //   }

  //   socket.join(roomid);

  //   socket.data.roomid = roomid;
  //   socket.data.username = username;


  //   //if no room id exists 
  //   if (!Games[roomid]) {
  //     Games[roomid] = {
  //       players: [],
  //       boards: Array(9).fill(null).map(() => ({
  //         cells: Array(9).fill(null),
  //         winner: null
  //       })),
  //       currentplayer: 'X',
  //       activeBoard: null,
  //       bigwinner: null,
  //       strikeline: null
  //     };
  //   }

  //   //if room exits

  //   // 4️⃣ Add player to game
  //   Games[roomid].players.push({
  //     id: socket.id,
  //     userNickname: username
  //   });

  //   // 5️⃣ Notify clients
  //   if (Games[roomid].players.length === 2) {
  //     io.to(roomid).emit('gamestarted');
  //   }
  //   io.to(roomid).emit('Gamestate', Games[roomid]);

  //   // need to checked before removing

  //   // if(Games[roomid].players.length<2)
  //   // {
  //   //     Games[roomid].players.push({id:socket.id,userNickname:username})
  //   //     if(Games[roomid].players.length===2)
  //   //     {
  //   //         io.to(roomid).emit('gamestarted')
  //   //     }
  //   // }
  //   // else{
  //   //     socket.emit('roomfull')
  //   // }

  //   // io.to(roomid).emit('Gamestate',Games[roomid]) //not sending to loading page

  // })

  //modified here !
//   socket.on('join-game', async ({
//     roomid,
//     username
//   }) => {
//     try{
 
//       console.log("join room requested "+roomid+" "+username)
    
//     let game = Games[roomid];

//     if (!game) {
//       // Check if there's a finished game in DB for this room
//       let existingGame = await GameModel.findOne({
//         roomId: roomid
//       });

//       if (existingGame && existingGame.status === "finished") {
//         // Reuse/reset this document
//         game = {
//           players: [],
//           boards: Array(9).fill(null).map(() => ({
//             cells: Array(9).fill(null),
//             winner: null
//           })),
//           currentplayer: 'X',
//           activeBoard: null,
//           bigwinner: null,
//           strikeline: null
//         };
//         Games[roomid] = game;

//         // First player is X
//         game.players.push({
//           id: socket.id,
//           userNickname: username,
//           symbol: "X",
//           status: "connected"
//         });

//         await GameModel.findOneAndUpdate({
//           roomId: roomid
//         }, {
//           $set: {
//             players: game.players,
//             boards: game.boards,
//             currentplayer: game.currentplayer,
//             activeBoard: game.activeBoard,
//             bigwinner: game.bigwinner,
//             strikeline: game.strikeline,
//             status: "active" // reset game
//           }
//         });
//       } else {
//         // No finished doc → create new
//         game = {
//           players: [],
//           boards: Array(9).fill(null).map(() => ({
//             cells: Array(9).fill(null),
//             winner: null
//           })),
//           currentplayer: 'X',
//           activeBoard: null,
//           bigwinner: null,
//           strikeline: null
//         };
//         Games[roomid] = game;

//         game.players.push({
//           id: socket.id,
//           userNickname: username,
//           symbol: "X",
//           status: "connected"
//         });

//         await GameModel.create({
//           roomId: roomid,
//           players: [game.players[0]],
//           boards: game.boards,
//           currentplayer: game.currentplayer,
//           activeBoard: game.activeBoard,
//           bigwinner: game.bigwinner,
//           strikeline: game.strikeline,
//           status: "active"
//         });
//       }
//     } else {
//       // Existing in-memory game → add or reconnect player
//       if (game.players.length >= 2 &&
//         !game.players.some(p => p.userNickname === username)) {
//         socket.emit("roomfull");
//         return;
//       }

//       let player = game.players.find(p => p.userNickname === username);
//       if (player) {
//         player.id = socket.id;
//         player.status = "connected";
//       } else {
//         const symbol = game.players.some(p => p.symbol === "X") ? "O" : "X";
//         player = {
//           id: socket.id,
//           userNickname: username,
//           symbol,
//           status: "connected"
//         };
//         game.players.push(player);
//       }
//       console.log("After Push:")
//       console.log(game.players)

//       await GameModel.findOneAndUpdate({
//         roomId: roomid
//       }, {
//         $set: {
//           players: game.players
//         }
//       });
//     }

//     socket.join(roomid);
//     socket.data.roomid = roomid;
//     socket.data.username = username;

//     if (game.players.filter(p => p.status === "connected").length === 2) {
//       io.to(roomid).emit("gamestarted");
//       io.to(roomid).emit("Gamestate", game);
//       console.log("Gamestate Emitted!!")
//     }
//   }
//   catch(err){
//     console.error("Join-room error:", err);
//   }
// }

// );

// socket.on('join-game', async ({ roomid, username }) => {
//   try {
//     console.log("join room requested", roomid, username);

//     let game = Games[roomid];

//     // 1. If not in memory, try to fetch from DB
//     if (!game) {
//       const existingGame = await GameModel.findOne({ roomId: roomid });

//       if (existingGame) {
//         // Rebuild game object in memory from DB
//         game = {
//           players: existingGame.players,
//           boards: existingGame.boards,
//           currentplayer: existingGame.currentplayer,
//           activeBoard: existingGame.activeBoard,
//           bigwinner: existingGame.bigwinner,
//           strikeline: existingGame.strikeline,
//         };
//         Games[roomid] = game;
//       }
//     }

//     // 2. If still no game, create fresh
//     if (!game) {
//       game = {
//         players: [],
//         boards: Array(9).fill(null).map(() => ({
//           cells: Array(9).fill(null),
//           winner: null,
//         })),
//         currentplayer: 'X',
//         activeBoard: null,
//         bigwinner: null,
//         strikeline: null,
//       };
//       Games[roomid] = game;
//     }

//     // 3. Handle players
//     let player = game.players.find(p => p.userNickname === username);

//     if (player) {
//       // Reconnecting player
//       player.id = socket.id;
//       player.status = "connected";
//     } else {
//       // New player
//       if (game.players.length >= 2) {
//         socket.emit("roomfull");
//         return;
//       }

//       const symbol = game.players.some(p => p.symbol === "X") ? "O" : "X";
//       player = {
//         id: socket.id,
//         userNickname: username,
//         symbol,
//         status: "connected",
//       };
//       game.players.push(player);
//     }

//     // 4. Persist game state in DB (use upsert)
//     await GameModel.findOneAndUpdate(
//       { roomId: roomid },
//       {
//         $set: {
//           players: game.players,
//           boards: game.boards,
//           currentplayer: game.currentplayer,
//           activeBoard: game.activeBoard,
//           bigwinner: game.bigwinner,
//           strikeline: game.strikeline,
//           status: "active",
//         },
//       },
//       { upsert: true }
//     );

//     // 5. Join socket room & set socket data
//     socket.join(roomid);
//     socket.data.roomid = roomid;
//     socket.data.username = username;

//     // 6. Start game if both connected
//     if (game.players.filter(p => p.status === "connected").length === 2) {
//       io.to(roomid).emit("gamestarted");
//       io.to(roomid).emit("Gamestate", game);
//       console.log("Gamestate Emitted!!");
//     }

//   } catch (err) {
//     console.error("Join-game error:", err);
//   }
// });

socket.on('join-game', async ({ roomid, username }) => {
  try {
    console.log("join room requested", roomid, username);

    let game = Games[roomid];

    // 1. If not in memory, check DB
    if (!game) {
      let existingGame = await GameModel.findOne({ roomId: roomid });

      if (!existingGame) {
        // Create fresh game in memory
        console.log("Createing a fresh room : "+roomid)
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
        console.log("loading a  room : "+roomid)

        game = {
          players: existingGame.players,
          boards: existingGame.boards,
          currentplayer: existingGame.currentplayer,
          activeBoard: existingGame.activeBoard,
          bigwinner: existingGame.bigwinner,
          strikeline: existingGame.strikeline,
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
    await GameModel.findOneAndUpdate(
      { roomId: roomid },
    { $set: { players: game.players } }
    );

    // 4. Join socket room
    socket.join(roomid);
    socket.data.roomid = roomid;
    socket.data.username = username;

    // 5. Start game if both connected
    if (game.players.filter(p => p.status === "connected").length === 2) {
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

  //chudham

  // socket.on("reconnectRoom", ({
  //   roomId
  // }) => {
  //   const game = rooms[roomId];
  //   if (game) {
  //     socket.join(roomId);
  //     console.log(`♻️ ${socket.id} reconnected to ${roomId}`);
  //     socket.emit("updateGame", game);
  //   }
  // });
  // modified here !
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

  //modifications
  socket.on('requestRematch', (roomid) => {
    socket.to(roomid).emit('rematchRequest')
  })
  // socket.on('AcceptRematch',(roomid)=>{
  //     if(Games[roomid]){

  //         Games[roomid].boards=Array(9).fill(null).map(()=>({cells:Array(9).fill(null),winner:null}))
  //         Games[roomid].currentplayer='X'
  //         Games[roomid].activeBoard=null
  //         Games[roomid].bigwinner=null
  //         Games[roomid].strikeline=null
  //         io.to(roomid).emit('rematchAccepted')
  //     }

  // })


  // modified here !

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

  // //someone left -- both navigated to homepage -- removes roomid
  // socket.on('leaveGame', (roomid) => {

  //   if (Games[roomid]) {
  //     socket.to(roomid).emit('playerleft') //navigating the rejected person to homepage with notification
  //     delete Games[roomid]
  //   }
  // })

  // modified here!
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
      await GameModel.findOneAndUpdate({
        roomId: roomid
      }, {
        status: "finished"
      });
      delete Games[roomid];
    }

  })

  // socket.on('disconnect', () => {

  //   // need to be checked before updation

  //   // for(const roomid in Games)
  //   // {
  //   //     const room =Games[roomid]
  //   //     Games[roomid].players=Games[roomid].players.filter((player)=>player.id!==socket.id)// identifing the players who are not disconnected

  //   //     if(Games[roomid].players.length<2){

  //   //         socket.to(roomid).emit('playerdisconnected',()=>{
  //   //           if(Games[roomid]){
  //   //             Games[roomid].boards=Array(9).fill(null).map(()=>({cells:Array(9).fill(null),winner:null}))
  //   //             Games[roomid].currentplayer='X'
  //   //             Games[roomid].activeBoard=null
  //   //             Games[roomid].bigwinner=null
  //   //             Games[roomid].strikeline=null
  //   //             io.to(roomid).emit("Gamestate",Games[roomid])
  //   //           }
  //   //         })
  //   //         if(Games[roomid].players.length===0){
  //   //         delete Games[roomid]
  //   //         break;
  //   //         }
  //   //     }
  //   // }

  //   // need to be checked 

  //   const roomid = socket.data.roomid;
  //   if (!roomid || !Games[roomid]) return;

  //   // Remove the player from game
  //   Games[roomid].players = Games[roomid].players.filter(p => p.id !== socket.id);

  //   // Notify the other player
  //   socket.to(roomid).emit('playerdisconnected', socket.data.username);

  //   // If room empty, delete it
  //   if (Games[roomid].players.length === 0) {
  //     delete Games[roomid];
  //   }



  // })
  //  modfied here !
  socket.on('disconnect', async () => {

    const roomid = socket.data ?.roomid;
    if (!roomid || !Games[roomid]) return;

    const game = Games[roomid];
    const player = game.players.find(p => p.id === socket.id);

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
      await GameModel.findOneAndUpdate({
        roomId: roomid
      }, {
        status: "finished"
      });
      delete Games[roomid];
    }



  })


})

server.listen(PORT, () => console.log("server running on port ", PORT))