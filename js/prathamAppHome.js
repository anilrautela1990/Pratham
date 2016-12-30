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
		url: '/ConvertCustomer',
		templateUrl: 'partials/convertCustomer.html',
		controller: 'convertCustomer'
	})
});
app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
