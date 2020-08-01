const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: String,
    calories: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date,
});


module.exports = mongoose.model('Food', foodSchema);
