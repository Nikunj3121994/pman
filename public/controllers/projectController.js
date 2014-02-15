function projectController($scope, projectFactory, MessageFactory, $log, $rootScope, customerFactory) {
	$scope.formData = {};
	$scope.projects = [];
	
	// when loading controller, initialize project list from projectFactory
	init();
	
	function init() {
		projectFactory.getProjects().then(function(data) {
			if(!$rootScope.RHE(data, true)) {
				$scope.projects = data.data;

			} else {
				MessageFactory.prepareForBroadcast('Det oppstod en feil ved lasting av prosjekter', 'label label-danger');
			}
		});

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
        return Math.ceil($scope.filteredProjects.length/$scope.pageSize);                
    }
	
	
	// Create new project using projectFactory
	$scope.createProject = function() {
		if( $scope.projectForm.$valid) {
			projectFactory.addProject($scope.formData).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					$scope.projects.push(data. data);
					$scope.formData = {};

					MessageFactory.prepareForBroadcast('Nytt prosjekt opprettet', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppretting av nytt prosjekt', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Create new project using projectFactory
	$scope.updateProject = function(id) {
		if( $scope.projectForm.$valid) {
			projectFactory.updateProject($scope.formData, id).then(function(data) {
				if(!$rootScope.RHE(data, true)) {
					for (var i = 0; i < $scope.projects.length; i++) {
						if ($scope.projects[i]._id === id) {
							$scope.projects[i] = data.data;
							break;
						}
					}
					$scope.showSaveButton = true;
					$scope.showUpdateButton = false;	
					$scope.formData = {};

					MessageFactory.prepareForBroadcast('Prosjekt oppdatert', 'label label-success');
				} else {
					MessageFactory.prepareForBroadcast('Det oppstod en feil under oppdatering av prosjekt', 'label label-danger');
				}
			});	
		} else {
			MessageFactory.prepareForBroadcast('Kontroller felter med rød -', 'label label-warning');	
		}
	};

	// Put project to edit in edit form
	$scope.editProject = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;
		$scope.projectEditedID = $scope.filteredProjects[index]._id;
		$scope.formData = $scope.filteredProjects[index];
	};

	// reset edit form
	$scope.resetProjectForm = function() {
		$scope.formData = {};
		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
	};

	// Reset search field
	$scope.resetSearch = function() {
		$scope.searchProject = '';
	};

	// delete project using projectFactory
	$scope.deleteProject = function(id) {
		bootbox.confirm("Er du sikker på at du vil slette?", function(result) {
			if(result) {
				projectFactory.deleteProject(id).then(function(data) {
					if(!$rootScope.RHE(data, false)) {
						for (var i = 0; i < $scope.projects.length; i++) {
							if ($scope.projects[i]._id === id) {
								$scope.projects.splice(i, 1);
								break;
							}
						}

						MessageFactory.prepareForBroadcast('Prosjekt slettet', 'label label-success');
					} else {
						MessageFactory.prepareForBroadcast('Det oppstod en feil ved sletting av prosjekt', 'label label-danger');
					}
				});
			}
		});
	};	
}

