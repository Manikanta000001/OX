// import {io} from 'socket.io-client'
import {  toast } from 'react-toastify';


// const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})

import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://ox-3gl4.onrender.com", {
        transports:['websocket'],
      autoConnect: false,
    });
  }
  return socket;
};





