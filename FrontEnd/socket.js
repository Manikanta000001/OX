// import {io} from 'socket.io-client'


// const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})

import { io } from "socket.io-client";

const socket = io("https://ox-3gl4.onrender.com", {
  transports: ['polling', 'websocket'], // force WebSocket, skip polling if you want
  reconnection: true,        // enable auto reconnect
  reconnectionAttempts: 5,   // number of attempts
  reconnectionDelay: 1000,   // delay between attempts (ms)
});
export default socket;