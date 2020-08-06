const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: String,
    status: String,
    calories: Number,
    date: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    liked: Boolean
});


module.exports = mongoose.model('Exercise', exerciseSchema);
