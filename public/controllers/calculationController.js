function calculationController($scope, $location, calculationFactory, MessageFactory, $log, $rootScope, $modal) {
	$scope.formData = {};
	$scope.calculations = [];
	$scope.activeCalculation = {};
	$scope.hideCalcList = false;
	$scope.unsavedData = false;
	$scope.buttonColor = "";
	
	// when loading controller, initialize calculation list from calculationFactory
	init();
	
	//Initialze partial
	function init() {
		setUpProjectWatch();

		if(!$rootScope.selectedProjectID) {
			MessageFactory.prepareForBroadcast('Aktivt prosjekt må velges fra menyen prosjekthåndtering', 'label label-warning');
			//setUpProjectWatch();
			return;
		}
	}


	//==================== General page functions =================

	//Sets up initial page options
    function preparePage(){
    	$rootScope.pageHeader = 'Prosjektbehandling';

       	$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
		$scope.showCancelButton = true;	 

		$scope.currentPage = 0;
    	$scope.pageSize = 10;
    }
	

	//Calculates the number of pages in the list of calculations (page size defined in preparePage())
	$scope.setUnsavedDataStatus=function(status){
		$scope.unsavedData = status;

        if($scope.unsavedData) {
    		$scope.buttonColor = 'blue';
    	} else {
    		$scope.buttonColor = 'black';
    	}

    	if(!$scope.$$phase) {
  			$scope.$apply();
		}
    }

	//Calculates the number of pages in the list of calculations (page size defined in preparePage())
	$scope.numberOfPages=function(){
        return Math.ceil($scope.filteredCalculations.length/$scope.pageSize);                
    }

	//Gets the current visibility status for calculation list for the give project
	$scope.getCalcListViewStatus = function() {
		return $scope.hideCalcList;
	}

	//Toogles visibility on the list of calculations for a given project
	$scope.toggleCalcListView = function(state) {
		if(state == false) {
			if($scope.unsavedData) {
				bootbox.dialog({
				  message: "Kalkyle endret! Vil du lagre endringer?",
				  title: "Ulagrede endringer",
				  buttons: {
				    success: {
				      label: "Ja",
				      className: "btn-primary",
				      callback: function(result) {
						$scope.updateActiveCalculation();		
						}
				    },
				    danger: {
				      label: "Nei",
				      className: "btn-standard",
				      callback: function() {
				        $scope.setUnsavedDataStatus(false);
				        $scope.revertChanges();
				      }
				    },
				  }
				});
			} 
		} 
		$scope.hideCalcList = state;
	}

	//This part will be monitoring the rootScope for changes on the active (selected) project
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

	//This is used for paging through list of calculations
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

    // Reset search field on top of calculation list
	$scope.resetSearch = function() {
		$scope.searchCalculation = '';
	};


	//==================== Calculation spesific functions =======================

    //Opens modal for adding a new calculation
	$scope.openCalculationModal = function () {
	    var modalInstance = $modal.open({
	      	templateUrl: 'partials/calculationModalPartial.html',
	      	controller: 'calculationModalController',
	      	scope: $scope
	    });	

	    modalInstance.result.then(function (result) {
	    	MessageFactory.prepareForBroadcast('Kalkyle ' + result, 'label label-success');
	    }, function () {
      		$scope.resetCalculationForm();
    	});
  	};

	// Put calculation to edit in edit form in modal.
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

	// Reset formdata to prevent it from showing when not wanted
	$scope.resetCalculationForm = function() {
		$scope.formData = {};
		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;
	};


	// Update calculation using calculationFactory
	$scope.updateActiveCalculation = function() {
		calculationFactory.updateCalculation($scope.activeCalculation, $scope.activeCalculation._id).then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				for (var i = 0; i < $scope.calculations.length; i++) {
					if ($scope.calculations[i]._id === $scope.activeCalculation._id) {
						$scope.calculations[i] = data.data;
						$scope.activeCalculation = $scope.calculations[i];
						$scope.calculationPartsOriginal = $scope.activeCalculation._parts;
						break;
					}
				}
				$scope.setUnsavedDataStatus(false);

				MessageFactory.prepareForBroadcast('Kalkyle lagret', 'label label-success');
			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av kalkyle', 'label label-danger');
			}
		});	
	};


	//=================== Part spesific functions ===================

	// Get all calculation parts from active calculation
	$scope.getCalculationParts = function() {
		return $scope.activeCalculation._parts;
	}

	// Adds new calculation part to active calculation
	$scope.addNewPart = function(title) {
		$scope.activeCalculation._parts.push({title: title, active: false})
		$scope.$apply();	
		$scope.setUnsavedDataStatus(true);
	}

	// Show details view (parts) for one calculation. This will toggle visibility for calculation view also.
	$scope.openCalculation = function(index) {
		$scope.activeCalculation = $scope.filteredCalculations[index];
		$scope.calculationPartsOriginal = $scope.activeCalculation._parts.slice();
		$scope.toggleCalcListView(true);
	};

	$scope.revertChanges = function() {
		$scope.activeCalculation._parts = $scope.calculationPartsOriginal;
	}

	// Show details view (parts) for one calculation. This will toggle visibility for calculation view also.
	$scope.saveCalculation = function(index) {
		$scope.updateActiveCalculation();
	};

	 //Opens modal for adding a new calculation part
	$scope.openCalculationPartModal = function () {
		var promptOptions = {
			title: "Tittel for ny kalkyle",
			buttons: {
				confirm: {
					label: "Lagre"
				},
				cancel: {
			    	label: "Avbryt"
			    }
			  },
			  callback: function(result) {                
			      if (result) {                                             
			      	$scope.addNewPart(result);                        
			      } 
			    }
			};

		bootbox.prompt(promptOptions);	
  	};

	//==================== Factory interaction =====================

	//Get the list of calculations for the active project
	function getCalculations(idproject) {
		calculationFactory.getCalculationsForProject(idproject).then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				$scope.calculations = data.data;
			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved lasting av kalkyler', 'label label-danger');
			}
		});
	}

	// delete calculation using calculationFactory
	$scope.deleteCalculation = function(id) {
		var promptOptions = {
			title: "Slett kalkyle",
			message: "Er du sikker på at du vil slette?",
			buttons: {
				confirm: {
					label: "Ja",
					className: "btn-danger",
				},
				cancel: {
			    	label: "Nei",
			    	className: "btn-primary",
			    }
			  },
			  callback: function(result) {                
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
			    }
			};

		bootbox.confirm(promptOptions);	
	};	
}

