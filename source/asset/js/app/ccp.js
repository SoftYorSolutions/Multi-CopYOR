const clipboard = require('electron').clipboard;
const shell = require('electron').shell;
const remote = require('electron').remote;


(function() {
  'use strict';
    var ccpAppModule = angular.module('ccpAppModule',['ngMaterial', 'material.svgAssetsCache']);
   /* ccpAppModule.config(function($mdIconProvider) {
      $mdIconProvider
        .iconSet('action', 'img/icons/sets/action-icons.svg', 24)
        .iconSet('device', 'img/icons/sets/device-icons.svg', 24)
        .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
        .defaultIconSet('img/icons/sets/core-icons.svg', 24);
    });*/
    
    //-------------- CONTROLLERS -----------------
    ccpAppModule.controller("ccpAppCtrl", function($scope,$rootScope, $interval, $mdToast) {
        var self = this;
        self.timerHandler = null;
        $scope.actionParam = false;
        $scope.isValidCopy = true;
        $scope.appInfo = remote.getGlobal('appInfo');
        
        self.ccpCache = [];
        self.addToCache = function(){
            //console.log(">" + clipboard.readText() + "<");
            if(clipboard.readText()==""){
                if($scope.isValidCopy){
                  $scope.showSimpleToast("Invalid Copy, Supports Only Text");  
                }
                $scope.isValidCopy = false; 
            }else{
                $scope.isValidCopy = true;  
                var curIndex = self.ccpCache.indexOf(clipboard.readText());
                if( curIndex == -1) {
                    self.ccpCache.push(clipboard.readText());
                }else{
                    if(curIndex != (self.ccpCache.length-1)){
                        //console.log(curIndex + "=" + (self.ccpCache.length - curIndex))
                        $scope.use(self.ccpCache.length - curIndex-1);
                    }
                }
            }
                             
        };
        var start = function(){
            self.timerHandler =  $interval(function(){self.addToCache()}, 500);
            $scope.showSimpleToast("Copy Recorder Started");
        };
        var stop = function(){
            $interval.cancel(self.timerHandler);
            $scope.showSimpleToast("Copy Recorder Stopped");
        };
        
        $scope.use = function(ccpIndex, $event){
            var usedStr = self.ccpCache[(self.ccpCache.length - ccpIndex-1)];
            clipboard.writeText(usedStr+"");
            self.ccpCache.splice((self.ccpCache.length - ccpIndex-1),1);
            self.addToCache(usedStr);
            $scope.showSimpleToast("Using new Copy Text");
            if(typeof $event != 'undefined' ){
                $event.stopPropagation();
            }
            
                
            
        };
        $scope.remove = function(ccpIndex, $event){
            self.ccpCache.splice((self.ccpCache.length - ccpIndex-1),1);
            $scope.showSimpleToast("Deleted !!!");
            $event.stopPropagation();
            
        };
        $scope.help = function(){
           
          // shell.openExternal('http://www.softyor.com/assets/php/YorApps/MultiCopYOR/help.php?v=1.0')
            var w = window.open($scope.appInfo.baseUrl + "/assets/php/YorApps/MultiCopYOR/help.php?v="+$scope.appInfo.version, "help"
                                ,"width=420,height=650,x=0,y=0,resizable=true,maximizable=true,alwaysOnTop=false");
        
        }; 
        $scope.website = function(){
           shell.openExternal($scope.appInfo.baseUrl + "?info=" + $scope.appInfo.name+$scope.appInfo.version);
        };
        $scope.contact = function(){
           shell.openExternal("mailto://" + $scope.appInfo.emailId + "?subject=" + $scope.appInfo.name+$scope.appInfo.version);
        };
        var action = function(){
           if($scope.actionParam){
               start();
           }else{
               stop();
           }
            
        };
        var last = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        $scope.toastPosition = angular.extend({},last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
              .filter(function(pos) { return $scope.toastPosition[pos]; })
              .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }
        $scope.showSimpleToast = function(msg) {
            var pinTo = 'bottom';
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position(pinTo )
                .hideDelay(1000)
            );
        };
        
        $scope.$watch('actionParam', action);

        self.addToCache();
		console.log("loaded... ccpAppCtrl");
        
	});
   
})();








