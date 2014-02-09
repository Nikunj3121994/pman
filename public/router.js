pmanApp.config(function($routeProvider) {
	$routeProvider
		.when('/',
			{
				controller: 'customerController',
				templateUrl: 'partials/customerPartial.html'
			})
		.when('/projects',
			{
				controller: 'projectController',
				templateUrl: 'partials/projectPartial.html'
			})
		.when('/test',
			{
				controller: 'customerController',
				templateUrl: 'partials/test.html'
			})
		.otherwise({redirectTo: '/'});
});