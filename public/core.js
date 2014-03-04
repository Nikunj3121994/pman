//Define module
var pmanApp = angular.module('pmanApp', ['ngRoute', 'timer', 'ui.bootstrap']).run(
	function($rootScope){
		$rootScope.RHE = function(data, expectsObject) {
			if(data === undefined || ( data.data === undefined && expectsObject)) {				
				return true;
			} else {
				return false;
			}
		};	
	});

pmanApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

//Inject factory in module
pmanApp.factory('customerFactory', customerFactory);
pmanApp.factory('MessageFactory', MessageFactory);
pmanApp.factory('projectFactory', projectFactory);
pmanApp.factory('leaderFactory', leaderFactory);
pmanApp.factory('calculationFactory', calculationFactory);

//Inject core controllers to "always visible" parts of app
pmanApp.controller('headerController', headerController);
pmanApp.controller('MessageController', MessageController);

//Inject needed "modules" to controllers
MessageController.$inject = ['$scope', 'MessageFactory', '$log'];
headerController.$inject = ['$scope', '$location', '$modal', '$log', '$rootScope'];
customerController.$inject = ['$scope', 'customerFactory', 'MessageFactory', '$log', '$rootScope', '$modal'];
customerModalController.$inject = ['$scope', '$modalInstance','customerFactory', 'MessageFactory', '$log', '$rootScope'];
leaderController.$inject = ['$scope', 'leaderFactory', 'MessageFactory', '$log', '$rootScope', '$modal'];
leaderModalController.$inject = ['$scope', '$modalInstance','leaderFactory', 'MessageFactory', '$log', '$rootScope'];
calculationController.$inject = ['$scope', '$location', 'calculationFactory', 'MessageFactory', '$log', '$rootScope', '$modal'];
calculationModalController.$inject = ['$scope', '$modalInstance', 'calculationFactory', 'MessageFactory', '$log', '$rootScope'];
projectController.$inject = ['$scope', '$location', 'projectFactory', 'MessageFactory', '$log', '$rootScope', 'customerFactory', 'leaderFactory', '$modal'];
projectModalController.$inject = ['$scope', '$modalInstance','projectFactory', 'MessageFactory', '$log', '$rootScope', 'customerFactory', 'leaderFactory'];
projectSelectModalController.$inject = ['$scope', '$modalInstance','projectFactory', '$log', '$rootScope'];




