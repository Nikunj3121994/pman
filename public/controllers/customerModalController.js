var customerModalController = function ($scope, $modalInstance, customerFactory, MessageFactory, $log, $rootScope) {
    //$scope.input = {};
    
    // Create new customer using customerFactory
	$scope.createCustomer = function() {
		if( $scope.$$childTail.customerForm.$valid) {
			customerFactory.addCustomer($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.customers.push(data. data);
					$scope.formData = {};

					//MessageFactory.prepareForBroadcast('Ny kunde opprettet', 'label label-success');
					$modalInstance.close('opprettet');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppretting av ny kunde', 'label label-danger');
				}
			});	
		} else {
			$scope.message = "Fail";
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Update new customer using customerFactory
	$scope.updateCustomer = function(id) {
		if( $scope.$$childTail.customerForm.$valid) {
			customerFactory.updateCustomer($scope.formData, id).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					for (var i = 0; i < $scope.customers.length; i++) {
						if ($scope.customers[i]._id === id) {
							$scope.customers[i] = data.data;
							break;
						}
					}
					$scope.showSaveButton = true;
					$scope.showUpdateButton = false;	
					$scope.formData = {};

					$modalInstance.close('oppdatert');
					//MessageFactory.prepareForBroadcast('Kunde oppdatert', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av kunde', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};