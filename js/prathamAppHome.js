var app = angular.module("pratham", ['ui.router', 'ui.bootstrap', 'ngCookies']);
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'partials/dashboard.html',
            controller: 'dashboard'
        })
        .state('/Leads', {
            url: '/Leads',
            templateUrl: 'partials/leads.html',
            controller: 'leads'
        })
        .state('/AddLead', {
            url: '/AddLead',
            templateUrl: 'partials/addLead.html',
            controller: 'addLead'
        })
        .state('/Customers', {
            url: '/Customers',
            templateUrl: 'partials/customers.html',
            controller: 'customerController'
        })
        .state('/EditLead', {
            url: '/EditLead/:leadID',
            templateUrl: 'partials/addLead.html',
            controller: 'editLead'
        })
        .state('/ProjectDetails', {
            url: '/ProjectDetails/:leadID',
            templateUrl: 'partials/projectDetails.html',
            controller: 'projectDetails'
        })
        .state('/ConvertCustomer', {
            url: '/ConvertCustomer/:action/:leadID',
            templateUrl: 'partials/convertCustomer.html',
            controller: 'convertCustomer'
        })
        .state('/AddAgent', {
            url: '/AddAgent',
            templateUrl: 'partials/addAgent.html',
            controller: 'addAgentController'
        })
        .state('/Agents', {
            url: '/Agents',
            templateUrl: 'partials/agents.html',
            controller: 'agentsController'
        })
        .state('/EditAgent', {
            url: '/EditAgent/:agentID',
            templateUrl: 'partials/addAgent.html',
            controller: 'editAgentController'
        })
        .state('/UnitAllocation', {
            url: '/UnitAllocation',
            templateUrl: 'partials/unitAllocation.html',
            controller: 'unitAllocation'
        })
        .state('/Projects', {
            url: '/Projects',
            templateUrl: 'partials/projects.html',
            controller: 'projects'
        })
        .state('/AddProject', {
            url: '/AddProject',
            templateUrl: 'partials/addProject.html',
            controller: 'addProject'
        })
        .state('/EditProject', {
            url: '/EditProject/:projId',
            templateUrl: 'partials/addProject.html',
            controller: 'editProject'
        })
        .state('/Phases', {
            url: '/Phases',
            templateUrl: 'partials/phases.html',
            controller: 'phases'
        })
        .state('/AccessRights', {
            url: '/AccessRights',
            templateUrl: 'partials/AccessRights.html',
            controller: 'AccessRights'
        })
        .state('/AddPhases', {
            url: '/AddPhases/:projId',
            templateUrl: 'partials/addPhases.html',
            controller: 'addPhases'
        })
        .state('/EditPhases', {
            url: '/EditPhases/:projId/:phaseId',
            templateUrl: 'partials/addPhases.html',
            controller: 'editPhases'
        })
        .state('/AddUnit', {
            url: '/AddUnit/:projId/:phaseId',
            templateUrl: 'partials/addUnit.html',
            controller: 'addUnit'
        })
        .state('/EditUnit', {
            url: '/EditUnit/:projId/:phaseId',
            templateUrl: 'partials/addUnit.html',
            controller: 'editUnit'
        })
        .state('/UnitGeneration', {
            url: '/UnitGeneration/:projId/:phaseId',
            templateUrl: 'partials/unitGeneration.html',
            controller: 'unitGeneration'
        })
        .state('/Units', {
            url: '/Units/:projId/:phaseId/:blockId',
            templateUrl: 'partials/units.html',
            controller: 'units'
        })
		.state('/CostSheetTemplate', {
            url: '/CostSheetTemplate',
            templateUrl: 'partials/costSheetTemplate.html',
            controller: 'costSheetTemplate'
        })
        .state('/CostSheetTemplates', {
            url: '/CostSheetTemplates',
            templateUrl: 'partials/CostSheetTemplates.html',
            controller: 'costSheetTemplates'
        })
        .state('/BlockStage', {
            url: '/BlockStage',
            templateUrl: 'partials/BlockStage.html',
            controller: 'blockStageController'
        })
        .state('/PaymentSchedule', {
            url: '/PaymentSchedule',
            templateUrl: 'partials/paymentSchedule.html',
            controller: 'paymentScheduleController'
        })
        .state('/EmployeeDetails', {
            url: '/EmployeeDetails',
            templateUrl: 'partials/employeeDetails.html',
            controller: 'employeeDetailsController'
        })
        .state('/AddEmployee', {
            url: '/AddEmployee',
            templateUrl: 'partials/addEmployee.html',
            controller: 'addEmployeeController'
        })
        .state('/EditEmployee', {
            url: '/EditEmployee/:employeeId',
            templateUrl: 'partials/addEmployee.html',
            controller: 'editEmployeeController'
        })
       .state('/Heirarchy', {
            url: '/Heirarchy',
            templateUrl: 'partials/Heirarchy.html',
            controller: 'heirarchyController'
        })
        .state('/SalaryHeadDetails', {
            url: '/SalaryHeadDetails',
            templateUrl: 'partials/salaryHeadDetails.html',
            controller: 'salaryHeadDetailsController'
        })
        .state('/AddSalaryHead', {
            url: '/AddSalaryHead',
            templateUrl: 'partials/addSalaryHead.html',
            controller: 'addSalaryHeadController'
        })
        .state('/EditSalaryHead', {
            url: '/EditSalaryHead/:salaryHeadId',
            templateUrl: 'partials/addSalaryHead.html',
            controller: 'editSalaryHeadController'
        })
});
app.config(function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.service('myService', function($http) {
    this.sampleFun = function(compId) {
        return compId;
    };

    this.getProjectList = function(compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": compId
            }
        }).success(function(data) {
            projectList = data;
            return projectList;
        }).error(function() {});
        return promise;
    };

    this.getPhaseList = function(compId,projectName) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": compId
            }
        }).success(function(data) {
            phaseList = data;
            return phaseList;
        }).error(function() {});
        return promise;
    };
    
    this.getBlockList = function(phase, compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": compId
            }
        }).success(function(data) {
            blockList = data;
            return blockList;
        }).error(function() {});
        return promise;
    };
    
    this.getUnitsByBlock = function(compId, blockId) {
        console.log("blockId: "+blockId);
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                  "UnitDtls_Block_Id":blockId,
                  "UnitDtls_comp_guid":compId
                }
        }).success(function(data) {
            units = data;
            return units;
        }).error(function() {});
        return promise;
    };
});