// load up the calculation model
var Calculation = require('../app/models/calculation.js');

module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//============================================================List all calculations
	app.get('/api/calculations', function (req, res){
		if(pool) { //MySql used as database
			//Not implemented
		} else { //MongoDB used as database
			Calculation.find({}).exec(function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});

	app.get('/api/calculationsForProject/:id', function (req, res){
		if(pool) { //MySql used as database
			//Not implemented
		} else { //MongoDB used as database
			Calculation.find({_project: req.params.id}).exec(function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});

	//============================================================Get Spesific calculation
	app.get('/api/calculations/:id', function (req, res){
		if(pool) { //MySql used as database	
		  	//Not implemented
		} else { //MongoDB used as database
			var query = { _id: req.params.id }
			Calculation.findOne(query, function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});		
		}
	});

	//============================================================Delete calculation
	app.delete('/api/calculations/:id', function (req, res){
		if(pool) { //MySql used as database	
			//Not implemented
		} else { //MongoDB used as database
			var query = {_id:req.params.id};
			Calculation.findOneAndRemove(query, function(err, doc) {
	        	if(!QueryHasErrors(err, res)) {
			  		console.log('Deleted Calculation with ID = ' + req.params.id);
			  		ReturnResults(res, null, 204);
			  	}
	      	});
	    }
	});

	//============================================================Add calculation
	app.post('/api/calculations', function (req, res){
		if(pool) { //MySql used as database	
			//Not implemented
		} else { //MongoDB used as database
			var newCalc = new Calculation ({title: req.body.title, type: req.body.type, active: req.body.active, _project: req.body._project });

			newCalc.save(function (err) {
				if(!QueryHasErrors(err, res)) {
			  		//post._id = rows.insertId;
			  		console.log('Inserted Calculation: ' + JSON.stringify(newCalc));
			  		ReturnResults(res, newCalc, 201);
			  	}
			});
		}
	});

	//============================================================Update calculation
	app.put('/api/calculations/:id', function (req, res){
		if(pool) { //MySql used as database	
			//Not implemented
		} else { //MongoDB used as database
			var query = { _id: req.params.id };
			var update = { title: req.body.title, type: req.body.type, active: req.body.active, _project: req.body._project };
			Calculation.findOneAndUpdate(query, update, null, function(err, result) {
				if(!QueryHasErrors(err, res)) {
					console.log('Updated Calculation: ' + JSON.stringify(result));
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});
};