const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db.js');
const dentists = require('./routes/dentists');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');
const users = require('./routes/users');

connectDB();

const app = express();
app.set('query parser', 'extended');

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://dentaire-five.vercel.app',
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(cookieParser());

// Mount routers
app.use('/api/v1/dentists', dentists);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(
        'Server running in',
        process.env.NODE_ENV || 'development',
        'mode on port',
        PORT
    );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});