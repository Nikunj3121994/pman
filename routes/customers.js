module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//List all customers
	app.get('/api/customers', function (req, res){
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
	});

	//Get Spesific customer with specified ID
	app.get('/api/customers/:id', function (req, res){
	  pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
		  		connection.query( 'SELECT * FROM customer where idcustomer = ?', req.params.id, function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				ReturnResults(res, rows, 200);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});

	//Delete customer
	app.delete('/api/customers/:id', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
		  		connection.query( 'DELETE FROM customer where idcustomer = ?', req.params.id, function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				console.log('Deleted Customer with ID = ' + req.params.id);
		  				ReturnResults(res, null, 204);
		  			}
		    		
		    		connection.release();
		  		});	
			} 
		});
	});

	//Insert new customer
	app.post('/api/customers', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
				var post = {name: req.body.name};
				
		  		connection.query( 'INSERT INTO customer SET ?', post, function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				post.idcustomer = rows.insertId;
		  				console.log('Inserted Customer: ' + JSON.stringify(post));
		  				ReturnResults(res, post, 201);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});

	//Update customer
	app.put('/api/customers/:id', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
				var post = {name: req.body.name};
				
				console.log(post);
				
		  		connection.query( 'UPDATE customer SET ? WHERE idcustomer = ?', [post, req.params.id], function(err, rows) {
		    		if(!QueryHasErrors(err, res)) {
		    			post.idcustomer = req.params.id;
		    			console.log('Updated Customer: ' + JSON.stringify(post));
		  				ReturnResults(res, post, 200);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});
};