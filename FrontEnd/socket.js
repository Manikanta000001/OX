// import {io} from 'socket.io-client'


// const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})

import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://ox-3gl4.onrender.com", {
        transports: ["polling", "websocket"], // websocket first, fallback polling
      autoConnect: false,
    });
  }
  return socket;
};





