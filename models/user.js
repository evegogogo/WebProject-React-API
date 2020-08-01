const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    foods: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Food'
        }
    ],
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ]
});


module.exports = mongoose.model('User', userSchema);
