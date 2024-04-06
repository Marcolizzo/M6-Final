require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConfig');
const cors = require('cors');
//import delle routes
const authorsRoute = require('./routes/authors');
const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');
// creazione porta (questa porta non deve andare in conflitto con quella del fe)
const PORT = 3030;
// creazione variabile che contiene tutti i metodi di express
const app = express();

//middleware
app.use(cors())
app.use(express.json());
app.use('/', authorsRoute);
app.use('/', booksRoute);
app.use('/', usersRoute);


// connessione al database
connectDB();

// metto il server in ascolto sulla porta
app.listen(PORT, () => console.log(`Server connected and listening on port ${PORT}`))