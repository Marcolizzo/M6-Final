require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConfig');
//import delle routes
const authorsRoute = require('./routes/authors');
// creazione porta (questa porta non deve andare in conflitto con quella del fe)
const PORT = 3030;
// creazione variabile che contiene tutti i metodi di express
const app = express();

//middleware
app.use(express.json());
app.use('/', authorsRoute);


// connessione al database
connectDB();

// metto il server in ascolto sulla porta
app.listen(PORT, () => console.log(`Server connected and listening on port ${PORT}`))