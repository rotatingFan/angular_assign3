(function(){

'use strict'

angular.module('NarrowDownMenuApp', [])
.controller('NarrowDownMenuController',NarrowDownMenuController)
.service('NarrowDownMenuService',NarrowDownMenuService)
.directive('foundItems', foundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


NarrowDownMenuController.$inject = ['NarrowDownMenuService']
function NarrowDownMenuController(NarrowDownMenuService){
    var controller = this;
    controller.seeItemArray = function(){
        console.log(NarrowDownMenuService.getItems());
    };

    controller.foundItemsList = NarrowDownMenuService.getItems();

    controller.searchTerm = '';

    controller.getMenu = function(searchTerm){
        var promise = NarrowDownMenuService.getMenuForCatrgory('');

        promise.then(function(response){
            console.log(response.data);
            var itemsArray = response.data.menu_items;
            NarrowDownMenuService.resetitemArray();

            angular.forEach(itemsArray, function(item) {
              if(checkIfSimilar(searchTerm, item) == true){
                  NarrowDownMenuService.addItem(item.name, item.description);
              }
            });
            console.log(NarrowDownMenuService.getItems());
        })
        .catch(function(error){
            console.log(error)
        });
    };

    function checkIfSimilar(searchTerm, item){
        var name = item.name;

        if (name.toLowerCase().indexOf(searchTerm) !== -1) {
            return true;
        }else{
            return false;
        }

    };
}


NarrowDownMenuService.$inject = ['$http', 'ApiBasePath'];
function NarrowDownMenuService($http, ApiBasePath){
    var service = this;
    
    var foundItemArray = [];

    service.getItems = function(){
        return foundItemArray;
    };

    service.addItem = function(itemName, itemDescription){
        var item={
            name:itemName,
            description: itemDescription
        };
        foundItemArray.push(item);

    };

    service.resetitemArray = function(){
        foundItemArray = [];
    }

    service.getMenuForCatrgory = function(searchTerm){
        var response = $http({
            method:"GET",
            url: (ApiBasePath + "/menu_items.json"),
            params:{
                category: searchTerm
            }
        });

        return response;
    };
}

function foundItemsDirective(){
    var ddo={
        templateUrl:'foundItems.html',
        scope:{
            menuList: '=menuList',
            onRemove: '&'
        },
    };

    return ddo;

}


})();
