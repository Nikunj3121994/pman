// load up the project model
var Project = require('../app/models/project.js');

module.exports = function(app, pool, ConnectionErrorCheck, QueryHasErrors, ReturnResults) {

	//============================================================List all projects
	app.get('/api/projects', function (req, res){
		if(pool) { //MySql used as database
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
		} else { //MongoDB used as database
			Project.find({}).exec(function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});

	//============================================================Get Spesific project
	app.get('/api/projects/:id', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'SELECT * FROM project where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				ReturnResults(res, rows, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id }
			Project.findOne(query, function(err, result) {
				if(!QueryHasErrors(err, res)) {
			  		ReturnResults(res, result, 201);
			  	}
			});		
		}
	});

	//============================================================Delete project
	app.delete('/api/projects/:id', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
			
				if(!ConnectionErrorCheck(err, res)) {
			  		connection.query( 'DELETE FROM project where _id = ?', req.params.id, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				console.log('Deleted Project with ID = ' + req.params.id);
			  				ReturnResults(res, null, 204);
			  			}
			    		
			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = {_id:req.params.id};
			Project.findOneAndRemove(query, function(err, doc) {
	        	if(!QueryHasErrors(err, res)) {
			  		console.log('Deleted Project with ID = ' + req.params.id);
			  		ReturnResults(res, null, 204);
			  	}
	      	});
		}
	});

	//============================================================Insert new project
	app.post('/api/projects', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
				if(!ConnectionErrorCheck(err, res)) {
					var post = {title: req.body.title, idproject: req.body.idproject, fkIdCustomer: req.body.fkIdCustomer };
					
			  		connection.query( 'INSERT INTO project SET ?', post, function(err, rows) {
			  			if(!QueryHasErrors(err, res)) {
			  				console.log('Inserted Project: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 201);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var newProject = new Project ({title: req.body.title, idproject: req.body.idproject, _customer: req.body._customer});

			newProject.save(function (err) {
				if(!QueryHasErrors(err, res)) {
			  		console.log('Inserted Project: ' + JSON.stringify(newProject));
			  		ReturnResults(res, newProject, 201);
			  	}
			});
		}
	});

	//============================================================Update project
	app.put('/api/projects/:id', function (req, res){
		if(pool) { //MySql used as database
			pool.getConnection(function(err, connection) {
				if(!ConnectionErrorCheck(err, res)) {
					var post = {title: req.body.title, idproject: req.body.idproject, fkIdCustomer: req.body.fkIdCustomer };
					
					console.log(post);
					
			  		connection.query( 'UPDATE project SET ? WHERE _id = ?', [post, req.params.id], function(err, rows) {
			    		if(!QueryHasErrors(err, res)) {
			    			post._id = req.params.id;
			    			console.log('Updated Project: ' + JSON.stringify(post));
			  				ReturnResults(res, post, 200);
			  			}

			    		connection.release();
			  		});	
				} 
			});
		} else { //MongoDB used as database
			var query = { _id: req.params.id };
			var update = { title: req.body.title, idproject: req.body.idproject, _customer: req.body._customer };
			Project.findOneAndUpdate(query, update, null, function(err, result) {
				if(!QueryHasErrors(err, res)) {
					console.log('Updated Project: ' + JSON.stringify(result));
			  		ReturnResults(res, result, 201);
			  	}
			});
		}
	});
};