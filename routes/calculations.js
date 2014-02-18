// load up the calculation model
var Calculation = require('../app/models/calculation.js');

module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//============================================================List all calculations
	app.get('/api/calculations', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM calculation', function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			Calculation.find({}).exec(function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});

	//============================================================Get Spesific calculation
	app.get('/api/calculations/:id', function (req, res){
		if(pool) { //MySql used as database	
		  	pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM calculation where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
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
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'DELETE FROM calculation where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				console.log('Deleted Calculation with ID = ' + req.params.id);
			  				ReturnResults(res, null, 204);
			  			}
			    		
			    		connection.release();
			  		});	
				} 
			});
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

	//============================================================Add cunstomer
	app.post('/api/calculations', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
					var post = {name: req.body.name};
					
			  		connection.query( 'INSERT INTO calculation SET ?', post, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				post._id = rows.insertId;
			  				console.log('Inserted Calculation: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 201);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var newCust = new Calculation ({name: req.body.name});

			newCust.save(function (err) {
				if(!QueryHasErrors(err, res)) {
			  		//post._id = rows.insertId;
			  		console.log('Inserted Calculation: ' + JSON.stringify(newCust));
			  		ReturnResults(res, newCust, 201);
			  	}
			});
		}
	});

	//============================================================Update calculation
	app.put('/api/calculations/:id', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
					var post = {name: req.body.name};
					
					console.log(post);
					
			  		connection.query( 'UPDATE calculation SET ? WHERE _id = ?', [post, req.params.id], function(err, rows) {
			    		if(!QueryHasErrors(err, res)) {
			    			post._id = req.params.id;
			    			console.log('Updated Calculation: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id };
			var update = { name: req.body.name };
			Calculation.findOneAndUpdate(query, update, null, function(err, result) {
				if(!QueryHasErrors(err, res)) {
					console.log('Updated Calculation: ' + JSON.stringify(result));
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});
};