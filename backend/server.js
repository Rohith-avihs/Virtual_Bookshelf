const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const expressFileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { initializeContactInfo } = require('./controllers/contactController'); // <--- NEW IMPORT

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(expressFileUpload()); 

// Serve static files (uploaded book files)
app.use('/uploads', express.static('uploads'));

// --- Initializing Contact Info (Run once after DB connect) ---
initializeContactInfo(); // <--- NEW INITIALIZATION
// -----------------------------------------------------------


// --- Socket.IO Chat Logic ---
io.on('connection', (socket) => {
    console.log('A user connected to Socket.IO');

    // User joins a specific "room" based on the bookId
    socket.on('joinBookChat', (bookId) => {
        socket.join(bookId);
        console.log(`User joined room: ${bookId}`);
    });

    // Handle new chat message
    socket.on('sendMessage', ({ bookId, user, message }) => {
        // Broadcast the message to all users in that specific book's room
        io.to(bookId).emit('receiveMessage', { user, message, timestamp: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from Socket.IO');
    });
});
// ----------------------------

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));       
app.use('/api/wishlist', require('./routes/wishlistRoutes')); 
app.use('/api/reviews', require('./routes/reviewRoutes'));     // <--- NEW
app.use('/api/contact', require('./routes/contactRoutes'));   // <--- NEW

// Basic test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware (must be at the bottom)
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));