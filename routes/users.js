const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => res.render('login'));

// Login page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Ensuring all fields in form are filled out
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill out all fields'});
    }

    // Ensuring Password and Confirm password are identical
    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    // Ensuring password is atleast 6 characters long
    if(password.length < 6) {
        errors.push({msg: 'Password must be 6 characters or more'});
    }

    // Checking to see if there are any errors found and displaying those errors if so.
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } // Else the account is registered
    else {
        res.send('Pass')
    }

    console.log(req.body);
    res.send('hello'); 
});

// Login Handle
router.post('/login');

module.exports = router;