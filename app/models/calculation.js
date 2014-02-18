var mongoose = require('mongoose');

// define the schema for our user model
var calculationSchema = mongoose.Schema({
    title       : String,
    type		: String,
    _project	: { type: mongoose.Schema.ObjectId, ref: 'Project' },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Calculation', calculationSchema);