var calculationModalController = function ($scope, $modalInstance, calculationFactory, MessageFactory, $log, $rootScope) {
	// Create new calculation using calculationFactory
	$scope.createCalculation = function() {
		if( $scope.$$childTail.calculationForm.$valid) {
			//Tie calculation to project
			$scope.formData._project = $rootScope.selectedProject_id; 

			calculationFactory.addCalculation($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.calculations.push(data.data);
					$scope.formData = {};

					$modalInstance.close('opprettet');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppretting av ny kalkyle', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Update calculation using calculationFactory
	$scope.updateCalculation = function(id) {
		if( $scope.$$childTail.calculationForm.$valid) {
			calculationFactory.updateCalculation($scope.formData, id).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					for (var i = 0; i < $scope.calculations.length; i++) {
						if ($scope.calculations[i]._id === id) {
							$scope.calculations[i] = data.data;
							break;
						}
					}
					$scope.showSaveButton = true;
					$scope.showUpdateButton = false;	
					$scope.formData = {};

					$modalInstance.close('oppdatert');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av kalkyle', 'label label-danger');
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