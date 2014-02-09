module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//List all projects
	app.get('/api/projects', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
		  		connection.query( 'SELECT * FROM project', function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				ReturnResults(res, rows, 200);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});

	//Get Spesific project with specified ID
	app.get('/api/projects/:id', function (req, res){
	  pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
		  		connection.query( 'SELECT * FROM project where idproject = ?', req.params.id, function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				ReturnResults(res, rows, 200);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});

	//Delete project
	app.delete('/api/projects/:id', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
		  		connection.query( 'DELETE FROM project where idproject = ?', req.params.id, function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				console.log('Deleted Project with ID = ' + req.params.id);
		  				ReturnResults(res, null, 204);
		  			}
		    		
		    		connection.release();
		  		});	
			} 
		});
	});

	//Insert new project
	app.post('/api/projects', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
				var post = {title: req.body.title, idproject: req.body.idproject, fkIdCustomer: req.body.fkIdCustomer };
				
		  		connection.query( 'INSERT INTO project SET ?', post, function(err, rows) {
		  			if(!QueryHasErrors(err, res)) {
		  				//post.idproject = rows.insertId;
		  				console.log('Inserted Project: ' + JSON.stringify(post));
		  				ReturnResults(res, post, 201);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});

	//Update project
	app.put('/api/projects/:id', function (req, res){
		pool.getConnection(function(err, connection) {
		
			if(!ConnectionErrorCheck(err, res)) {
				var post = {title: req.body.title, idproject: req.body.idproject, fkIdCustomer: req.body.fkIdCustomer };
				
				console.log(post);
				
		  		connection.query( 'UPDATE project SET ? WHERE idproject = ?', [post, req.params.id], function(err, rows) {
		    		if(!QueryHasErrors(err, res)) {
		    			post.idproject = req.params.id;
		    			console.log('Updated Project: ' + JSON.stringify(post));
		  				ReturnResults(res, post, 200);
		  			}

		    		connection.release();
		  		});	
			} 
		});
	});
};