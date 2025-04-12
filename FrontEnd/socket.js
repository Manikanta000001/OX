import {io} from 'socket.io-client'
const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})
export default socket;
