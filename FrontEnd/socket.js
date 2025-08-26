import {io} from 'socket.io-client'
import {  toast } from 'react-toastify';


// const socket=io('https://ox-3gl4.onrender.com',{transports:['websocket']})

const socket = io('https://ox-3gl4.onrender.com', {
  transports: ['websocket', 'polling'], // Allow fallback to polling
  reconnection: true,                   // Ensure reconnection is enabled
  reconnectionAttempts: Infinity,       // Keep retrying
  reconnectionDelay: 1000,              // Start with 1s delay
  reconnectionDelayMax: 5000,           // Max delay of 5s
  randomizationFactor: 0.5,             // Randomize delays to avoid sync issues
  timeout: 20000                        // Increase timeout for slow networks
});

socket.on('connect', () => {
  console.log('Connected to server');
  toast.info("Trying to Reconnect!")

  // Request game state sync on connect/reconnect

});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Show a message to the player, e.g., "Connection lost, reconnecting..."
  showReconnectMessage();
});

function showReconnectMessage() {
  toast.info(`Anna disconneted !`)
}

export default socket;
