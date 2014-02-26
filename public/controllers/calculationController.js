function calculationController($scope, calculationFactory, MessageFactory, $log, $rootScope, $modal) {
	$scope.formData = {};
	$scope.calculations = [];
	
	// when loading controller, initialize calculation list from calculationFactory
	init();
	
	function init() {
		calculationFactory.getCalculations().then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				$scope.calculations = data.data;
			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved lasting av kalkyler', 'label label-danger');
			}
		});

		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
		$scope.showCancelButton = true;	

		$rootScope.pageHeader = 'Prosjektbehandling';

		$scope.currentPage = 0;
    	$scope.pageSize = 10;	
	}

	$scope.changePage=function(add){
        if(!add) {
        	if($scope.currentPage>0)
        		$scope.currentPage = $scope.currentPage-1;
        } else {
        	if($scope.currentPage<$scope.numberOfPages()-1) {
        		$scope.currentPage = $scope.currentPage+1;
        	}
        }       
    }
	
	$scope.numberOfPages=function(){
        return Math.ceil($scope.filteredCalculations.length/$scope.pageSize);                
    }

	// Create new calculation using calculationFactory
	$scope.createCalculation = function() {
		if( $scope.calculationForm.$valid) {
			calculationFactory.addCalculation($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.calculations.push(data. data);
					$scope.formData = {};

					MessageFactory.prepareForBroadcast('Ny kalkyle opprettet', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppretting av ny kalkyle', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Create new calculation using calculationFactory
	$scope.updateCalculation = function(id) {
		if( $scope.calculationForm.$valid) {
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

					MessageFactory.prepareForBroadcast('Kalkyle oppdatert', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av kalkyle', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Put calculation to edit in edit form
	$scope.editCalculation = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;
		$scope.calculationEditedID = $scope.filteredCalculations[index]._id;
		$scope.formData = $scope.filteredCalculations[index];
	};

	// Reset edit form
	$scope.resetCalculationForm = function() {
		$scope.formData = {};
		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;
	};

	// Reset search field
	$scope.resetSearch = function() {
		$scope.searchCalculation = '';
	};

	// delete calculation using calculationFactory
	$scope.deleteCalculation = function(id) {
		bootbox.confirm("Er du sikker på at du vil slette?", function(result) {
			if(result) {
				calculationFactory.deleteCalculation(id).then(function(data) {
					if(!$rootScope.RHE(data, false)) {
						for (var i = 0; i < $scope.calculations.length; i++) {
							if ($scope.calculations[i]._id === id) {
								$scope.calculations.splice(i, 1);
								break;
							}
						}

						MessageFactory.prepareForBroadcast('Kalkyle slettet', 'label label-success');
					} else {
						MessageFactory.prepareForBroadcast('Det oppstod en feil ved sletting av kalkyle', 'label label-danger');
					}
				});
			}
		});
	};	
}

