const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: String,
    calories: Number,
    user: String
});


module.exports = mongoose.model('Food', foodSchema);
