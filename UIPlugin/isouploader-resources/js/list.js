'use strict';

(function() {
  var app = angular.module('plugin.list', ['plugin.common', 'plugin.filters']);
  app.controller('TableController', ['$scope','$http', function($scope,$http){
      $scope.files = null;//[{name:'aaa.iso',type:'iso',size:'30.15G'},{name:'aaa.iso',type:'iso',size:'30.15G'},{name:'aaa.iso',type:'iso',size:'30.15G'}];
      var domainId = location.href.split("#")[1];
   
      $http({
    	  url:'/eayunos/api/storagedomains/'+domainId+'/files',
    	  method:'GET',
    	  headers: {"Content-Type":"application/xml","Prefer":"persistent-auth"}
      }).success(function(data,header,config,status){
    	    //console.log(data.file);
          $scope.files = data.file;
      }).error(function(data,header,config,status){
    	  //处理响应失败
      });
      
      $scope.rmIso = function(index){
    	    var file = $scope.files[index];
			$.ajax({
		             type: "POST",
		             url: "/iso-uploader-plugin/RemoveFile",
		             data: {isoName:file.name,domainName:sessionStorage.getItem("domain_name")},
		             dataType: "text",
		             success: function(rep){
		            	 if(rep=="1"){
                                      $scope.$apply(function(){
                                           $scope.files.splice(index,1);
				      });
		 	         }else{
                                      alert(rep);
                                 }
		             }
		     });
      }
      $scope.getStatus = function(){
    	  if($scope.files==null){
    		  return "loading";
    	  }
    	  if($scope.files.length==0){
    	  	return "nofiles"
    	  }
      }
  }]);
})();
