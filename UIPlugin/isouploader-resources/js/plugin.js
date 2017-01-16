'use strict';

// Use to initiate the plugin

(function() {

    var app = angular.module('plugin.init', ['plugin.common']);
    var lang = top.location.href.split("=")[1].split("#")[0];
  
    app.service('contentWindowService', function(){
    var contentWindow = null ;
    var tabWindow = null;

    var menuScope = null;
    var alertScope = null;
    var tableScope = null;

        return {
            set : function(contentWindow) {
                this.contentWindow = contentWindow;
            },
            get : function() {
                return this.contentWindow;
            },
            setTabWindow : function(tabWindow) {
                this.tabWindow = tabWindow;
            },
            getTabWindow : function() {
                return this.tabWindow;
            },
            setMenuScope : function(menuScope) {
                this.menuScope = menuScope;
            },
            getMenuScope : function() {
                return this.menuScope;
            },
            setAlertScope : function(alertScope) {
                this.alertScope = alertScope;
            },
            getAlertScope : function() {
                return this.alertScope;
            },
            setTableScope : function(tableScope) {
                this.tableScope = tableScope;
            },
            getTableScope : function() {
                return this.tableScope;
            }
        };
  });

   app.factory('tabManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {
      return {
         addTab: function () {
            if(lang == 'zh_CN'){
                //pluginApi.addMainTab('ISO文件上传', 'isouploader-tab', urlUtil.relativeUrl('tab.html'));
                pluginApi.addSubTab('Storage', 'ISO文件上传', 'storage-iso-upload-tab',urlUtil.relativeUrl('tab.html'));
                pluginApi.addSubTab('Storage', '镜像', 'storage-iso-list-tab',urlUtil.relativeUrl('list.html'));
            }
            else{
                //pluginApi.addMainTab('ISO Uploader', 'isouploader-tab', urlUtil.relativeUrl('tab.html'));
                pluginApi.addSubTab('Storage', 'ISO Uploader', 'storage-iso-upload-tab',urlUtil.relativeUrl('tab.html'));
                pluginApi.addSubTab('Storage', 'ISO', 'storage-iso-list-tab',urlUtil.relativeUrl('list.html'));
            }
         }
      };
   }]);

   // Define event handler functions for later invocation by UI plugin infrastructure
   app.factory('pluginEventHandlers', ['pluginName', 'pluginApi', 'tabManager', 'contentWindowService', '$http',function (pluginName, pluginApi, tabManager, contentWindow,$http) {
      function callbackClick(storage){
           pluginApi.setTabAccessible('storage-iso-upload-tab', false);
           pluginApi.setTabAccessible('storage-iso-list-tab', false); 
           sessionStorage.setItem("domain_name", storage.name);
           $http({
                     url:'/eayunos/api/storagedomains/'+storage.id,
                     method:'GET',
                     headers: {"Content-Type":"application/xml","Prefer":"persistent-auth"}
           }).success(function(data,header,config,status){
                     if(sessionStorage.getItem("domain_name") == null){
                         setTimeout(function(){
                             console.log("hidden iso-uploader-plugin tab");
                             pluginApi.setTabAccessible('storage-iso-upload-tab', data.type == 'iso');
                             pluginApi.setTabAccessible('storage-iso-list-tab', data.type == 'iso');
                         },3000);
                     }
                     pluginApi.setTabAccessible('storage-iso-upload-tab', data.type == 'iso');
                     pluginApi.setTabAccessible('storage-iso-list-tab', data.type == 'iso');
                     pluginApi.setTabContentUrl('storage-iso-upload-tab','plugin/IsoUploader/tab.html#'+data.available);
                     pluginApi.setTabContentUrl('storage-iso-list-tab','plugin/IsoUploader/list.html#'+storage.id);
            }).error(function(data,header,config,status){
                     pluginApi.setTabAccessible('storage-iso-upload-tab', false);
                     pluginApi.setTabAccessible('storage-iso-list-tab', false);
            });
              
      }
      return {
         UiInit: function () {
            tabManager.addTab();
         },
         MessageReceived: function (dataString, sourceWindow) {
              try {
                    var data = JSON.parse(dataString); // verify that json is valid
                }
                catch (e) {
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Impossible to parse the received message. --> Message ignored.');
                }

              if (data && data.action && data.sender === pluginName) {
                  switch (data.action) {
                  // case ('msg'):
                  //
                  //   break;
                  default:
                    console.warn('EMDPlugin just receive a message with an undefined action: ' + data.action);
                }
              }
          },
          StorageSelectionChange: function() {
              var selectedItem = (arguments.length > 0) ? arguments[0] : null;
              if(selectedItem && selectedItem!=null){
                  callbackClick(selectedItem);
              }
          },
          SystemTreeSelectionChange: function(selectedNode) {
              if(selectedNode.type == 'Storage'){
                  callbackClick(selectedNode.entity);
                //pluginApi.setTabAccessible('isouploader-tab', selectedNode.type == 'System');
              }
          }
      };
   }]);

   // Register event handler functions and tell the API we are good to go.
   app.factory('initService', ['pluginApi', 'pluginEventHandlers', function (pluginApi, pluginEventHandlers) {
      return {
          bootstrapPlugin: function () {
          // Get the config from the file to setup the api plugin
          var config = pluginApi.configObject();
          pluginApi.options(config.allowedMessageOriginsJSON);
          pluginApi.register(pluginEventHandlers);
          pluginApi.ready();
        }
      };
   }]);

   app.run(['initService', function (initService) {
      initService.bootstrapPlugin();
   }]);
})();
