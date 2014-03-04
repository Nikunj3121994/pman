function calculationController($scope, $location, calculationFactory, MessageFactory, $log, $rootScope, $modal) {
	$scope.formData = {};
	$scope.calculations = [];
	$scope.activeCalculation = {};
	$scope.hideCalcList = false;
	
	// when loading controller, initialize calculation list from calculationFactory
	init();
	
	function init() {
		setUpProjectWatch();

		if(!$rootScope.selectedProjectID) {
			MessageFactory.prepareForBroadcast('Aktivt prosjekt må velges fra menyen prosjekthåndtering', 'label label-warning');
			//setUpProjectWatch();
			return;
		}

		//getCalculations($scope.selectedProject_id);
		//preparePage();	
		//setUpProjectWatch();
    	
	}

	$scope.getCalcListViewStatus = function() {
		return $scope.hideCalcList;
	}

	$scope.toggleCalcListView = function(state) {
		$scope.hideCalcList = state;
	}

	function setUpProjectWatch(idproject) {
		$rootScope.$watch('selectedProjectID', function () {
	    	$scope.selectedProjectID = $rootScope.selectedProjectID;
	    	$scope.selectedProjectTitle = $rootScope.selectedProjectTitle;
	    	$scope.selectedProject_id = $rootScope.selectedProject_id;
	    	if($scope.selectedProjectID) {
	    		getCalculations($scope.selectedProject_id);	
	    	}
	    	preparePage();	
	    });
	}

	function getCalculations(idproject) {
		calculationFactory.getCalculationsForProject(idproject).then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				$scope.calculations = data.data;
			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved lasting av kalkyler', 'label label-danger');
			}
		});
	}

	// Get all parts from avtive calculation
	$scope.getCalculationParts = function() {
		return $scope.activeCalculation._parts;
	}

	// Adds new part to active calculation
	$scope.addNewPart = function() {
		$log.info($scope.activeCalculation)
		$scope.activeCalculation._parts.push({title: 'Test', type: 'Test type', active: 'Active test'})
	}

	// Show details for one calculation
	$scope.openCalculation = function(index) {
		$scope.activeCalculation = $scope.filteredCalculations[index];
		$log.info($scope.filteredCalculations[index]);
		$log.info($scope.activeCalculation);
		$location.path( '/calculationParts' );
	};



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

    function preparePage(){
    	$rootScope.pageHeader = 'Prosjektbehandling';

       	$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
		$scope.showCancelButton = true;	 

		$scope.currentPage = 0;
    	$scope.pageSize = 10;
    }
	
	$scope.numberOfPages=function(){
        return Math.ceil($scope.filteredCalculations.length/$scope.pageSize);                
    }

	$scope.openCalculationModal = function () {
	    var modalInstance = $modal.open({
	      	templateUrl: 'partials/calculationModalPartial.html',
	      	controller: 'calculationModalController',
	      	scope: $scope
	    });	

	    modalInstance.result.then(function (result) {
	    	MessageFactory.prepareForBroadcast('Kalkyle ' + result, 'label label-success');
	    });
  	};

	// Put calculation to edit in edit form
	$scope.editCalculation = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;

		$scope.calculationEditedID = $scope.filteredCalculations[index]._id;

		$scope.formData = {__v: $scope.filteredCalculations[index].__v,
						   _id: $scope.filteredCalculations[index]._id, 
						   title: $scope.filteredCalculations[index].title,
						   type: $scope.filteredCalculations[index].type,
						   active: $scope.filteredCalculations[index].active }; //$scope.filteredCalculations[index];
		$scope.openCalculationModal(); 
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

