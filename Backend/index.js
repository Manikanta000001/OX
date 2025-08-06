const express=require('express');
const cors=require('cors');
const http=require('http');
const {Server}=require('socket.io');
const app =express()
const PORT=process.env.PORT || "3001";
const server =http.createServer(app)
app.use(cors())
const io =new Server(server,{cors:
    {
        origin:"https://oxfrontend.vercel.app/",
        methods:['GET','POST']
    }
})

// Games object to store gamestates with respective room ids
app.get('/',(req,res)=>{
    res.send("Deployed pedhamanishi")
})
let Games={};

io.on('connection',(socket)=>{
    console.log('user connected: ',socket.id)

    // join the game 
    socket.on('join-game',({roomid,username})=>{

        const game = Games[roomid];
        
        // 1️⃣ Check room capacity BEFORE joining
    if (game && game.players.length >= 2) {
      socket.emit('roomfull');
      return; 
    }

        socket.join(roomid);

        socket.data.roomid = roomid;
        socket.data.username = username;


        //if no room id exists 
        if(!Games[roomid]){
            Games[roomid]={
                players:[],
                boards:Array(9).fill(null).map(()=>({cells:Array(9).fill(null),winner:null})),
                currentplayer:'X',
                activeBoard:null,
                bigwinner:null,
                strikeline:null
            };
        }

        //if room exits

          // 4️⃣ Add player to game
        Games[roomid].players.push({ id: socket.id, userNickname: username });

    // 5️⃣ Notify clients
        if (Games[roomid].players.length === 2) {
        io.to(roomid).emit('gamestarted');
        }
        io.to(roomid).emit('Gamestate', Games[roomid]);

       // need to checked before removing
       
        // if(Games[roomid].players.length<2)
        // {
        //     Games[roomid].players.push({id:socket.id,userNickname:username})
        //     if(Games[roomid].players.length===2)
        //     {
        //         io.to(roomid).emit('gamestarted')
        //     }
        // }
        // else{
        //     socket.emit('roomfull')
        // }
        
        // io.to(roomid).emit('Gamestate',Games[roomid]) //not sending to loading page

    })
    
    socket.on('requestInitialGamestate',(roomid)=>{
        io.to(roomid).emit('Gamestate',Games[roomid]) //sending gamesate to Gamepage
        
    })

    socket.on('move',({roomid,boardIndex,cellIndex})=>{
        let game =Games[roomid];
        if(!game||game.bigwinner||game.boards[boardIndex].cells[cellIndex]!==null) return //preventing same cell clicks

        // need to be checked before changes

        if(socket.id!==game.players[game.currentplayer==='X'?0:1].id) return // preventing extra moves

        game.boards[boardIndex].cells[cellIndex]=game.currentplayer;
    
        const checkwinner=(board)=>{
            const patterns=[
              {combo:[0,1,2],strikeline:'strike-row-1'},
              {combo:[3,4,5],strikeline:'strike-row-2'},
              {combo:[6,7,8],strikeline:'strike-row-3'},
              //columns
              {combo:[0,3,6],strikeline:'strike-column-1'},
              {combo:[1,4,7],strikeline:'strike-column-2'},
              {combo:[2,5,8],strikeline:'strike-column-3'},
              //diagonals
              {combo:[0,4,8],strikeline:'strike-diagonal-1'},
              {combo:[2,4,6],strikeline:'strike-diagonal-2'}
            ]
          
            for(let pattern of patterns)
            {
              const [a,b,c]=pattern.combo;
              if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
                
                return [board[a],pattern.strikeline]; //return x or o (winner)
              }
            }
            return board.includes(null)?[null]:["Tie"];
          }

        const boardwinner=checkwinner(game.boards[boardIndex].cells);
        if(boardwinner[0]) {
            game.boards[boardIndex].winner=boardwinner[0];
        }
      //checking for the overal winner here
      const largeboradsate=game.boards.map((b)=>b.winner);
      const bigwinner=checkwinner(largeboradsate);
      if (bigwinner[0]) {
        game.bigwinner=bigwinner[0];
        game.strikeline=bigwinner[1];
        
      }
      game.activeBoard=game.boards[cellIndex].winner?null:cellIndex;
      game.currentplayer=game.currentplayer==="X"?"O":"X";


      io.to(roomid).emit("Gamestate",game)

     


    })

    //modifications
    socket.on('requestRematch',(roomid)=>{
        socket.to(roomid).emit('rematchRequest')
    })
    socket.on('AcceptRematch',(roomid)=>{
        if(Games[roomid]){

            Games[roomid].boards=Array(9).fill(null).map(()=>({cells:Array(9).fill(null),winner:null}))
            Games[roomid].currentplayer='X'
            Games[roomid].activeBoard=null
            Games[roomid].bigwinner=null
            Games[roomid].strikeline=null
            io.to(roomid).emit('rematchAccepted')
        }

    })
    //someone rejected -- both navigated to homepage -- removes roomid
    socket.on('rejectRematch',(roomid)=>{
        if(Games[roomid])
            {
                socket.to(roomid).emit('rematchRejected') //navigating the rejected person to homepage with notification
                delete Games[roomid]
            }

    })

    //someone left -- both navigated to homepage -- removes roomid
    socket.on('leaveGame',(roomid)=>{
        
        if(Games[roomid])
        {
            socket.to(roomid).emit('playerleft') //navigating the rejected person to homepage with notification
            delete Games[roomid]
        }
    })
    

    socket.on('disconnect',()=>{

        // need to be checked before updation

        // for(const roomid in Games)
        // {
        //     const room =Games[roomid]
        //     Games[roomid].players=Games[roomid].players.filter((player)=>player.id!==socket.id)// identifing the players who are not disconnected

        //     if(Games[roomid].players.length<2){

        //         socket.to(roomid).emit('playerdisconnected',()=>{
        //           if(Games[roomid]){
        //             Games[roomid].boards=Array(9).fill(null).map(()=>({cells:Array(9).fill(null),winner:null}))
        //             Games[roomid].currentplayer='X'
        //             Games[roomid].activeBoard=null
        //             Games[roomid].bigwinner=null
        //             Games[roomid].strikeline=null
        //             io.to(roomid).emit("Gamestate",Games[roomid])
        //           }
        //         })
        //         if(Games[roomid].players.length===0){
        //         delete Games[roomid]
        //         break;
        //         }
        //     }
        // }

        // need to be checked 
        
        const roomid = socket.data.roomid;
    if (!roomid || !Games[roomid]) return;

    // Remove the player from game
    Games[roomid].players = Games[roomid].players.filter(p => p.id !== socket.id);

    // Notify the other player
    socket.to(roomid).emit('playerdisconnected', socket.data.username);

    // If room empty, delete it
    if (Games[roomid].players.length === 0) {
      delete Games[roomid];
    }

               
           
        })
        
    })
 
server.listen(PORT,()=>console.log("server running on port ",PORT))
