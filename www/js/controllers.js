angular.module('starter.controllers',  ['ionic','ngCordova','ngCordovaBeacon'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl',function($scope, $rootScope,$cordovaBeacon ) {
      $scope.settings = {
        enableBluetooth : false
      };
      $scope.devicesInfomation = {
       platform :   device.platform,
       version : device.version,
       model  : device.model,
       width : screen.width,
       height : screen.height
     }

      $scope.beaconsMsg = {
        error : "no Error",
        bcn_cnt : 0,
        bcn_no : "",
        upTime : 0
      };
      $scope.beacons = {};

            $scope.bluetoothStatusChange = function($scope) {

                 alert($scope.settings.enableBluetooth);
                   try{
                        if($scope.settings.enableBluetooth == true){
                              navigator.notification.alert(
                                'The blurtooth is will turn off , It will you can not get event',  // message
                                beaconSwitch(1),         // callback
                                'The blurtooth is will turn off',            // title
                                'OK'                  // buttonName
                              );
                        }else if( $scope.settings.enableBluetooth == false){
                          beaconSwitch(2)
                        }
                  }catch(e){alert(e.message)}
          };



    try {

        cordova.plugins.locationManager.isBluetoothEnabled()
            .then(function(isEnabled) {
                if (isEnabled) {
                  $scope.devicesInfomation.blothEnable = "Can use!";
                    $scope.settings.enableBluetooth = true;
                  loadBeacon();
                } else {
                 $scope.devicesInfomation.blothEnable = "Can not use!";
                   $scope.settings.enableBluetooth = false;

                   navigator.notification.confirm(
                      'This app wants to turn Bluetooth ON for this devices.',  // message
                       beaconSwitch,            // callback to invoke with index of button pressed
                      'Turn on the bluetooth!',           // title
                      ['DENY','ALLOW']     // buttonLabels
                  );

                }
            })
            .fail(console.error)
            .done();


    }catch(err) {
      $scope.beaconsMsg = {
        error : err.message
      };
    }

    /*
     Load beacon infomation
    */
    function loadBeacon(){
                  $cordovaBeacon.requestWhenInUseAuthorization();
                  $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
                     $scope.beaconsMsg.upTime++;
                     $scope.beaconsMsg.bcn_no = "";
                      var uniqueBeaconKey;
                      for(var i = 0; i < pluginResult.beacons.length; i++) {
                          uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                          $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];

                          if(pluginResult.beacons[i].minor=="12968"){
                              $scope.beaconsMsg.bcn_no += pluginResult.beacons[i].minor + "(파랑) | ";
                          }else if(pluginResult.beacons[i].minor=="65151"){
                             $scope.beaconsMsg.bcn_no += pluginResult.beacons[i].minor + "(초록) | ";
                          }else{
                             $scope.beaconsMsg.bcn_no += pluginResult.beacons[i].minor + "| ";
                          }
                        }
                     $scope.beaconsMsg.bcn_cnt = pluginResult.beacons.length;
                      $scope.$apply();
                  });
                  $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));
    }

    function beaconSwitch(v){

           if(v==2){
             cordova.plugins.locationManager.enableBluetooth();
             $scope.settings.enableBluetooth = true;
             loadBeacon();
           }else if(v==1){
             $cordovaBeacon.stopMonitoringForRegion();
             cordova.plugins.locationManager.disableBluetooth();
             $scope.settings.enableBluetooth = false;
           }

    }

/*Functions*/




})
