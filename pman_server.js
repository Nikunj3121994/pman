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

// routes ======================================================================
require('./routes')(app, pool);


// Launch server ===============================================================
httpServer.listen(4242);


