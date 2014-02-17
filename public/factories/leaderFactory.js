function leaderFactory($http, $log) {
	factory = {};
	var leaders = [];
	
	return{
		getLeaders:function() {
	    	var promise = $http({
	        	method: 'GET',
	            url: '/api/leaders',
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("Request Failed: ", reason);
	     	});
		 
	     	return promise;
	    }, 
	    
	    updateLeader:function(formData, id) {
	    	var promise = $http({
	        	method: 'PUT',
	            url: '/api/leaders/' + id,
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

	    addLeader:function(formData) {
	    	var promise = $http({
	        	method: 'POST',
	            url: '/api/leaders',
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
	    
	    deleteLeader:function(id) {
	    	var promise = $http({
	        	method: 'DELETE',
	            url: '/api/leaders/'+ id,
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
	      