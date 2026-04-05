/**
 * Chat Handler for Soul Connect
 * Rooms are based on mood types: ['Vui', 'Buồn', 'Căng thẳng', 'Bình thản', 'Mệt mỏi', 'Hào hứng', 'Lo âu']
 */
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        // Join room based on mood
        socket.on('join_room', (data) => {
            const { mood } = data;
            
            // Leave previous rooms if any
            socket.rooms.forEach(room => {
                if (room !== socket.id) socket.leave(room);
            });

            socket.join(mood);
            console.log(`Socket ${socket.id} joined room: ${mood}`);
            
            // Notify other users in the room (optional)
            socket.to(mood).emit('user_joined', { message: 'Một người bạn ẩn danh vừa tham gia phòng.' });
        });

        // Send anonymous message to a room
        socket.on('send_msg', (data) => {
            const { mood, message } = data;
            
            // Broadcast to everyone in the room except the sender
            socket.to(mood).emit('receive_msg', {
                message,
                timestamp: new Date().toISOString(),
                sender: 'Người bạn ẩn danh'
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
