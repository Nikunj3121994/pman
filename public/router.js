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
		.when('/project',
			{
				controller: 'calculationController',
				templateUrl: 'partials/calculationPartial.html'
			})
		.when('/leaders',
			{
				controller: 'leaderController',
				templateUrl: 'partials/leaderPartial.html'
			})
		.when('/projectCalculations',
			{
				controller: 'calculationController',
				templateUrl: 'partials/calculationPartial.html'
			})
		.when('/test',
			{
				controller: 'customerController',
				templateUrl: 'partials/test.html'
			})
		.otherwise({redirectTo: '/'});
});