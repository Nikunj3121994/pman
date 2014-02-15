// load up the customer model
var Customer = require('../app/models/customer.js');

module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//============================================================List all customers
	app.get('/api/customers', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM customer', function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			Customer.find({}).exec(function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});

	//============================================================Get Spesific customer
	app.get('/api/customers/:id', function (req, res){
		if(pool) { //MySql used as database	
		  	pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM customer where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id }
			Customer.findOne(query, function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});		
		}
	});

	//============================================================Delete customer
	app.delete('/api/customers/:id', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'DELETE FROM customer where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				console.log('Deleted Customer with ID = ' + req.params.id);
			  				ReturnResults(res, null, 204);
			  			}
			    		
			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = {_id:req.params.id};
			Customer.findOneAndRemove(query, function(err, doc) {
	        	if(!QueryHasErrors(err, res)) {
			  		console.log('Deleted Customer with ID = ' + req.params.id);
			  		ReturnResults(res, null, 204);
			  	}
	      	});
	    }
	});

	//============================================================Add cunstomer
	app.post('/api/customers', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
					var post = {name: req.body.name};
					
			  		connection.query( 'INSERT INTO customer SET ?', post, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				post._id = rows.insertId;
			  				console.log('Inserted Customer: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 201);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var newCust = new Customer ({name: req.body.name});

			newCust.save(function (err) {
				if(!QueryHasErrors(err, res)) {
			  		//post._id = rows.insertId;
			  		console.log('Inserted Customer: ' + JSON.stringify(newCust));
			  		ReturnResults(res, newCust, 201);
			  	}
			});
		}
	});

	//============================================================Update customer
	app.put('/api/customers/:id', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
					var post = {name: req.body.name};
					
					console.log(post);
					
			  		connection.query( 'UPDATE customer SET ? WHERE _id = ?', [post, req.params.id], function(err, rows) {
			    		if(!QueryHasErrors(err, res)) {
			    			post._id = req.params.id;
			    			console.log('Updated Customer: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id };
			var update = { name: req.body.name };
			Customer.findOneAndUpdate(query, update, null, function(err, result) {
				if(!QueryHasErrors(err, res)) {
					console.log('Updated Customer: ' + JSON.stringify(result));
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});
};