const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
    month: Number,
    day: Number,
    year: Number
});


module.exports = mongoose.model('Date', dateSchema);
