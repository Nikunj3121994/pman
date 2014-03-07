function projectController($scope, $location, projectFactory, MessageFactory, $log, $rootScope, customerFactory, leaderFactory, $modal) {
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

    $scope.go = function ( path ) {
	  	$location.path( path );
	};

	$scope.setProjectActive = function (projectData) {
	  	$scope.projectSelected = "true";
	   	$rootScope.selectedProjectID = projectData.id;
	    $rootScope.selectedProjectTitle = projectData.title;
	    $rootScope.selectedProject_id = projectData._id;
	    $location.path( '/projectCalculations' );
	};
	
	// Put project to edit in edit form
	$scope.editProject = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;
		$scope.projectEditedID = $scope.filteredProjects[index]._id;
		
		$scope.formData = {__v: $scope.filteredProjects[index].__v,
						   _id: $scope.filteredProjects[index]._id, 
						   title: $scope.filteredProjects[index].title,
						   idproject: $scope.filteredProjects[index].idproject,
						   _customer: $scope.filteredProjects[index]._customer,
						   _leader: $scope.filteredProjects[index]._leader }; 
		$scope.openProjectModal(); 
	};

	$scope.openProjectModal = function () {
	    var modalInstance = $modal.open({
	      	templateUrl: 'partials/projectModalPartial.html',
	      	controller: 'projectModalController',
	      	scope: $scope
	    });	

	    modalInstance.result.then(function (result) {
	    	MessageFactory.prepareForBroadcast('Prosjekt ' + result, 'label label-success');
	    });
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
		var promptOptions = {
			title: "Slett prosjekt",
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
			    }
			};

		bootbox.confirm(promptOptions);	
	};	
}

