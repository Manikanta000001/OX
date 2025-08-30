// import {io} from 'socket.io-client'


// const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})

import {
  io
} from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://ox-3gl4.onrender.com", {
      transports: ["websocket", "polling"], // allow fallback
      autoConnect: false,
      reconnection: true, // retry on failure
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};