const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: String,
    status: String,
    calories: Number,
    due: String,
    user: String
});


module.exports = mongoose.model('Exercise', exerciseSchema);
