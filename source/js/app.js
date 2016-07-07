var app = angular.module('gospoort', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    var resolveCoaches = {
        coaches: ['REST', function(REST) {
            return REST.GET();
        }]
    };

    $routeProvider
        .when('/', {
            controller: 'CoachListController as coachList',
            templateUrl: 'views/list.html',
            resolve: resolveCoaches
        })
        .when('/details/:coachId', {
            controller: 'CoachDetailsController as coachDetails',
            templateUrl: 'views/details.html',
            resolve: resolveCoaches
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.service('REST', ['$http', function($http) {
    // Here we a GET method accepting the paramters "location" and "type" could easily be done
    this.GET = function() {
        return $http({
            method: 'GET',
            url: '/data/source.json'
        }).then(
            function successCallback(response) {
                return response.data;
            },
            function errorCallback(response) {
                return response;
            }
        );
    };
}]);

app.controller('CoachListController', ['coaches', function(coaches) {
    var coachList = this;
    coachList.coaches = coaches
    coachList.coachesFiltered = coaches;
    coachList.disciplines = [];
    coachList.disciplinesFiltered = [];
    coachList.locations = [];
    coachList.locationsFiltered = [];

    angular.forEach(coaches, function(coach, key) {
        angular.forEach(coach.discipline, function(val, key) {
            if (coachList.disciplines.indexOf(val) == -1) {
                coachList.disciplines.push(val);
            }
        });

        if (coach.location != undefined && coachList.locations.indexOf(coach.location) == -1) {
            coachList.locations.push(coach.location);
        }
    });

    coachList.remaining = function() {
        return coachList.coachesFiltered.length;
    };

    coachList.toggleFilter = function(filter, list) {
        if (list.length > 0 && list.indexOf(filter) > -1) {
            list.splice(list.indexOf(filter), 1);
        } else {
            list.push(filter);
        }
        coachList.disciplinesFilter();
    };

    coachList.disciplinesFilter = function() {
        coachList.coachesFiltered = [];
        angular.forEach(coachList.coaches, function(coach, key) {
            var showCoach = true;
            if (coachList.disciplinesFiltered.length !== 0 || coachList.locationsFiltered.length !== 0) {
                angular.forEach(coachList.disciplinesFiltered, function(item, key) {
                    if (coach.discipline.indexOf(item) === -1) {
                        showCoach = false;
                    }
                });
                angular.forEach(coachList.locationsFiltered, function(item, key) {
                    if (coach.location == undefined || coach.location.indexOf(item) === -1) {
                        showCoach = false;
                    }
                });
                if (showCoach) {
                    coachList.coachesFiltered.push(coach);
                }
            } else {
                coachList.coachesFiltered = coachList.coaches;
            }
        });
    };
}]);

app.controller('CoachDetailsController', ['$location', '$routeParams', 'coaches', function($location, $routeParams, coaches) {
    var coachDetails = this;
    var coachGuid = $routeParams.coachId;

    coachDetails.coaches = coaches;
    coachDetails.coach = {};

    angular.forEach(coaches, function(coach, key) {
        if (coach.guid === coachGuid) {
            coachDetails.coach = coach;
        }
    });
}]);
