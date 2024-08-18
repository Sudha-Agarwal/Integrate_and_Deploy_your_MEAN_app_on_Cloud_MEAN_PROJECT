const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
//const userSchema = require('../../Database/Model/User'); // Adjust the path to the User model
//const {User} = 'process.env.USER_MODEL_PATH;'
//const {User} = './User';
//const mongoURI = 'mongodb://localhost:27017/myDB2';
//const client = new MongoClient(mongoURI);
//onst dbConnectionString = require('../../Database/db');

//const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age must be positive'],
        max: [120, 'Age must be less than or equal to 120']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v); // Validates email format
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street is required'],
            minlength: [3, 'Street must be at least 3 characters long'],
            maxlength: [100, 'Street must be at most 100 characters long']
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            minlength: [2, 'City must be at least 2 characters long'],
            maxlength: [50, 'City must be at most 50 characters long']
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            minlength: [2, 'State must be at least 2 characters long'],
            maxlength: [50, 'State must be at most 50 characters long']
        }
    },
    hobbies: {
        type: [String],
        required: [true, 'Hobby is required'],
        validate: {
            validator: function(array) {
                return array.length > 0;
            },
            message: 'There should be at least one hobby'
        }
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: 'Status must be either "active" or "inactive"'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        
    }
});


//const User=mongoose.model('User', userSchema)
const User = mongoose.model('User', userSchema);
// Define routes for user-related APIs
router.get('/users', async(req, res) => {
    console.log('getting user data');
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('Connected to MongoDB');
            console.log('Connected to database:', mongoose.connection.name);
        } else {
            console.log('Not connected to MongoDB');
        }

        // Exclude the password field using projection
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/signup', async(req, res) => {
    let { name, email, age, password, hobbies, status } = req.body;
    let street = req.body['address.street'];
    let city = req.body['address.city'];
    let state = req.body['address.state'];

    // Initialize an object to hold validation errors
    let validationErrors = {};

    // Validate password explicitly
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        validationErrors.password = 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    // Create a new user object without saving to validate using mongoose
    let newUser = new User({
        name,
        email,
        age,
        password, // Temporarily use plain password for mongoose validation
        address: {
            street,
            city,
            state
        },
        hobbies: hobbies.split(',').map(hobby => hobby.trim()), // Assuming hobbies are sent as a comma-separated string
        status
    });

    try {
        // Validate user using mongoose
        await newUser.validate();
    } catch (error) {
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
        } else {
            console.error('Server error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    }

    // If there are validation errors, respond with them
    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        //const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the new user object with the hashed password
        //newUser.password = hashedPassword;

        // Save the new user to the database
        await newUser.save();
        console.log('New user created:', newUser);

        // Send a success response
        res.status(201).json({ message: 'New user created' });
    } catch (error) {
        console.log(error.code)
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            const duplicateError = {};
            duplicateError[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
            return res.status(400).json({ errors: duplicateError });
        } else {
            //console.error('Server error:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

router.post('/login', async(req, res)=>{
    try {
        let { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({error:'Login failed'});
        }

        // Compare the provided password with the stored hashed password
        // Compare the provided password with the stored password (plain text comparison)
        if (password !== user.password) {
            return res.status(404).send({ error: 'Login failed' });
        }

        // If everything is correct, send a successful response
        res.status(200).send({message:'Login successful'});
    } catch (error) {
        // Handle any errors that occur
        console.error(error);
        res.status(500).send('Server error');
    }

});

router.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user from the database
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;