const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');
const req = require('express/lib/request');

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
        // Successfully validated

        // Mongoose method that finds one piece of data (a user)
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // User exists
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash the password.
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;

                    // Set password to the hash created.
                    newUser.password = hash;

                    // Save user
                    newUser.save()
                        .then(user => {
                            req.flash('successMsg', 'You are now registered and can log in!');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }));
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    console.log('Post Login')
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;