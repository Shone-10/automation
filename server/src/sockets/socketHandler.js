let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Join private room on authentication or custom event
    socket.on('join', (userId) => {
      socket.join(userId.toString());
      console.log(`Socket: User ${userId} joined personal room`);
    });

    // Join admin room
    socket.on('join_admin', () => {
      socket.join('admins');
      console.log(`Socket: Admin joined admins room`);
    });

    socket.on('disconnect', () => {
      // Cleanup
    });
  });
};

export const getIO = () => ioInstance;

/**
 * Emit an event to a specific user
 */
export const emitToUser = (userId, event, data) => {
  if (ioInstance) {
    ioInstance.to(userId.toString()).emit(event, data);
  }
};

/**
 * Emit an event to all connected admin clients
 */
export const emitToAdmins = (event, data) => {
  if (ioInstance) {
    ioInstance.to('admins').emit(event, data);
  }
};
