//Define module
var pmanApp = angular.module('pmanApp', ['ngRoute', 'timer']).run(
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
customerController.$inject = ['$scope', 'customerFactory', 'MessageFactory', '$log', '$rootScope'];
leaderController.$inject = ['$scope', 'leaderFactory', 'MessageFactory', '$log', '$rootScope'];
calculationController.$inject = ['$scope', 'calculationFactory', 'MessageFactory', '$log', '$rootScope'];
projectController.$inject = ['$scope', 'projectFactory', 'MessageFactory', '$log', '$rootScope', 'customerFactory', 'leaderFactory'];




