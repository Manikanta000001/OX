import {io} from 'socket.io-client'

// const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})

const socket = io('https://ox-3gl4.onrender.com', {
  transports: ['websocket', 'polling'], // Allow fallback to polling
  reconnection: true,                    // Ensure reconnection is enabled
  reconnectionAttempts: Infinity,       // Keep retrying
  reconnectionDelay: 1000,              // Start with 1s delay
  reconnectionDelayMax: 5000,           // Max delay of 5s
  randomizationFactor: 0.5,             // Randomize delays to avoid sync issues
  timeout: 20000                        // Increase timeout for slow networks
});


export default socket;
