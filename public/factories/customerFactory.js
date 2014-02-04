function customerFactory($http, $log) {
	factory = {};
	var customers = [];
	
	return{
		getCustomers:function() {
	    	var promise = $http({
	        	method: 'GET',
	            url: '/api/customers',
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("Request Failed: ", reason);
	     	});
		 
	     	return promise;
	    }, 
	    
	    addCustomer:function(formData) {
	    	var promise = $http({
	        	method: 'POST',
	            url: '/api/customers',
	            data: formData,
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data after instert: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("POST request Failed: ", reason);
	     	});
		 
	     	return promise;
	    },
	    
	    deleteCustomer:function(id) {
	    	var promise = $http({
	        	method: 'DELETE',
	            url: '/api/customers/'+ id,
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data after delete: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("DELETE request Failed: ", reason);
	     	});
		 
	     	return promise;
	    } 
	};
}
	      