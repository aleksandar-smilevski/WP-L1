/**
 * Created by 141523 on 10/18/2016.
 */
(function (angular) {
  'use strict';

  // angular
  //   .module('wp-angular-starter')
  //   .controller('GroupController', GroupController);
  angular.module('wp-angular-starter')
    .controller('StudentController', StudentController);

  //angular.module('wp-angular-starter', ['smart-table']);


  StudentController.$inject = ['$log', 'StudentService', 'GroupService'];

  /* @ngInject */
  function StudentController($log, StudentService, GroupService) {
    var vm = this;
    vm.title = 'Student';
    vm.save = save;
    vm.clear = clear;
    vm.edit = edit;
    vm.remove = remove;
    vm.entity = {};
    vm.entities = [];
    vm.saveOkMsg = null;
    vm.saveErrMsg = null;
    vm.availableSizes = [];
    loadGroups();
    loadSelect();
    function loadGroups() {
      StudentService.getAll().then(function (data) {
        vm.entities = data;
      });
    }
    function loadSelect() {
      GroupService.getAll().then(function (data) {
        var i;
        var a = [];
        for(i=0;i<data.length;i++) {
          vm.availableSizes.push(data[i].name);
        }
      });
    }

    function save() {
      vm.saveOkMsg = null;
      vm.saveErrMsg = null;

      var promise = StudentService.save(vm.entity);
      promise.then(successCallback, errorCallback);
      function successCallback(data) {
        loadGroups();
        vm.saveOkMsg = "Group with id " + data.id + " is saved";
        clear();
      }

      function errorCallback(data) {
        vm.saveErrMsg = "Saving error occurred: " + data.message;
      }
    }

    function clear() {
      vm.entity = {};
    }

    function edit(entity) {
      vm.entity = {};
      angular.extend(vm.entity, entity);
    }

    function remove(entity) {
      StudentService
        .remove(entity)
        .then(function () {
          loadGroups();
        });
    }
  }

})(angular);
