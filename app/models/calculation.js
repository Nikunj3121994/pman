var mongoose = require('mongoose');

// define the schema for our main project calculation
var calculationSchema = mongoose.Schema({
    _project	: { type: mongoose.Schema.ObjectId, ref: 'Project' },
    parts 		: [calculationPartSchema],
});

// define the schema for our calculation part
var calculationPartSchema = mongoose.Schema({
    title       : String,
    type		: String,
    active		: Boolean,
    lines		: [calculationPartLineSchema]
});

// define the schema for one line in a calculation part
var calculationPartLineSchema = mongoose.Schema({
    description : String,
    type		: String,
    price		: {type: Number, get: getFloatFromNumber, set: setFloatAsNumber },
    count		: {type: Number, get: getFloatFromNumber, set: setFloatAsNumber }
});

function getFloatFromNumber(num){
    return (num/100).toFixed(1);
}

function setFloatAsNumber(num){
    return num*100;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Calculation', calculationSchema);