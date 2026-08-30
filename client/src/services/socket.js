import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Extract root server URL (remove /api from the end if present)
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

let socket = null;

export const initiateSocketConnection = (userId, role) => {
  if (socket) return socket;

  try {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket.IO Connected to Server');
      // Join the private notification room
      socket.emit('join', userId);
      
      // If admin, join admin group room
      if (role === 'admin') {
        socket.emit('join_admin');
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO Disconnected');
    });

    return socket;
  } catch (error) {
    console.error('Socket connection error:', error.message);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
