function projectSelectModalController($scope, $modalInstance, projectFactory, $log, $rootScope) {
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

		$scope.showCancelButton = true;	

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
        return Math.ceil($scope.$$childTail.filteredProjects.length/$scope.pageSize);                
    }

	// Reset search field
	$scope.resetSearch = function() {
		$scope.$$childTail.searchProject = '';
	};

	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

	$scope.selectProject = function (result) {
        $modalInstance.close(result);
    };
}

