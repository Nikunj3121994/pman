// load up the leader model
var Leader = require('../app/models/leader.js');

module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//============================================================List all leaders
	app.get('/api/leaders', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM leader', function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			Leader.find({}).exec(function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});

	//============================================================Get Spesific leader
	app.get('/api/leaders/:id', function (req, res){
		if(pool) { //MySql used as database	
		  	pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM leader where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id }
			Leader.findOne(query, function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});		
		}
	});

	//============================================================Delete leader
	app.delete('/api/leaders/:id', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'DELETE FROM leader where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				console.log('Deleted Leader with ID = ' + req.params.id);
			  				ReturnResults(res, null, 204);
			  			}
			    		
			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = {_id:req.params.id};
			Leader.findOneAndRemove(query, function(err, doc) {
	        	if(!QueryHasErrors(err, res)) {
			  		console.log('Deleted Leader with ID = ' + req.params.id);
			  		ReturnResults(res, null, 204);
			  	}
	      	});
	    }
	});

	//============================================================Add cunstomer
	app.post('/api/leaders', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
					var post = {name: req.body.name};
					
			  		connection.query( 'INSERT INTO leader SET ?', post, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				post._id = rows.insertId;
			  				console.log('Inserted Leader: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 201);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var newCust = new Leader ({name: req.body.name});

			newCust.save(function (err) {
				if(!QueryHasErrors(err, res)) {
			  		//post._id = rows.insertId;
			  		console.log('Inserted Leader: ' + JSON.stringify(newCust));
			  		ReturnResults(res, newCust, 201);
			  	}
			});
		}
	});

	//============================================================Update leader
	app.put('/api/leaders/:id', function (req, res){
		if(pool) { //MySql used as database	
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
					var post = {name: req.body.name};
					
					console.log(post);
					
			  		connection.query( 'UPDATE leader SET ? WHERE _id = ?', [post, req.params.id], function(err, rows) {
			    		if(!QueryHasErrors(err, res)) {
			    			post._id = req.params.id;
			    			console.log('Updated Leader: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id };
			var update = { name: req.body.name };
			Leader.findOneAndUpdate(query, update, null, function(err, result) {
				if(!QueryHasErrors(err, res)) {
					console.log('Updated Leader: ' + JSON.stringify(result));
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});
};