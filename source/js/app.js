var app = angular.module('gospoort', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    let resolveCoaches = {
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
    // Here a GET method accepting the paramters "location" and "type" could easily be done
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
    let coachList = this;
    coachList.coaches = coaches
    coachList.coachesFiltered = coaches;
    coachList.disciplines = [];
    coachList.disciplinesFiltered = [];
    coachList.locations = [];
    coachList.locationsFiltered = [];

    coachList.coaches.foreach(coach => {
        coach.discipline.foreach(discipline => {
            if (coach.discipline != undefined && coachList.disciplines.indexOf(discipline) == -1) {
                coachList.disciplines.push(discipline);
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
        coachList.coachesFiltered = []; // Empty list of filtered coaches
        coachList.coaches.map(coach => {
            let showCoach = true;
            if (coachList.disciplinesFiltered.length > 0 || coachList.locationsFiltered.length > 0) {
                coachList.disciplinesFiltered.foreach(discipline => {
                    if (coach.discipline == undefined || coach.discipline.indexOf(discipline) === -1) {
                        showCoach = false;
                    }
                });
                coachList.locationsFiltered.foreach(location => {
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
    let coachDetails = this;
    const coachGuid = $routeParams.coachId;

    coachDetails.coaches = coaches;
    coachDetails.coach = {};

    coaches.foreach(coach => {
        if (coach.guid === coachGuid) {
            return coachDetails.coach = coach;
        }
    });
}]);
