function leaderController($scope, leaderFactory, MessageFactory, $log, $rootScope, $modal) {
	$scope.formData = {};
	$scope.leaders = [];
	
	// when loading controller, initialize leader list from leaderFactory
	init();
	
	function init() {
		leaderFactory.getLeaders().then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				$scope.leaders = data.data;
			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved lasting av prosjektledere', 'label label-danger');
			}
		});

		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
		$scope.showCancelButton = true;	

		$rootScope.pageHeader = 'Prosjektlederbehandling';

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
        return Math.ceil($scope.filteredLeaders.length/$scope.pageSize);                
    }

	// Create new leader using leaderFactory
	/*$scope.createLeader = function() {
		if( $scope.leaderForm.$valid) {
			leaderFactory.addLeader($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.leaders.push(data. data);
					$scope.formData = {};

					MessageFactory.prepareForBroadcast('Ny prosjektleder opprettet', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppretting av ny prosjektleder', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};*/

	// Create new leader using leaderFactory
	/*$scope.updateLeader = function(id) {
		if( $scope.leaderForm.$valid) {
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

					MessageFactory.prepareForBroadcast('Prosjektleder oppdatert', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av prosjektleder', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};*/

	// Put leader to edit in edit form
	$scope.editLeader = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;
		$scope.leaderEditedID = $scope.filteredLeaders[index]._id;
		
		$scope.formData = {__v: $scope.filteredLeaders[index].__v,
						   _id: $scope.filteredLeaders[index]._id, 
						   name: $scope.filteredLeaders[index].name }; //$scope.filteredCustomers[index];
		$scope.openLeaderModal(); 


	};

	// Reset edit form
	$scope.resetLeaderForm = function() {
		$scope.formData = {};
		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
	};

	// Reset search field
	$scope.resetSearch = function() {
		$scope.searchLeader = '';
	};

	$scope.openLeaderModal = function () {
	    var modalInstance = $modal.open({
	      	templateUrl: 'partials/leaderModalPartial.html',
	      	controller: 'leaderModalController',
	      	scope: $scope
	    });	

	    modalInstance.result.then(function (result) {
	    	MessageFactory.prepareForBroadcast('Prosjektleder ' + result, 'label label-success');
	    });
  	};

	// delete leader using leaderFactory
	$scope.deleteLeader = function(id) {
		bootbox.confirm("Er du sikker på at du vil slette?", function(result) {
			if(result) {
				leaderFactory.deleteLeader(id).then(function(data) {
					if(!$rootScope.RHE(data, false)) {
						for (var i = 0; i < $scope.leaders.length; i++) {
							if ($scope.leaders[i]._id === id) {
								$scope.leaders.splice(i, 1);
								break;
							}
						}

						MessageFactory.prepareForBroadcast('Prosjektleder slettet', 'label label-success');
					} else {
						MessageFactory.prepareForBroadcast('Det oppstod en feil ved sletting av prosjektleder', 'label label-danger');
					}
				});
			}
		});
	};	
}

