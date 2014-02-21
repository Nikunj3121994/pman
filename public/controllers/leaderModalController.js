var leaderModalController = function ($scope, $modalInstance, leaderFactory, MessageFactory, $log, $rootScope) {
    //$scope.input = {};
    
    // Create new leader using leaderFactory
	$scope.createLeader = function() {
		if( $scope.$$childTail.leaderForm.$valid) {
			leaderFactory.addLeader($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.leaders.push(data. data);
					$scope.formData = {};

					$modalInstance.close('opprettet');
				} else {
					MessageFactory.prepaForBroadcast('Det oppstod en feil under oppretting av ny leder', 'label label-danger');
				}
			});	
		} else {
			$scope.message = "Fail";
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Update new leader using leaderFactory
	$scope.updateLeader = function(id) {
		if( $scope.$$childTail.leaderForm.$valid) {
			leaderFactory.updateLeader($scope.formData, id).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					for (var i = 0; i < $scope.leaders.length; i++) {
						if ($scope.leaders[i]._id === id) {
							$scope.leaders[i] = data.data;
							break;
						}
					}
					$scope.showSaveButton = true;
					$scope.showUpdateButton = false;	
					$scope.formData = {};

					$modalInstance.close('oppdatert');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av leder', 'label label-danger');
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