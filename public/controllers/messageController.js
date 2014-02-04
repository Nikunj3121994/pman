function MessageController($scope, MessageFactory, $log) {
	$scope.$on('handleMessage', function() {
		$scope.message = MessageFactory.sharedMessage;
		$scope.messageStyle = MessageFactory.messageStyle;
		
		$scope.startTimer();
	});
	
	$scope.$on('timer-stopped', function (event, data){
		$scope.$apply(function() {
			$scope.message = "";	
		});
    });
    
    $scope.startTimer = function (){
		$scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };
}

