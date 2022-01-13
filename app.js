const express = require('express'); // including express
const expressLayouts =  require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express(); 

// DB configuration
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connected'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Static directories for use
app.use("/css", express.static(__dirname + "/css")); // static directory to styling pages
app.use("/js", express.static(__dirname + "/js")); // static directory to js functionality files
app.use("/profile-pictures", express.static(__dirname + "/profile-pictures")); // static directory to js functionality files

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000; // Port that we will run the application on

app.listen(PORT, console.log(`Server started on port ${PORT}`))
