require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./config/dbConfig');
const cors = require('cors');
const logger = require('./middelwares/logger');


//import delle routes
const authorsRoute = require('./routes/authors');
const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');


// creazione porta (questa porta non deve andare in conflitto con quella del fe)
const PORT = 3030;
// creazione variabile che contiene tutti i metodi di express
const app = express();

//middleware
app.use(cors())
app.use(express.json());

app.use(logger);
app.use('/', authorsRoute);
app.use('/', booksRoute);
app.use('/', usersRoute);
app.use('/', loginRoute);


// connessione al database
connectToDatabase();

// metto il server in ascolto sulla porta
app.listen(PORT, () => console.log(`Server connected and listening on port ${PORT}`))