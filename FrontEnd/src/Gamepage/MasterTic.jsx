import React, { useRef } from "react";
import { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useNavigationType,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import BigTic from "./components/BigTic";
import tileclickasset from "../Audio/click.mp3";
import Whonext from "./components/Whonext";
import Model from "./components/PopUpModel/model.jsx";
import "./MasterTic.css";
import socket from "../../socket.js";
import useLocalStorage from "use-local-storage";

const tileclicksound = new Audio(tileclickasset);
tileclicksound.volume = 0.3;

const MasterTic = () => {
  const { roomid, username } = useParams();
  const [boards, setboards] = useState([]);
  const [currentplayer, setcurrentplayer] = useState("X");
  const [activeBoard, setactiveBoard] = useState(null);
  const [bigwinner, setbigwinner] = useState(null);
  const [playersymbol, setplayersymbol] = useState(null);
  const [strikeline, setstrikeline] = useState(null);
  const [rematcRequested, setrematcRequested] = useState(false);
  const [waitingforRematch, setwaitingforRematch] = useState(false);
  const [gameplayers, setgameplayers] = useState([]);
  const [isdark, setisdarkk] = useLocalStorage("isDark", true);
  const tileClickRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  //handling each move

  const handlemove = (boardIndex, cellIndex) => {
    if (!gameplayers[1]) return;
    if (bigwinner || playersymbol !== currentplayer) return;
    if (activeBoard !== null && boardIndex !== activeBoard) return;
    socket.emit("move", { roomid, boardIndex, cellIndex });
    if (tileClickRef.current) {
      tileClickRef.current.currentTime = 0;
      tileClickRef.current.play().catch(() => {
        console.log("error playing sound");
      });
    }
  };
  // server side working functions

  const handleleave = () => {
    socket.emit("leaveGame", roomid);
    navigate("/");
  };
  const handleRematchRequest = () => {
    socket.emit("requestRematch", roomid);
    setrematcRequested(true);
  };
  const handleAcceptRematch = () => {
    socket.emit("AcceptRematch", roomid);
  };
  const handleRejectRematch = () => {
    socket.emit("rejectRematch", roomid);
    navigate("/");
  };

  const resetGame = () => {
    setboards(
      Array(9)
        .fill(null)
        .map(() => ({ cells: Array(9).fill(null), winner: null }))
    );
    setcurrentplayer("X");
    setactiveBoard(null);
    setbigwinner(null);
    setstrikeline(null);
  };
  // useeffect to automate the reload when popstate occurs and also for preloading the video
  useEffect(() => {
    const handlepop = (event) => {
      if (window.location.pathname.startsWith("/game")) {
        window.location.reload();
      }
    };
    window.onpopstate = handlepop;

    tileClickRef.current = new Audio(tileclickasset);
    tileClickRef.current.volume = 1;
    tileClickRef.current.load(); // preload

    return () => {
      window.onpopstate = null;
    };
  }, []);

  useEffect(() => {
    //initial request to server

    socket.emit("requestInitialGamestate", roomid);

    //getting the gamestate from server

    socket.on("Gamestate", (gamestate) => {
      setboards(gamestate.boards);
      setcurrentplayer(gamestate.currentplayer);
      setactiveBoard(gamestate.activeBoard);
      setbigwinner(gamestate.bigwinner);
      setstrikeline(gamestate.strikeline);
      setplayersymbol(
        gamestate.players[0].id === socket.id
          ? "X"
          : gamestate.players[1].id === socket.id
          ? "O"
          : null
      );
      setgameplayers(gamestate.players);
    });

    // socket.on("playerleft",()=>{
    //   toast.info("Player Left")
    //   setTimeout(() => {
    //     navigate('/')

    //   }, 3500);
    // })
    //modified here!
    socket.on("playerleft", (username, gamestate) => {
      toast.info(`${username} Left`);
      setgameplayers(gamestate.players);
    });

    socket.on("rematchRequest", () => {
      setwaitingforRematch(true);
    });

    socket.on("rematchAccepted", () => {
      toast.info("Rematch Accepted");
      resetGame();
      setrematcRequested(false);
      setwaitingforRematch(false);
    });

    socket.on("rematchRejected", () => {
      toast.info("Rematch Rejected");
      setTimeout(() => {
        navigate("/");
      }, 3500);
    });
    // socket.on("playerdisconnected",()=>{
    //   toast.info("Player Disconnected")
    // })

    //     socket.on("playerdisconnected",(username)=>{
    //   toast.info(`${username} Disconnected`);
    // })
    //modified here!

    socket.on("playerdisconnected", (players, gamestate) => {
      toast.info(`${players.userNickname} Disconnected`);
      setgameplayers(gamestate.players);
    });

    socket.on("reconnect_attempt", (n) => {
      console.log("🔄 Reconnect attempt:", n);
    });

    socket.on("reconnect", (n) => {
      console.log("✅ Reconnected after", n, "tries");

      // Ask server to restore game state
      socket.emit("reconnectRoom", { roomId: roomid });
    });

    socket.on("updateGame", (game) => {
      console.log("🎮 Game state synced:", game);
    });

    // Handle connection

    //cleaing the events

    return () => {
      socket.off("Gamestate");
      socket.off("playerleft");
      socket.off("rematchRequest");
      socket.off("rematchAccepted");
      socket.off("rematchRejected");
      socket.off("playerdisconnected");
    };
  }, [navigate]);

  //controlling the exception (when player disconnected instead of rematch)
  useEffect(() => {
    if (gameplayers.length === 1 && rematcRequested) {
      toast.info("Redirecting");
      socket.emit("leaveGame", roomid);
      setTimeout(() => {
        navigate("/");
      }, 3500);
    }
  }, [gameplayers]);

  return (
    <>
      <div className="Maincontainer" data-theme={isdark ? "dark" : "light"}>
        <div
          className="theme-switcher"
          onClick={() => {
            setisdarkk(!isdark);
          }}
        >
          <i class="fa-solid fa-sun"></i>
          <i class="fa-solid fa-moon"></i>
        </div>
        <Whonext
          currentplayer={currentplayer}
          playersymbol={playersymbol}
          bigwinner={bigwinner}
          username={username}
          gameplayers={gameplayers}
          datatheme="light"
        />
        {/* showing rematch after the win for both the players */}
        {bigwinner && !rematcRequested && !waitingforRematch && (
          <button className="rematchbtn" onClick={handleRematchRequest}>
            <span className="hideonmobile hideforlargetabs">Rematch</span>{" "}
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        )}

        {/* showing accept or reject rematch buttons ....They are send as popup model*/}

        {/* show waiting for opponets response */}
        {rematcRequested && (
          <div className="mini-loader">
            <p>waiting for opponent to accept</p> <div class="loader"></div>
          </div>
        )}
        <button className="leavebtn" onClick={handleleave}>
          <span className="hideonmobile hideforlargetabs">Leave</span>{" "}
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>

        <BigTic
          boards={boards}
          activeBoard={activeBoard}
          handlemove={handlemove}
          bigwinner={bigwinner}
          currentplayer={currentplayer}
          playersymbol={playersymbol}
          strikeline={strikeline}
        />
      </div>
      <Model
        open={waitingforRematch}
        handleAcceptRematch={handleAcceptRematch}
        handleRejectRematch={handleRejectRematch}
        username={username}
        gameplayers={gameplayers}
      />
    </>
  );
};

export default MasterTic;
