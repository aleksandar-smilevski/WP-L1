(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter', [
      'ui.router',
      'ui.select',
      'smart-table'
    ]);

})(angular);

(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .config(registerState);

  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    var $log = {
      debug: function (message) {
        if (console && typeof console.log === 'function') {
          console.log(message);
        }
      }
    };

    $stateProvider.state('first', {
      url: '/first',
      templateUrl: 'app/c1/first.view.html',
      controller: 'FirstController',
      controllerAs: 'vm'
    });


    $log.debug('State first initialized');

    $stateProvider.state('second', {
      url: '/second',
      templateUrl: 'app/c1/second.view.html',
      controller: 'SecondController',
      controllerAs: 'vm'
    });
    $log.debug('State second initialized');
  }

  //x.nesto -> calling 'nesto' from undefined
  // var x = function () {
  //   this.nesto = 'nest';
  // };

})(angular);

(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .controller('FirstController', FirstControllerFn);

  FirstControllerFn.$inject = ['$scope', '$log'];

  /* @ngInject */
  function FirstControllerFn($scope, $log) {
    var vm = this;

    vm.helloDivClicked = function () {
      $log.debug('Hello Div clicked from vm!');
    };

    vm.clearTo = function () {
      $scope.to = null;
    }

    $scope.name = 'Riste';
    vm.name = 'Darko';

    $scope.helloDivClicked = function () {
      $log.debug('Hello Div clicked!');
      $log.debug('to: ', $scope.to);
    };


    $log.debug('Initializing First controller!');
    $log.debug('to: ', $scope.to);
  }

})(angular);


(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .controller('SecondController', SecondController);

  SecondController.$inject = ['$log'];

  /* @ngInject */
  function SecondController($log) {
    var vm = this;
    vm.name = 'WP';
    vm.to = 'Stojanov';
  }

})(angular);


(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('group', {
      url: '/groups',
      templateUrl: 'app/group/group.view.html',
      controller: 'GroupController',
      controllerAs: 'vm'
    });
  }

})(angular);

(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .controller('GroupController', GroupController);

  GroupController.$inject = ['$log', 'GroupService'];

  /* @ngInject */
  function GroupController($log, GroupService) {
    var vm = this;
    vm.title = 'Group';
    vm.save = save;
    vm.clear = clear;
    vm.edit = edit;
    vm.remove = remove;
    vm.entity = {};
    vm.entities = [];
    vm.saveOkMsg = null;
    vm.saveErrMsg = null;
    vm.availableSizes = [20, 40];
    loadGroups();

    function loadGroups() {
      GroupService.getAll().then(function (data) {
        vm.entities = data;
      });
    }

    function save() {
      vm.saveOkMsg = null;
      vm.saveErrMsg = null;

      var promise = GroupService.save(vm.entity);
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
      GroupService
        .remove(entity)
        .then(function () {
          loadGroups();
        });
    }
  }

})(angular);


(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .factory('GroupService', GroupServiceFn);

  GroupServiceFn.$inject = ['$log', '$timeout', '$q'];

  /* @ngInject */
  function GroupServiceFn($log, $timeout, $q) {
    var groupsList = [];
    var groupIdSequence = 0;

    var service = {
      save: saveFn,
      update: updateFn,
      getById: getByIdFn,
      getAll: getAllFn,
      remove: removeFn
    };


    return service;


    function saveFn(groupEntity) {
      var entityForSave, invalidMessage;
      var deferred = $q.defer();

      if (groupEntity.id === undefined) {
        $timeout(function () {
          entityForSave = angular.copy(groupEntity);
          invalidMessage = validateGroup(entityForSave);
          if (invalidMessage === null) {
            entityForSave.id = ++groupIdSequence;
            groupsList.push(entityForSave);
            $log.debug('saving', entityForSave);
            deferred.resolve(entityForSave);
          } else {
            $log.debug('saving invalid:', invalidMessage);
            deferred.reject({
              message: invalidMessage
            });
          }
        }, 100);
        return deferred.promise;
      } else {
        return updateFn(groupEntity);
      }
      $log.debug('in save fn');

    }

    function validateGroup(entity) {
      if (entity.name === null
        || entity.name === undefined
        || typeof entity.name !== 'string'
        || entity.name.length === 0) {
        return 'Invalid name for group';
      }
      return null;
    }

    function updateFn(groupEntity) {
      var deferred = $q.defer();
      if (groupEntity.id === undefined) {
        return saveFn(groupEntity);
      } else {
        $timeout(function () {
          getByIdFn(groupEntity.id)
            .then(function (savedEntity) {
              angular.extend(savedEntity, groupEntity);
              $log.debug("merged entity", savedEntity);
              $log.debug('updating', savedEntity);
              deferred.resolve(savedEntity);
            });

        }, 100);
        return deferred.promise;
      }
s
    }

    function getByIdFn(groupId) {
      var index;
      var deferred = $q.defer();


      $timeout(function () {
        $log.debug('get by id: ', groupId);
        index = findIndexById(groupId);
        if (index === -1) {
          deferred.resolve(null);
        } else {
          deferred.resolve(groupsList[index]);
        }
      }, 100);
      return deferred.promise;

    }

    function getAllFn() {

      var deferred = $q.defer();
      $timeout(function () {
        $log.debug('getAll');
        deferred.resolve(angular.copy(groupsList));
      }, 100);
      return deferred.promise;
    }

    function removeFn(groupEntity) {
      var deferred = $q.defer();
      $timeout(function () {
        var index = findIndexById(groupEntity.id);
        if (index !== -1) {
          groupsList.splice(index, 1);
        }
        $log.debug('remove', groupEntity);
        deferred.resolve();
      }, 100);
      return deferred.promise;

    }

    function findIndexById(groupId) {
      var result = -1, item;

      $log.debug('get index by id: ', groupId);
      for (var i = 0; i < groupsList.length; i++) {
        item = groupsList[i];
        if (item.id === groupId) {
          result = i;
          break;
        }
      }
      return result;
    }

  }

})(angular);


(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .config(registerState);

  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('students', {
      url: '/students',
      templateUrl: 'app/students/student.view.html',
      controller: 'StudentController',
      controllerAs: 'vm'
    });
  }

})(angular);

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

(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .factory('StudentService', GroupServiceFn);

  GroupServiceFn.$inject = ['$log', '$timeout', '$q'];

  /* @ngInject */
  function GroupServiceFn($log, $timeout, $q) {
    var groupsList = [];
    var groupIdSequence = 0;

    var service = {
      save: saveFn,
      update: updateFn,
      getById: getByIdFn,
      getAll: getAllFn,
      remove: removeFn
    };


    return service;


    function saveFn(groupEntity) {
      var entityForSave, invalidMessage;
      var deferred = $q.defer();

      if (groupEntity.id === undefined) {
        $timeout(function () {
          entityForSave = angular.copy(groupEntity);
          invalidMessage = validateGroup(entityForSave);
          if (invalidMessage === null) {
            entityForSave.id = ++groupIdSequence;
            groupsList.push(entityForSave);
            $log.debug('saving', entityForSave);
            deferred.resolve(entityForSave);
          } else {
            $log.debug('saving invalid:', invalidMessage);
            deferred.reject({
              message: invalidMessage
            });
          }
        }, 100);
        return deferred.promise;
      } else {
        return updateFn(groupEntity);
      }
      $log.debug('in save fn');

    }

    function validateGroup(entity) {
      if (entity.name === null
        || entity.name === undefined
        || typeof entity.name !== 'string'
        || entity.name.length === 0) {
        return 'Invalid name for group';
      }
      return null;
    }

    function updateFn(groupEntity) {
      var deferred = $q.defer();
      if (groupEntity.id === undefined) {
        return saveFn(groupEntity);
      } else {
        $timeout(function () {
          getByIdFn(groupEntity.id)
            .then(function (savedEntity) {
              angular.extend(savedEntity, groupEntity);
              $log.debug("merged entity", savedEntity);
              $log.debug('updating', savedEntity);
              deferred.resolve(savedEntity);
            });

        }, 100);
        return deferred.promise;
      }

    }

    function getByIdFn(groupId) {
      var index;
      var deferred = $q.defer();


      $timeout(function () {
        $log.debug('get by id: ', groupId);
        index = findIndexById(groupId);
        if (index === -1) {
          deferred.resolve(null);
        } else {
          deferred.resolve(groupsList[index]);
        }
      }, 100);
      return deferred.promise;

    }

    function getAllFn() {

      var deferred = $q.defer();
      $timeout(function () {
        $log.debug('getAll');
        deferred.resolve(angular.copy(groupsList));
      }, 100);
      return deferred.promise;
    }

    function removeFn(groupEntity) {
      var deferred = $q.defer();
      $timeout(function () {
        var index = findIndexById(groupEntity.id);
        if (index !== -1) {
          groupsList.splice(index, 1);
        }
        $log.debug('remove', groupEntity);
        deferred.resolve();
      }, 100);
      return deferred.promise;

    }

    function findIndexById(groupId) {
      var result = -1, item;

      $log.debug('get index by id: ', groupId);
      for (var i = 0; i < groupsList.length; i++) {
        item = groupsList[i];
        if (item.id === groupId) {
          result = i;
          break;
        }
      }
      return result;
    }

  }

})(angular);

/**
 * Created by 141523 on 10/18/2016.
 */

(function (angular) {
  'use strict';

  angular
    .module('wp-angular-starter')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('defaultPage', {
      url: '/',
      templateUrl: 'app/default-page/default-page.view.html'
    });
  }

})(angular);
