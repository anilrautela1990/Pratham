var app = angular.module("pratham",['ui.router','ui.bootstrap','ngCookies']);
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
		url: '/ConvertCustomer/:leadID',
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
    .state('/AddPhases', {
		url: '/AddPhases/:projectID',
		templateUrl: 'partials/addPhases.html',
		controller: 'addPhases'
	})
});
app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
