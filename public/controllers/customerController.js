function customerController($scope, customerFactory, MessageFactory, $log, $rootScope, $modal) {
	$scope.formData = {};
	$scope.customers = [];
	
	// when loading controller, initialize customer list from customerFactory
	init();
	
	function init() {
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

		$rootScope.pageHeader = 'Kundebehandling';

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
        return Math.ceil($scope.filteredCustomers.length/$scope.pageSize);                
    }

	// Put customer to edit in edit form
	$scope.editCustomer = function(index) {
		$scope.showSaveButton = false;
		$scope.showUpdateButton = true;
		$scope.customerEditedID = $scope.filteredCustomers[index]._id;

		$scope.formData = {__v: $scope.filteredCustomers[index].__v,
						   _id: $scope.filteredCustomers[index]._id, 
						   name: $scope.filteredCustomers[index].name }; //$scope.filteredCustomers[index];
		$scope.openCustomerModal(); 
	};

	// Reset edit form
	$scope.resetCustomerForm = function() {
		$scope.formData = {};
		$scope.showSaveButton = true;
		$scope.showUpdateButton = false;	
	};

	// Reset search field
	$scope.resetSearch = function() {
		$scope.searchCustomer = '';
	};

	$scope.openCustomerModal = function () {
	    var modalInstance = $modal.open({
	      	templateUrl: 'partials/customerModalPartial.html',
	      	controller: 'customerModalController',
	      	scope: $scope
	    });	

	    modalInstance.result.then(function (result) {
	    	MessageFactory.prepareForBroadcast('Kunde ' + result, 'label label-success');
	    });
  	};

	// delete customer using customerFactory
	$scope.deleteCustomer = function(id) {
		var promptOptions = {
			title: "Slett kunde",
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
						customerFactory.deleteCustomer(id).then(function(data) {
							if(!$rootScope.RHE(data, false)) {
								for (var i = 0; i < $scope.customers.length; i++) {
									if ($scope.customers[i]._id === id) {
										$scope.customers.splice(i, 1);
										break;
									}
								}

								MessageFactory.prepareForBroadcast('Kunde slettet', 'label label-success');
							} else {
								MessageFactory.prepareForBroadcast('Det oppstod en feil ved sletting av kunde', 'label label-danger');
							}
						});
					}
			    }
			};

		bootbox.confirm(promptOptions);	
	};	
}

