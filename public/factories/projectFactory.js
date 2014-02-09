function projectFactory($http, $log) {
	factory = {};
	var projects = [];
	
	return{
		getProjects:function() {
	    	var promise = $http({
	        	method: 'GET',
	            url: '/api/projects',
	            timeout: 10000
	        }).then(function(response) {
	        	$log.info('Retrieved data: ',response);
	           	return response;  
	        },  function(reason) {
	        	$log.error("Request Failed: ", reason);
	     	});
		 
	     	return promise;
	    }, 
	    
	    updateProject:function(formData, id) {
	    	var promise = $http({
	        	method: 'PUT',
	            url: '/api/projects/' + id,
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

	    addProject:function(formData) {
	    	var promise = $http({
	        	method: 'POST',
	            url: '/api/projects',
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
	    
	    deleteProject:function(id) {
	    	var promise = $http({
	        	method: 'DELETE',
	            url: '/api/projects/'+ id,
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
	      