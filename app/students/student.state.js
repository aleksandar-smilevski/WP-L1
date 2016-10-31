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
