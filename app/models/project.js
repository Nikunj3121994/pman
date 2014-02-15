var mongoose = require('mongoose');

// define the schema for our user model
var projectSchema = mongoose.Schema({
    title       : String,
    idproject	: Number,
    _customer 	: { type: mongoose.Schema.ObjectId, ref: 'Customer' },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);