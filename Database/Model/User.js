const mongoose = require('mongoose');

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


const User=mongoose.model('User',userSchema)
module.exports ={User};