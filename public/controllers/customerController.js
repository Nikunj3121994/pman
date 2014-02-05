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

		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
		$scope.showCancelButton = true;	
	}
	
	
	// Create new customer using customerFactory
	$scope.createCustomer = function() {
		if( $scope.customerForm.$valid) {
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
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Create new customer using customerFactory
	$scope.updateCustomer = function(id) {
		if( $scope.customerForm.$valid) {
			customerFactory.updateCustomer($scope.formData, id).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					for (var i = 0; i < $scope.customers.length; i++) {
						if ($scope.customers[i].idcustomer === id) {
							$scope.customers[i] = data.data;
							break;
						}
					}
					$scope.showSaveButton = true;
					$scope.showUpdateButton = false;	
					$scope.formData = {};

					MessageFactory.prepareForBroadcast('Kunde oppdatert', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av kunde', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Put customer to edit in edit form
	$scope.editCustomer = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;
		$scope.customerEditedID = $scope.customers[index].idcustomer;
		$scope.formData = $scope.customers[index];
	};

	// Put customer to edit in edit form
	$scope.resetCustomerForm = function() {
		$scope.formData = {};
		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
	};

	// delete customer using customerFactory
	$scope.deleteCustomer = function(id) {
		bootbox.confirm("Er du sikker på at du vil slette?", function(result) {
			if(result) {
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
			}
		});
	};	
}

