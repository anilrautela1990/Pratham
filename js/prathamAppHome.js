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
	.state('/Agents', {
		url: '/Agents',
		templateUrl: 'partials/agents.html',
		controller: 'agents'
	})
	.state('/UnitAllocation', {
		url: '/UnitAllocation',
		templateUrl: 'partials/unitAllocation.html',
		controller: 'unitAllocation'
	})
});
app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
