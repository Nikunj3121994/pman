var application_root = __dirname,
	http = require("http"),
    express = require("express"),
    path = require("path"),
    mysql = require('mysql');

var app = express();
var httpServer = http.createServer(app);

// Database

var pool  = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'develop79!',
  database : 'pman'
});

// Config

app.configure(function () {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
  res.send('Pman API is running');
});

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
	  				ReturnResults(res, post);
	  			}

	    		connection.release();
	  		});	
		} 
	});
});

// Launch server

httpServer.listen(4242);

function ConnectionErrorCheck(err, response) {
	if(err) {
		console.log(err);	
		ReturnResults(response, err, 503);
		return true;
	} else {
		return false;
	}
} 

/*function HandleQueryResult(err, rows, response, hasData) {
	if(!err) {
		if(hasData)
			ReturnResults(response, rows);
		else
			ReturnResults(response, 'OK');
	} else {
		console.log(err);	
	    ReturnResults(response, err);		
	}	    
}*/

function QueryHasErrors(err, response) {
	if(!err) {
		return false;
	} else {
		console.log(err);	
	    ReturnResults(response, err, 500);
	    return true;		
	}	    
}

function ReturnResults(response, resultToReturn, code){
	response.writeHead(code, { 'Content-Type': 'application/json'});
    response.end(JSON.stringify(resultToReturn));
}
