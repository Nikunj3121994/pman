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

//Inject factory in module
pmanApp.factory('customerFactory', customerFactory);
pmanApp.factory('MessageFactory', MessageFactory);

//Inject controller in module
pmanApp.controller('MessageController', MessageController);


MessageController.$inject = ['$scope', 'MessageFactory', '$log'];
customerController.$inject = ['$scope', 'customerFactory', 'MessageFactory', '$log', '$rootScope'];




