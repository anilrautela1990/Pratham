app.controller("home", function($scope,$http) {
	$scope.title = "Pratham - Pre Login";
});
app.controller("firmRegister", function($scope,$http,$state,$cookieStore) {
    $scope.registerFirm = function(formObj,formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {   
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SaveComp",
                ContentType: 'application/json',
                data: {
				  "comp_address" : formObj.firmAddress,
				  "comp_appurl" :formObj.firmAppURL,
				  "comp_branchid": parseInt(formObj.firmBranch),
				  "comp_emailid" :formObj.firmEmailId,
				  "comp_landline":formObj.firmLandline,
				  "comp_logopath" :formObj.firmLogo,
				  "comp_mobile":formObj.firmMobile,
				  "comp_name":formObj.firmName,
				  "comp_pan" :formObj.firmPAN,
				  "comp_servicetax" :formObj.firmServiceTaxNumber,
				  "comp_tin" :formObj.firmTIN,
				  "comp_type":formObj.firmType,
				  "comp_vat" :formObj.firmVATDetails,
				  "comp_websiteurl" :formObj.firmWebsiteURL
				}
            }).success(function(data) {
				console.log(data);
                alert("Your Company Data Saved");
                $cookieStore.put('comp_guid',data.comp_guid);
                $state.go('/AdminCreation');
			}).error(function() {});
       }
    }
});
app.controller("adminCreation", function($scope,$http,$state,$cookieStore) {
    $scope.createAdminUser = function(formObj, formName){
        alert($cookieStore.get('comp_guid'));
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
				ContentType: 'application/json',
                data:{
                  "user_type":1,  
                  "user_comp_guid":$cookieStore.get('comp_guid'),
                  "user_first_name": formObj.adminFirstName,
                  "user_middle_name": formObj.adminMiddleName,
                  "user_last_name": formObj.adminLastName,
                  "user_mobile_no":formObj.adminMobileNo,
                  "user_email_address": formObj.adminEmailId,
                  "user_password": formObj.password
                }
            }).success(function(data) {
				console.log(data);
                alert("Admin User Created");
                $state.go('/Login');
			}).error(function() {});
        }
    };
});
app.controller("login", function($scope,$http,$cookieStore,$window) {
    $scope.login = function(formObj, formName){
        $scope.submit = true;
        if ($scope[formName].$valid) {
			angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UserLogin",
				ContentType: 'application/json',
                data: {	
                      "user_comp_guid":"d0cb84c5-6b52-4dff-beb5-50b2f4af5398",
                      "user_email_address": formObj.emailId,
                      "user_password": formObj.password
				}
            }).success(function(data) {
				console.log(data);
				if(data.user_id == 0){
                    alert("User Does Not Exist!");
                }
                else{
					$cookieStore.put('comp_guid','d0cb84c5-6b52-4dff-beb5-50b2f4af5398');
                    $cookieStore.put('user_id', data.user_id);
                    $window.location.href = '/home.html';
                }
				angular.element(".loader").hide();
			}).error(function() {});
        }
    };
    
    $scope.enterLogin = function(keyEvent, formObj, formName){
        if (keyEvent.which === 13){
            $scope.login(formObj, formName);
        }
    };
});
/* After Login*/
app.controller("mainCtrl", function($scope,$http,$cookieStore,$state,$window) {
	$scope.title = "Pratham :: Home";
    ($scope.checkLogin = function(){
        var userId = $cookieStore.get('user_id');
        var compGuid = $cookieStore.get('comp_guid');
        if(userId == undefined || compGuid == undefined){
            $window.location.href = '/';
        }
    })();
    $scope.logout = function(){
       $cookieStore.remove('user_id');
       $cookieStore.remove('comp_guid');
       $window.location.href = '/';
    };
});

app.controller("dashboard", function($scope,$http,$cookieStore) {
    $scope.title = "Pratham :: Home";
});

app.controller("leads", function($scope,$http,$cookieStore,$uibModal) {
	 ($scope.getLeads = function(){
		 angular.element(".loader").show();
         $http({
            method: "POST",
                url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
				ContentType: 'application/json',
                data: {	
                      "user_comp_guid":$cookieStore.get('comp_guid'),
                      "user_type":3
				}
            }).success(function(data) {
				console.log(data);
			 	angular.element(".loader").hide();
             $scope.leads = data;
			}).error(function() {
			 angular.element(".loader").hide();
		 });
     })();
    
    $scope.leadDetail = function(selectedItem){
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'leadDetail',
			size:'lg',
			backdrop:'static',
            resolve: {
              item: function () {
                return $scope.leads[selectedItem];;
              }
            }
       });
    };
    
	$scope.viewLeadStatus = function(leadNo){
		alert("View Lead Status: "+leadNo);
	};
	$scope.editLead = function(leadNo){
		alert("Edit Lead: "+leadNo);
	};
});
app.controller("leadDetail", function($scope,$uibModalInstance,item) {
    $scope.lead = item;
    $scope.ok = function(){
        $uibModalInstance.close();
    }
    if($scope.lead.projectlst!=null){
        $scope.leadProjects = [];
        for(i=0;i<$scope.lead.projectlst.length;i++){
            for(j=0;j<$scope.lead.projectlst[i].Lstphases.length;j++){
                for(k=0;k<$scope.lead.projectlst[i].Lstphases[j].LstofBlocks.length;k++){
                    for(l=0;l<$scope.lead.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls.length;l++){
                        $scope.leadUnitObj = {};                        
                        $scope.leadUnitObj.projName = $scope.lead.projectlst[i].Proj_Name;
                        $scope.leadUnitObj.phaseName = $scope.lead.projectlst[i].Lstphases[j].Phase_Name;
                        $scope.leadUnitObj.phaseType = $scope.lead.projectlst[i].Lstphases[j].Phase_UnitType.UnitType_Name;
                        $scope.leadUnitObj.blockName = $scope.lead.projectlst[i].Lstphases[j].LstofBlocks[k].Blocks_Name;
                        $scope.leadUnitObj.unitObj = $scope.lead.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls[l];
                        $scope.leadProjects.push($scope.leadUnitObj);
                    }
                    
                }
                
            }

        }
        console.log(JSON.stringify($scope.leadProjects));
    }
    
});

app.controller("addLead", function($scope,$http,$state,$cookieStore) {
	$scope.addLead = function(formObj,formName){
		$scope.submit = true;
        if ($scope[formName].$valid) {
			$http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                  "user_comp_guid":$cookieStore.get('comp_guid'),
				  "user_type": 3,
				  "user_first_name" : formObj.firstName,
				  "user_middle_name" :formObj.middleName,
				  "user_last_name": formObj.lastName,
				  "user_mobile_no" :formObj.mobileNumber,
				  "user_office_no": formObj.officeNumber,
				  "user_email_address":formObj.emailId,
				  "user_country":formObj.country,
				  "user_city": parseInt(formObj.city),
  				  "user_state": parseInt(formObj.state),
				  "user_address":formObj.address,
				  "user_zipcode": formObj.zip,
				  "user_dob" :formObj.dob,
				  "user_gender" :parseInt(formObj.gender),
				}
            }).success(function(data) {
				console.log(data);
				if(data.user_id != 0){
                $cookieStore.put('lead_id',data.user_id);
                $state.go("/ProjectDetails");
				}
				else{
					alert("Some Error!");
				}
			}).error(function() {});
		}
	}
});
app.controller("projectDetails", function($scope,$http,$state,$cookieStore,$compile) {
	if($cookieStore.get('lead_id') == undefined){
		$state.go('/AddLead');
	}
	$scope.flatStatus = ['vacant','userinterest','mgmtquota','blockedbyadvnc','blockedbynotadvnc','sold'];
    $scope.flatStatusText = ['Vacant','User Interested','Management Quota','Blocked By Paying Advance','Blocked By Not Paying Advance','Sold'];
    ($scope.getProjectList = function(){
            $scope.units = [];
			angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
                ContentType: 'application/json',
                data: {
                  "Proj_comp_guid":$cookieStore.get('comp_guid')
				}
            }).success(function(data) {
				console.log(data);
				$scope.projectList = data;
				angular.element(".loader").hide();
			}).error(function() {
				angular.element(".loader").hide();
			});
    })();
	
	$scope.getPhaseList = function(projectName){
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
		angular.element(".loader").show();
			$http({
				method: "POST",
                url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
                ContentType: 'application/json',
                data: {
				  "Phase_Proj_Id":projectName,
                  "Phase_comp_guid":$cookieStore.get('comp_guid')
				}
            }).success(function(data) {
				console.log(data);
				$scope.phaseList = data;
				angular.element(".loader").hide();
			}).error(function() {
				angular.element(".loader").hide();
			});
	};
	$scope.getBlockList = function(phase,projectName){
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for(i=0;i<$scope.phaseList.length;i++){
            if($scope.phaseList[i].Phase_Id == phase)
                {
                    $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
                }
        }
		angular.element(".loader").show();
			$http({
				method: "POST",
                url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
                ContentType: 'application/json',
                data: {
				  "Phase_Proj_Id":projectName,
				  "Blocks_Phase_Id":phase
				}
            }).success(function(data) {
				console.log(data);
				$scope.blockList = data;
				angular.element(".loader").hide();
			}).error(function() {
				angular.element(".loader").hide();
			});
	};
	$scope.getUnits = function(blocks){
        $scope.units = [];
		angular.element(".loader").show();
			$http({
				method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
                ContentType: 'application/json',
                data: {
				  "UnitDtls_Block_Id":blocks,
				  "UnitDtls_comp_guid":$cookieStore.get('comp_guid')
				}
            }).success(function(data) {
				console.log(JSON.stringify(data));
				$scope.units = data;
				angular.element(".loader").hide();
			}).error(function() {
				angular.element(".loader").hide();
			});
	};
	$scope.selectUnit = function(unitId,projectDetails){
        for(i=0;i<$scope.units.length;i++){
           if($scope.units[i].UnitDtls_Id == unitId){
               if($scope.units[i].UnitDtls_Status == 1){
                if($("#unit"+$scope.units[i].UnitDtls_Id).hasClass('selected')){
                    $("tr#"+$scope.units[i].UnitDtls_Id).remove();
                }
                else{
                    var projObj = {};
                    projObj.ProjId = $scope.projectDetails.projectName;
                    projObj.Phase_Id = $scope.projectDetails.phase;
                    projObj.Blocks_Id = $scope.projectDetails.blocks;
                    projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                    projObj = JSON.stringify(projObj);
                    console.log(projObj);
                    
                    var projectRow = '<tr id="'+$scope.units[i].UnitDtls_Id+'"><td><div class="dispNone">'+projObj+'</div>'+$scope.units[i].UnitDtls_BRoom+'BHK - '+$scope.units[i].UnitDtls_No+' - '+$scope.units[i].UnitDtls_Floor+' Floor</td><td>'+$scope.units[i].UnitDtls_Msrmnt+' sq ft</td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow('+$scope.units[i].UnitDtls_Id+')"></span></td></tr>';
                    var projectRowComplied = $compile(projectRow)($scope);
                    angular.element(document.getElementById('projectList')).append(projectRowComplied);
                }
			 $("#unit"+$scope.units[i].UnitDtls_Id).toggleClass('selected');
            }
            else{
                alert($scope.flatStatus[$scope.units[i].UnitDtls_Status-1]);
            }
           }
        }
	};
	$scope.deleteRow = function(rowId){
		$("tr#"+rowId).remove();
		$("#unit"+rowId).removeClass('selected');
	};
	$scope.saveLead = function(projectObj){
        var projJson = [];
		$(".dispNone").each(function(index){
			console.log( index + ": " + $( this ).text() );
            var projObj = $( this ).text();
            projObj = angular.fromJson(projObj);
			projJson.push(projObj);
		});
        console.log(projJson);
		angular.element(".loader").show();
			$http({
				method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
				  "user_id":$cookieStore.get('lead_id'),
				  "user_proj":{
					  "UserProj_comp_guid":$cookieStore.get('comp_guid'),
					  "UserProj_user_id":$cookieStore.get('lead_id'),
					  "prjjson":projJson
					}
				}
            }).success(function(data) {
				if(data.user_id!=null){
					$cookieStore.remove('lead_id');
					$state.go('/Leads');
					angular.element(".loader").hide();
				}
                console.log(JSON.stringify(data));
			}).error(function() {
				angular.element(".loader").hide();
			});
	};
});
app.controller("convertCustomer", function($scope,$http,$compile) {
	$scope.customer = {
		firstName :"Ashish",
		middleName :"Bansal",
		lastName :"Agrawal",
		mobileNumber:"8800399717",
		officeNumber: "011345678",
		emailId: "ashishagrawal89@gmail.com",
		dob: "24-12-1988",
		gender:0,
		country:"india",
		state:"2",
		city:"3",
		address:"N-33, Laxmi Nagar",
		zip:"110092",
		leadSouce:"email",
        "bankloan":0,
        "gpaHolder":0
	};
	$scope.addCustomer = function(formObj, formName){
		var formData = JSON.stringify(formObj);
		console.log(formData);
		console.log(Object.keys(formObj).length);
	};
	$scope.appendFields = function(){
		angular.element("#children").html('');
		for(i=1;i<=$scope.customer.childrenNo;i++){
			var childDiv = '<div><input type="text" placeholder="Child '+i+' Name" title="Child '+i+' Name" class="form-control" name="child'+i+'Name" ng-model="customer.child'+i+'Name" /></div><div><input type="text" placeholder="Child '+i+' D.O.B." title="Child '+i+' D.O.B." class="form-control" name="child'+i+'Dob" ng-model="customer.child'+i+'Dob"/></div>';
			var childDivComplied = $compile(childDiv)($scope);
			angular.element("#children").append(childDivComplied);
			
		}
	};
});