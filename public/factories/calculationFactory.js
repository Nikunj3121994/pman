function calculationFactory($http, $log) {
	factory = {};
	var calculations = [];
	
	return{
		getCalculations:function() {
	    	var promise = $http({
	        	method: 'GET',
	            url: '/api/calculations',
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("Request Failed: ", reason);
	     	});
		 
	     	return promise;
	    }, 

	    getCalculationsForProject:function(id) {
	    	var promise = $http({
	        	method: 'GET',
	            url: '/api/calculationsForProject/' + id,
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("Request Failed: ", reason);
	     	});
		 
	     	return promise;
	    }, 
	    
	    updateCalculation:function(formData, id) {
	    	var promise = $http({
	        	method: 'PUT',
	            url: '/api/calculations/' + id,
	            data: formData,
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data after update: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("PUT request Failed: ", reason);
	     	});
		 
	     	return promise;
	    },

	    addCalculation:function(formData) {
	    	var promise = $http({
	        	method: 'POST',
	            url: '/api/calculations',
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
	    
	    deleteCalculation:function(id) {
	    	var promise = $http({
	        	method: 'DELETE',
	            url: '/api/calculations/'+ id,
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
	      