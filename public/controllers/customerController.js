function customerController($scope, customerFactory, MessageFactory, $log, $rootScope) {
	$scope.formData = {};
	$scope.customers = [];
	
	// when loading controller, initialize customer list from customerFactory
	init();
	
	function init() {
		customerFactory.getCustomers().then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				$scope.customers = data.data;

			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved lasting av kunder', 'label label-danger');
			}
		});
	}
	
	
	// Create new customer using customerFactory
	$scope.createCustomer = function() {
		if( $scope.customerForm.customerName.$valid) {
			customerFactory.addCustomer($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.customers.push(data. data);
					$scope.formData = {};

					MessageFactory.prepareForBroadcast('Ny kunde opprettet', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppretting av ny kunde', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød *', 'label label-warning');	
		}
	};

	// delete customer using customerFactory
	$scope.deleteCustomer = function(id) {
		customerFactory.deleteCustomer(id).then(function(data) {
			if(!$rootScope.RHE(data, false)) {
				for (var i = 0; i < $scope.customers.length; i++) {
					if ($scope.customers[i].idcustomer === id) {
						$scope.customers.splice(i, 1);
						break;
					}
				}

				MessageFactory.prepareForBroadcast('Kunde slettet', 'label label-success');
			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved sletting av kunde', 'label label-danger');
			}
		});
	};
	
	
}

