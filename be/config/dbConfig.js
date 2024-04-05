const mongoose = require('mongoose');

//connessione del database
const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL);
    // metto in ascolto i due eventi che mi interessano (error e open)
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Database connection error!'));
    db.once('open', () => {
        console.log('Database successfully connected!');
    });
}

module.exports = connectDB;