app.controller("home", function($scope, $http) {
    $scope.title = "Pratham - Pre Login";
    $scope.clientCss = "prathamClient";
});
app.controller("firmRegister", function($scope, $http, $state, $cookieStore) {
    $scope.registerFirm = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SaveComp",
                ContentType: 'application/json',
                data: {
                    "comp_address": formObj.firmAddress,
                    "comp_appurl": formObj.firmAppURL,
                    "comp_branchid": parseInt(formObj.firmBranch),
                    "comp_emailid": formObj.firmEmailId,
                    "comp_landline": formObj.firmLandline,
                    "comp_logopath": formObj.firmLogo,
                    "comp_mobile": formObj.firmMobile,
                    "comp_name": formObj.firmName,
                    "comp_pan": formObj.firmPAN,
                    "comp_servicetax": formObj.firmServiceTaxNumber,
                    "comp_tin": formObj.firmTIN,
                    "comp_type": formObj.firmType,
                    "comp_vat": formObj.firmVATDetails,
                    "comp_websiteurl": formObj.firmWebsiteURL
                }
            }).success(function(data) {
                //console.log(data);
                alert("Your Company Data Saved");
                $cookieStore.put('comp_guid', data.comp_guid);
                $state.go('/AdminCreation');
            }).error(function() {});
        }
    }
});
app.controller("adminCreation", function($scope, $http, $state, $cookieStore) {
    $scope.createAdminUser = function(formObj, formName) {
        alert($cookieStore.get('comp_guid'));
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_type": 1,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_first_name": formObj.adminFirstName,
                    "user_middle_name": formObj.adminMiddleName,
                    "user_last_name": formObj.adminLastName,
                    "user_mobile_no": formObj.adminMobileNo,
                    "user_email_address": formObj.adminEmailId,
                    "user_password": formObj.password
                }
            }).success(function(data) {
                //console.log(data);
                alert("Admin User Created");
                $state.go('/Login');
            }).error(function() {});
        }
    };
});
app.controller("login", function($scope, $http, $cookieStore, $window) {
    $scope.login = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UserLogin",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": "d0cb84c5-6b52-4dff-beb5-50b2f4af5398",
                    "user_email_address": formObj.emailId,
                    "user_password": formObj.password
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id == 0) {
                    alert("User Does Not Exist!");
                } else {
                    $cookieStore.put('comp_guid', 'd0cb84c5-6b52-4dff-beb5-50b2f4af5398');
                    $cookieStore.put('user_id', data.user_id);
                    $window.location.href = '/home.html';
                }
                angular.element(".loader").hide();
            }).error(function() {});
        }
    };

    $scope.enterLogin = function(keyEvent, formObj, formName) {
        if (keyEvent.which === 13) {
            $scope.login(formObj, formName);
        }
    };
});
/* After Login*/
app.controller("mainCtrl", function($scope, $http, $cookieStore, $state, $window) {
    $scope.title = "Pratham :: Home";
    $scope.clientCss = "prathamClient";
    ($scope.checkLogin = function() {
        var userId = $cookieStore.get('user_id');
        var compGuid = $cookieStore.get('comp_guid');
        if (userId == undefined || compGuid == undefined) {
            $window.location.href = '/';
        }
    })();
    $scope.logout = function() {
        $cookieStore.remove('user_id');
        $cookieStore.remove('comp_guid');
        $window.location.href = '/';
    };
});

app.controller("dashboard", function($scope, $http, $cookieStore) {
    $scope.title = "Pratham :: Home";
});

app.controller("leads", function($scope, $http, $cookieStore, $uibModal, $state) {
    $scope.searchLead = ''; // set the default search/filter term
    ($scope.getLeads = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 3
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            $scope.leads = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.leadDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'leadDetail',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.leads[selectedItem];
                }
            }
        });
    };

    $scope.viewLeadStatus = function(leadNo) {
        alert("View Lead Status: " + leadNo);
    };
});
app.controller("leadDetail", function($scope, $uibModalInstance, $state, item) {
    $scope.states = ["Delhi"];
    $scope.cities = ["New Delhi"];
    $scope.lead = item;
    if ($scope.lead.userprojlist != null) {
        $scope.leadProjects = $scope.lead.userprojlist;
    }

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.deleteRow = function(rowId) {
        angular.element("tr#" + rowId).remove();
    };

    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID": leadId
        });
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});

app.controller("addLead", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Add Lead";
    $scope.addLeadBtn = true;
    $scope.addLead = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_type": 3,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": formObj.dob,
                    "user_gender": parseInt(formObj.gender),
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id != 0) {
                    //$cookieStore.put('lead_id', data.user_id);
                    $state.go("/ProjectDetails", {
                        "leadID": data.user_id
                    });
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});

app.controller("editLead", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Lead";
    $scope.editLeadBtn = true;
    ($scope.getLeadDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            var state = data.user_state;
            var city = data.user_city;
            var dob = $filter('date')(data.user_dob, 'MMM dd, yyyy');

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }
            if (dob == "Jan 01, 0001") {
                dob = "";
            }
            if (data.user_id != 0) {
                $scope.addLead = {
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    mobileNumber: data.user_mobile_no,
                    emailId: data.user_email_address,
                    dob: dob,
                    gender: data.user_gender,
                    country: data.user_country,
                    state: state + "",
                    city: city + "",
                    address: data.user_address,
                    zip: data.user_zipcode
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.updateLead = function(formObj, formName) {
        //console.log(formObj);
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_id": $scope.leadId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": formObj.dob,
                    "user_gender": parseInt(formObj.gender),
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id != 0) {
                    //$cookieStore.put('lead_id', data.user_id);
                    $state.go("/Leads");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});
app.controller("projectDetails", function($scope, $http, $state, $cookieStore, $compile, $stateParams, $window, myService) {
    $scope.leadId = $stateParams.leadID;
    if ($scope.leadId == undefined) {
        $state.go('/AddLead');
    }
    ($scope.getLeadProjects = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            if (data.user_id != 0) {
                if (data.userprojlist != null) {
                    $scope.leadProjects = data.userprojlist;
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.flatStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.flatStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];

    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    $scope.phaseListFun = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.getUnits = function(blocks) {
        $scope.units = [];
        $scope.perFloorUnits = [];
        if (blocks == "") {
            return;
        }
        /*for (i = 0; i < $scope.blockList.length; i++) {
            if ($scope.blockList[i].Blocks_Id == blocks) {
                $scope.blockFloors = $scope.blockList[i].Blocks_Floors;
                $scope.blockFloorUnits = $scope.blockList[i].Blocks_UnitPerfloor;
            }
        }*/
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Block_Id": blocks,
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));

            $scope.blockFloors = data[1].Blocks_Floors;
            $scope.blockFloorUnits = data[1].Blocks_UnitPerfloor;

            var dataOfUnits = data[0];

            console.log($scope.blockFloors + " - " + $scope.blockFloorUnits);

            $scope.selectedUnits = [];
            $(".dispNone").each(function(index) {
                var projObj = $(this).text();
                projObj = angular.fromJson(projObj);
                $scope.selectedUnits.push(projObj.UnitDtls_Id);
            });

            for (i = 0; i < dataOfUnits.length; i++) {
                for (j = 0; j < $scope.selectedUnits.length; j++) {
                    if (dataOfUnits[i].UnitDtls_Id == $scope.selectedUnits[j]) {
                        dataOfUnits[i].markUp = "selected";
                        break;
                    }
                }
            }
            var count = 0;
            for (k = 0; k < $scope.blockFloors; k++) {
                var floorUnits = [];
                for (l = 0; l < $scope.blockFloorUnits; l++) {
                    floorUnits.push(dataOfUnits[count]);
                    count++;
                }
                $scope.perFloorUnits.push(floorUnits);
            }
            $scope.units = dataOfUnits;
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.markUnits = function() {
        alert($scope.selectedUnits);
    };
    $scope.selectUnit = function(unitId, projectDetails) {
        for (i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].UnitDtls_Id == unitId) {
                if ($scope.units[i].UnitDtls_Status == 1 || $scope.units[i].UnitDtls_Status == 2) {
                    if ($("#unit" + $scope.units[i].UnitDtls_Id).hasClass('selected')) {
                        $scope.deleteRow($scope.projectDetails.projectName, $scope.units[i].UnitDtls_Id);
                    } else {
                        var projObj = {};
                        projObj.ProjId = parseInt($scope.projectDetails.projectName);
                        projObj.Phase_Id = parseInt($scope.projectDetails.phase);
                        projObj.Blocks_Id = parseInt($scope.projectDetails.blocks);
                        projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                        projObj = JSON.stringify(projObj);

                        //                      console.log($scope.projectDetails);

                        var projectRow = '<tr id="' + $scope.units[i].UnitDtls_Id + '"><td>' + $scope.projectDetails.projectName + '</td><td>' + $scope.projectDetails.phase + '</td><td>' + 'Flat Type' + '</td><td><div class="dispNone">' + projObj + '</div>' + $scope.units[i].UnitDtls_BRoom + 'BHK - ' + $scope.units[i].UnitDtls_No + ' - ' + $scope.units[i].UnitDtls_Floor + ' Floor</td><td>' + $scope.units[i].UnitDtls_Msrmnt + ' sq ft</td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow(' + projectDetails.projectName + ',' + $scope.units[i].UnitDtls_Id + ')"></span></td></tr>';
                        var projectRowComplied = $compile(projectRow)($scope);
                        angular.element(document.getElementById('projectList')).append(projectRowComplied);
                    }
                    $("#unit" + $scope.units[i].UnitDtls_Id).addClass('selected');
                } else {
                    alert($scope.flatStatusText[$scope.units[i].UnitDtls_Status - 1]);
                }
            }
        }
    };
    $scope.deleteRow = function(projId, rowId) {
        var deleteUser = $window.confirm('Are you sure you want to delete ?');

        if (deleteUser) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/ProjUnitDel",
                ContentType: 'application/json',
                data: [{
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "ProjDtl_Id": projId
                }]
            }).success(function(data) {
                if (data.Comm_ErrorDesc == '0|0') {
                    $("tr#" + rowId).remove();
                    $("#unit" + rowId).removeClass('selected');
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    $scope.saveLead = function(projectObj) {
        var projJson = [];
        $(".dispNone").each(function(index) {
            //console.log(index + ": " + $(this).text());
            var projObj = $(this).text();
            projObj = angular.fromJson(projObj);
            projObj.comp_guid = $cookieStore.get('comp_guid');
            projObj.Projusrid = $scope.leadId;
            projObj.ProjDtl_Status = 2;
            projJson.push(projObj);
        });
        //console.log(projJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitSave",
            ContentType: 'application/json',
            data: projJson
        }).success(function(data) {
            angular.element(".loader").hide();
            if (data.Comm_ErrorDesc == '0|0') {
                $cookieStore.remove('lead_id');
                $state.go('/Leads');
                angular.element(".loader").hide();
            } else {
                alert('Something went wrong.');
            }
            //console.log(JSON.stringify(data));
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});
app.controller("convertCustomer", function($scope, $http, $compile, $cookieStore, $stateParams, $filter, $state) {
    ($scope.convertCustomer = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $scope.action = $stateParams.action;

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            var dateArray = [];
            dateArray.push($filter('date')(data.user_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_spouse_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_wedanv, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_gpa_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child1_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child2_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child3_dob, 'MMM dd, yyyy'));
            dateArray.push($filter('date')(data.Cust_child4_dob, 'MMM dd, yyyy'));

            for (var i = 0; i < dateArray.length; i++) {
                if (dateArray[i] == "Jan 01, 0001") {
                    dateArray[i] = "";
                }
            }

            var state = data.user_state;
            var city = data.user_city;

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }

            if (data.user_id != 0) {
                if ($scope.action == 'addCustomer') {
                    $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dateArray[0],
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0
                    }
                } else if ($scope.action == 'editCustomer') {
                    $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dateArray[0],
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0,
                        relationType: data.Cust_relationtype + "",
                        relationName: data.Cust_relationname,
                        residentType: data.Cust_status_type + "",
                        address2: data.Cust_perm_add,
                        pan: data.Cust_pan,
                        aadhar: data.Cust_aadhar,
                        weddingAnniversary: dateArray[2],
                        alternateContact: data.Cust_alt_contactno,
                        qualification: data.Cust_qualification,
                        profession: data.Cust_Profession,
                        company: data.Cust_company,
                        designation: data.Cust_desig,
                        officeAddress: data.Cust_off_add,
                        officeEmailId: data.Cust_off_email,
                        spouseName: data.Cust_spouse_nm,
                        spouseDob: dateArray[1],
                        spousePan: data.Cust_spouse_pan,
                        spouseAadhar: data.Cust_spouse_aadhar,
                        childrenNo: data.Cust_noof_childrn + "",
                        child1Name: data.Cust_child1_nm,
                        child1Dob: dateArray[4],
                        child2Name: data.Cust_child2_nm,
                        child2Dob: dateArray[5],
                        child3Name: data.Cust_child3_nm,
                        child3Dob: dateArray[6],
                        child4Name: data.Cust_child4_nm,
                        child4Dob: dateArray[7],
                        bankloan: data.Cust_bankloan,
                        bankName: data.Cust_bankloan,
                        accountNumber: data.Cust_bankaccno,
                        ifscCode: data.Cust_bankifsccode,
                        bankAdress: data.Cust_bankadd,
                        bankEmailId: data.Cust_bankemailid,
                        gpaHolder: data.Cust_gpaholdr,
                        gpaRelation: data.Cust_gpa_relationtype + "",
                        gpaName: data.Cust_gpa_nm,
                        gpaDob: dateArray[3],
                        gpaAddress: data.Cust_gpa_add,
                        permanentAddress: data.Cust_gpa_permadd,
                        relationWithcustomer: data.Cust_gpa_reltnwithcusty,
                        gpaPan: data.Cust_gpa_pan,
                        gpaAadhar: data.Cust_gpa_aadhar
                    }

                    editAppendFields();
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Customers");
            }
        }).error(function() {});
    })();

    $scope.updateCustomer = function(formObj, formName) {
        alert("update customer");
    }

    $scope.addCustomer = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            angular.element(".loader").show();

            var relationType = 0;
            var statusType = 0;
            var noOfChildren = 0;
            var gpaRelation = 0;

            if (formObj.relationType != undefined && formObj.relationType != '') {
                relationType = formObj.relationType;
            }

            if (formObj.gpaRelation != undefined && formObj.gpaRelation != '') {
                gpaRelation = formObj.gpaRelation;
            }

            if (formObj.residentType != undefined && formObj.residentType != '') {
                statusType = formObj.residentType;
            }

            if (formObj.childrenNo != undefined && formObj.childrenNo != '') {
                noOfChildren = formObj.childrenNo;
            }

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Cust/SaveCust",
                ContentType: 'application/json',
                data: {
                    "user_id": $scope.leadId,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "Cust_User_Id_Assgnto": 1,
                    "Cust_relationtype": relationType,
                    "Cust_relationname": formObj.relationName,
                    "Cust_status_type": statusType,
                    "Cust_perm_add": formObj.address2,
                    "Cust_status_other": "Cust_status_other",
                    "Cust_pan": formObj.pan,
                    "Cust_aadhar": formObj.aadhar,
                    "Cust_alt_contactno": formObj.alternateContact,
                    "Cust_qualification": formObj.qualification,
                    "Cust_Profession": formObj.profession,
                    "Cust_company": formObj.company,
                    "Cust_desig": formObj.designation,
                    "Cust_off_add": formObj.officeAddress,
                    "Cust_off_email": formObj.officeEmailId,
                    "Cust_spouse_nm": formObj.spouseName,
                    "Cust_spouse_dob": formObj.spouseDob,
                    "Cust_spouse_pan": formObj.spousePan,
                    "Cust_spouse_aadhar": formObj.spouseAadhar,
                    "Cust_noof_childrn": noOfChildren,
                    "Cust_child1_nm": formObj.child1Name,
                    "Cust_child1_dob": formObj.child1Dob,
                    "Cust_child2_nm": formObj.child2Name,
                    "Cust_child2_dob": formObj.child2Dob,
                    "Cust_child3_nm": formObj.child3Name,
                    "Cust_child3_dob": formObj.child3Dob,
                    "Cust_child4_nm": formObj.child4Name,
                    "Cust_child4_dob": formObj.child4Dob,
                    "Cust_wedanv": formObj.weddingAnniversary,
                    "Cust_bankloan": formObj.bankloan,
                    "Cust_banknm": formObj.bankName,
                    "Cust_bankaccno": formObj.accountNumber,
                    "Cust_bankadd": formObj.bankAdress,
                    "Cust_bankifsccode": formObj.ifscCode,
                    "Cust_bankemailid": formObj.bankEmailId,
                    "Cust_gpaholdr": formObj.gpaHolder,
                    "Cust_gpa_nm": formObj.gpaName,
                    "Cust_gpa_relationtype": gpaRelation,
                    "Cust_gpa_dob": formObj.gpaDob,
                    "Cust_gpa_add": formObj.gpaAddress,
                    "Cust_gpa_permadd": formObj.permanentAddress,
                    "Cust_gpa_reltnwithcusty": formObj.relationWithcustomer,
                    "Cust_gpa_pan": formObj.gpaPan,
                    "Cust_gpa_aadhar": formObj.gpaAadhar
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/Customers");
                angular.element(".loader").hide();
            }).error(function() {
                alert("Error in save customer");
                angular.element(".loader").hide();
            });
        }
    };
    $scope.appendFields = function() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };

    function editAppendFields() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };
});
app.controller("addAgentController", function($scope, $http, $cookieStore, $state) {
    $scope.pageTitle = "Add Agent";
    $scope.addAgentBtn = true;
    $scope.addAgent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);

            angular.element(".loader").show();

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_type": formObj.type,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "user_password": formObj.password,
                    "Agent_assgnto_user_Id": 1,
                    "Agent_Branch_Id": 1,
                    "Agents_Indvdl": 1,
                    "Agents_firmname": formObj.firmName,
                    "Agents_firmtype": "Agents_firmtype",
                    "Agents_add": formObj.address,
                    "Agent_ctc": formObj.totCtc,
                    "Agents_pan": formObj.pan,
                    "Agents_aadhar": formObj.aadhar,
                    "Agents_alt_contactno": formObj.alternateContactNumber,
                    "Agents_alt_email": formObj.alternameEmailId,
                    "Agents_contactperson": formObj.contactPerson,
                    "Agents_servicetaxdtls": formObj.serviceTaxDetails,
                    "Agents_noofyrsinbsns": formObj.yearsInBusiness,
                    "Agents_totalyrsofexp": formObj.totalYearOfExp,
                    "Agents_banknm": formObj.bankName,
                    "Agents_bankacno": formObj.accountNumber,
                    "Agents_bankadd": formObj.bankAddress,
                    "Agents_banktypeofacn": formObj.accountType,
                    "Agents_bankifsccode": formObj.ifscCode,
                    "Agents_bankemailid": formObj.bankEmailID
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid!");
        }
    };
});

app.controller("agentsController", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.searchAgents = ''; // set the default search/filter term
    ($scope.getAgents = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/AgentDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_type": 5,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $scope.agents = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.agentDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'agentDetail.html',
            controller: 'agentsDetailController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.agents[selectedItem];
                }
            }
        });
    };
});

app.controller("agentsDetailController", function($scope, $http, $cookieStore, $uibModalInstance, item) {
    $scope.agentDetail = item;
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("editAgentController", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Agent";
    $scope.editAgentBtn = true;

    ($scope.getAgentDetail = function() {
        $scope.agentId = $stateParams.agentID;

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/AgentUserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.agentId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);

            if (data.Agents_User_Id != 0) {
                $scope.addAgent = {
                    type: data.user_type + "",
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    firmName: data.Agents_firmname,
                    emailId: data.user_email_address,
                    address: data.Agents_add,
                    mobileNumber: data.user_mobile_no,
                    password: data.user_password,
                    pan: data.Agents_pan,
                    aadhar: data.Agents_aadhar,
                    alternateContactNumber: data.Agents_alt_contactno,
                    alternameEmailId: data.Agents_alt_email,
                    contactPerson: data.Agents_contactperson,
                    serviceTaxDetails: data.Agents_servicetaxdtls,
                    yearsInBusiness: data.Agents_noofyrsinbsns,
                    totalYearOfExp: data.Agents_totalyrsofexp,
                    totCtc: data.Agent_ctc,
                    bankName: data.Agents_banknm,
                    accountNumber: data.Agents_bankacno,
                    bankAddress: data.Agents_bankadd,
                    accountType: data.Agents_banktypeofacn,
                    ifscCode: data.Agents_bankifsccode,
                    bankEmailID: data.Agents_bankemailid
                }
            } else {
                $state.go("/Agents");
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.updateAgent = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUserAgent",
                ContentType: 'application/json',
                data: {
                    "Agents_comp_guid": $cookieStore.get('comp_guid'),
                    "Agents_User_Id": $scope.agentId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "Agent_assgnto_user_Id": 1,
                    "Agent_Branch_Id": 1,
                    "Agents_Indvdl": 1,
                    "Agents_firmname": formObj.firmName,
                    "Agents_firmtype": "Agents_firmtype",
                    "Agents_add": formObj.address,
                    "Agent_ctc": formObj.totCtc,
                    "Agents_pan": formObj.pan,
                    "Agents_aadhar": formObj.aadhar,
                    "Agents_alt_contactno": formObj.alternateContactNumber,
                    "Agents_alt_email": formObj.alternameEmailId,
                    "Agents_contactperson": formObj.contactPerson,
                    "Agents_servicetaxdtls": formObj.serviceTaxDetails,
                    "Agents_noofyrsinbsns": formObj.yearsInBusiness,
                    "Agents_totalyrsofexp": formObj.totalYearOfExp,
                    "Agents_banknm": formObj.bankName,
                    "Agents_bankacno": formObj.accountNumber,
                    "Agents_bankadd": formObj.bankAddress,
                    "Agents_banktypeofacn": formObj.accountType,
                    "Agents_bankifsccode": formObj.ifscCode,
                    "Agents_bankemailid": formObj.bankEmailID
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/Agents");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            console.log($scope[formName].$error);
            alert("Not valid!");
        }
    };
});

app.controller("unitAllocation", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];

    ($scope.getProjectList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhaseList = function(projectName) {
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
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/AllocByUserType",
                ContentType: 'application/json',
                data: {
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "Projusrtyp": 3,
                    "Phase_Id": obj.phase,
                    "Blocks_Id": obj.blocks
                }
            }).success(function(data) {
                console.log(data);
                $scope.unitAllocationData = [];
                for (h = 0; h < data.length; h++) {
                    if (data[h].userprojlist != null) {
                        for (i = 0; i < data[h].userprojlist.length; i++) {
                            if (data[h].userprojlist[i].ProjDtl_Status != 7) {
                                $scope.unitAllocationObj = {};

                                $scope.unitAllocationObj.name = data[h].user_first_name + ' ' + data[h].user_middle_name + ' ' + data[h].user_last_name;
                                $scope.unitAllocationObj.email = data[h].user_email_address;
                                $scope.unitAllocationObj.mobile = data[h].user_mobile_no;
                                /*$scope.unitAllocationObj.projName = data[h].userprojlist[i].Proj_Name;
                                $scope.unitAllocationObj.phaseName = data[h].userprojlist[i].Phase_Name;
                                $scope.unitAllocationObj.phaseType = 'Temp Phase Type';
                                $scope.unitAllocationObj.blockName = data[h].userprojlist[i].Blocks_Name;*/
                                $scope.unitAllocationObj.unitObj = data[h].userprojlist[i];
                                $scope.unitAllocationObj.leadID = data[h].user_id;

                                $scope.unitAllocationData.push($scope.unitAllocationObj);
                            }
                        }
                    }
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }

    $scope.updateUnitAllocationStatus = function(unitData) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitStatusUpdate.html',
            controller: 'unitUpdateController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitData;
                }
            }
        });
    };
});

app.controller("unitUpdateController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.unit = item;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.updateStatus = function(formObj) {
        if (formObj.updateStatus != undefined && formObj.updateStatus != '') {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UpdtUnitDtls/ByUnitDtlsID",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Id": $scope.unit.unitObj.UnitDtls_Id,
                    "UnitDtls_Status": formObj.updateStatus,
                    "UnitDtls_user_id": formObj.leadID
                }
            }).success(function(data) {
                console.log(data);
                $uibModalInstance.close();
                if (data[0].UnitDtls_ErrorDesc == '0') {
                    $uibModalInstance.close();
                    $state.go("/ConvertCustomer", {
                        "leadID": $scope.unit.leadID,
                        "action": 'addCustomer'
                    });
                } else {
                    alert('some error in changing unit status.');
                }
            }).error(function() {
                alert('some error!!');
            });
        } else {
            alert('Please select any option first.');
        }
    };
});

app.controller("projects", function($scope, $http, $cookieStore, $state) {

    ($scope.getProjectsList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Proj/View",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid'),
                "ProjId": 0
            }
        }).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Proj_Types.length > 1) {
                    var types = data[i].Proj_Types.split('#');
                    var typeValue = '';
                    for (var j = 0; j < types.length; j++) {
                        if (!(j == types.length - 1))
                            typeValue = typeValue + ' , ' + getTypeNameById(types[j]);
                        else
                            typeValue = typeValue + ' & ' + getTypeNameById(types[j]);
                    }
                    data[i].Proj_Types = typeValue.substring(2, typeValue.length);
                } else {
                    data[i].Proj_Types = getTypeNameById(data[i].Proj_Types);
                }
            }
            $scope.projectsList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});

app.controller("addProject", function($scope, $http, $cookieStore, $state) {
    $scope.pageTitle = "Add Project";
    $scope.addProjectBtn = true;
    $scope.saveProject = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var projType = '';

            if (formObj.type1 == true)
                projType = '1';
            if (formObj.type2 == true)
                projType = projType + '2';
            if (formObj.type3 == true)
                projType = projType + '3';
            if (formObj.type4 == true)
                projType = projType + '4';

            var projTypes = projType.split('');
            projType = '';
            for (var i = 0; i < projTypes.length; i++) {
                if (i != 0)
                    projType = projType + '#' + projTypes[i];
                else
                    projType = projTypes[i];
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/Save",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId": 0,
                    "Proj_Code": formObj.projCode,
                    "Proj_Name": formObj.projectName,
                    "Proj_Location": formObj.location,
                    "Proj_Surveyno": formObj.surveyNos,
                    "Proj_Phases": formObj.phases,
                    "Proj_Types": projType
                }
            }).success(function(data) {
                //                console.log(data);
                angular.element(".loader").hide();
                $state.go('/Projects');
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getTypeIdByName(typeName) {
        var typeId = '';
        switch (typeName) {
            case 'Flat':
                typeId = 1;
                break;
            case 'Sites':
                typeId = 2;
                break;
            case 'Villa':
                typeId = 3;
                break;
            case 'Row Houses':
                typeId = 4;
                break;
            default:
                console.log('eror');
        }
        return typeId;
    }
});

app.controller("editProject", function($scope, $http, $cookieStore, $state, $stateParams) {
    $scope.pageTitle = "Edit Project";
    $scope.editProjectBtn = true;

    ($scope.getProjectList = function() {
        $scope.projId = $stateParams.projId;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Proj/View",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid'),
                "ProjId": $scope.projId
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            var projTypes = data[0].Proj_Types;
            $scope.addProject = {
                location: data[0].Proj_Location,
                projectName: data[0].Proj_Name,
                phases: data[0].Proj_Phases,
                surveyNos: data[0].Proj_Surveyno,
                projCode: data[0].Proj_Code,
                type1: projTypes.indexOf("1") != -1,
                type2: projTypes.indexOf("2") != -1,
                type3: projTypes.indexOf("3") != -1,
                type4: projTypes.indexOf("4") != -1
            };
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }

    $scope.editProject = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var projType = '';

            if (formObj.type1 == true)
                projType = '1';
            if (formObj.type2 == true)
                projType = projType + '2';
            if (formObj.type3 == true)
                projType = projType + '3';
            if (formObj.type4 == true)
                projType = projType + '4';

            var projTypes = projType.split('');
            projType = '';
            for (var i = 0; i < projTypes.length; i++) {
                if (i != 0)
                    projType = projType + '#' + projTypes[i];
                else
                    projType = projTypes[i];
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/Save",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId": $scope.projId,
                    "Proj_Code": formObj.projCode,
                    "Proj_Name": formObj.projectName,
                    "Proj_Location": formObj.location,
                    "Proj_Surveyno": formObj.surveyNos,
                    "Proj_Phases": formObj.phases,
                    "Proj_Types": projType
                }
            }).success(function(data) {
                //                console.log(data);
                angular.element(".loader").hide();
                $state.go('/Projects');
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    function getTypeIdByName(typeName) {
        var typeId = '';
        switch (typeName) {
            case 'Flat':
                typeId = 1;
                break;
            case 'Sites':
                typeId = 2;
                break;
            case 'Villa':
                typeId = 3;
                break;
            case 'Row Houses':
                typeId = 4;
                break;
            default:
                console.log('eror');
        }
        return typeId;
    }
});

app.controller("editPhases", function($scope, $http, $cookieStore, $state, $compile, $stateParams, myService) {
    var Phase_Proj_Id = $stateParams.projId;
    var Phase_Id = $stateParams.phaseId;

    $scope.pageTitle = "Edit Phase";
    $scope.editPhaseBtn = true;

    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    ($scope.getPhaseInfo = function() {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": Phase_Proj_Id,
                "Phase_Id": Phase_Id
            }
        }).success(function(data) {
            //console.log(data);
            editAppendFields(data);
            var phaseList = [];
            var blockIdList = [];

            if (data[0].LstofBlocks != null) {
                for (var i = 0; i < data[0].LstofBlocks.length; i++) {
                    phaseList.push(data[0].LstofBlocks[i].Blocks_Name);
                    blockIdList.push(data[0].LstofBlocks[i].Blocks_Id);
                }
            }
            $scope.projectDetails = {
                phaseName: data[0].Phase_Name,
                location: data[0].Phase_Location,
                surveyNos: data[0].Phase_Surveynos,
                unitOfMeasurement: data[0].Phase_UnitMsmnt.UnitMsmnt_Id + "",
                phaseType: data[0].Phase_UnitType.UnitType_Id,
                noOfBlocks: data[0].Phase_NoofBlocks,
                projectName: $stateParams.projId,
                blockName: phaseList,
                blockId: blockIdList
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();




    function editAppendFields(data) {
        angular.element("#noOfBlocks").html('');
        if (data[0].LstofBlocks != null) {
            for (i = 1; i <= data[0].LstofBlocks.length; i++) {
                var childDiv = '<div id="block' + data[0].LstofBlocks[i - 1].Blocks_Id + '"><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control inputWithIcon" name="blockName[' + (i - 1) + ']" ng-model="projectDetails.blockName[' + (i - 1) + ']" /> <input type="text" class="form-control dispNone" ng-model="projectDetails.blockId[' + (i - 1) + ']" ng-value="' + data[0].LstofBlocks[i - 1].Blocks_Id + '" name="blockId[' + (i - 1) + ']"/>';

                if (!data[0].LstofBlocks[i - 1].blnunitexists)
                    childDiv = childDiv + '<span ng-click="deleteBlock(' + data[0].Phase_Id + ',' + data[0].LstofBlocks[i - 1].Blocks_Id + ')" class="glyphicon glyphicon-trash delete"></span></div>';
                else
                    childDiv = childDiv + "</div>";
                var childDivComplied = $compile(childDiv)($scope);
                angular.element("#noOfBlocks").append(childDivComplied);
            }
        }
    };

    $scope.appendFields = function() {
        var index = 0;
        var placeholder = 1;
        var blockNumbers = $("#noOfBlocks > div").length;

        if (blockNumbers != 0) {
            var lastInputHtml = $("#noOfBlocks > div:last-child > input").attr('name');
            index = parseInt(lastInputHtml.substring(lastInputHtml.indexOf('[') + 1, lastInputHtml.indexOf(']'))) + 1;
            placeholder = index + 1;
        }

        var childDiv = '<div id="block' + index + '"><input type="text" placeholder="Block  ' + placeholder + ' Name" title="Block ' + index + ' Name" class="form-control inputWithIcon" name="blockName[' + (index) + ']" ng-model="projectDetails.blockName[' + (index) + ']" /></div>';
        var childDivComplied = $compile(childDiv)($scope);
        angular.element("#noOfBlocks").append(childDivComplied);

        var something = $("#blockCount").val(blockNumbers + 1);
    };

    $scope.editPhase = function(formObj, formName) {
        var noOfBlocks = $("#blockCount").val();
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var blockLst = [];
            for (var i = 0; i < noOfBlocks; i++) {
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0;
                if (formObj.blockId[i] != undefined)
                    tmp.Blocks_Id = formObj.blockId[i];
                blockLst.push(tmp);
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                    "Phase_comp_guid": $cookieStore.get('comp_guid'),
                    "Phase_Id": $stateParams.phaseId,
                    "Phase_Proj_Id": formObj.projectName,
                    "Phase_Name": formObj.phaseName,
                    "Phase_Surveynos": formObj.surveyNos,
                    "Phase_UnitMsmnt": {
                        "UnitMsmnt_Id": formObj.unitOfMeasurement
                    },
                    "Phase_UnitType": {
                        "UnitType_Id": formObj.phaseType
                    },
                    "Phase_NoofBlocks": noOfBlocks,
                    "Phase_Location": formObj.location,
                    "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data);
                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if ($scope.addPhaseResult.Comm_ErrorDesc.match('0|')) {
                    $state.go("/EditUnit", {
                        projId: Phase_Proj_Id,
                        phaseId: Phase_Id
                    });
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };

    $scope.deleteBlock = function(blockId, phaseId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Delete",
            ContentType: 'application/json',
            data: {
                "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                "Blocks_Id": phaseId,
                "Blocks_Phase_Id": blockId
            }
        }).success(function(data) {
            $("#block" + phaseId).remove();
            var blockNumbers = $("#noOfBlocks > div").length;
            $("#blockCount").val(blockNumbers);
            //            $state.go("/EditPhases", {
            //                "projId": $stateParams.projId,
            //                "phaseId": $stateParams.phaseId
            //            });
            //            $state.reload();
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
});

app.controller("addPhases", function($scope, $http, $cookieStore, $state, $compile, $stateParams) {
    $scope.pageTitle = "Add Phase";
    $scope.addPhaseBtn = true;

    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            $scope.projectDetails = {
                phaseType: "1",
                unitOfMeasurement: "1",
                projectName: $stateParams.projId
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.appendFields = function(noOfLocation) {
        angular.element("#noOfBlocks").html('');
        for (i = 1; i <= noOfLocation; i++) {
            var childDiv = '<div><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control" name="blockName[' + (i - 1) + ']" ng-model="projectDetails.blockName[' + (i - 1) + ']" /></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#noOfBlocks").append(childDivComplied);
        }
    };

    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var blockLst = [];
            for (var i = 0; i < formObj.noOfBlocks; i++) {
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0;
                blockLst.push(tmp);
            }

            //            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                    "Phase_comp_guid": $cookieStore.get('comp_guid'),
                    "Phase_Id": 0,
                    "Phase_Proj_Id": formObj.projectName,
                    "Phase_Name": formObj.phaseName,
                    "Phase_Surveynos": formObj.surveyNos,
                    "Phase_UnitMsmnt": {
                        "UnitMsmnt_Id": formObj.unitOfMeasurement
                    },
                    "Phase_UnitType": {
                        "UnitType_Id": formObj.phaseType
                    },
                    "Phase_NoofBlocks": formObj.noOfBlocks,
                    "Phase_Location": formObj.location,
                    "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data.Comm_ErrorDesc);
                var resultData = data.Comm_ErrorDesc;
                var resDataArray = resultData.split('|');

                console.log(resDataArray);

                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if (resDataArray[0] == 0) {
                    $state.go("/AddUnit", {
                        projId: formObj.projectName,
                        phaseId: resDataArray[1]
                    });
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("phases", function($scope, $http, $cookieStore, $state, $compile) {
    $scope.typeNames = ['Flat', 'Sites', 'Villa', 'Row Houses'];

    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhases = function(projId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham//Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": projId
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            $scope.phaseList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            $state.go("/AddPhases", {
                "projId": formObj.projectName
            });
            /*$state.go("/AddPhases");
            $scope.projectDetails = {
                projectName : formObj.projectName
            };*/
        }
    };
});

app.controller("customerController", function($scope, $http, $cookieStore, $state, $uibModal) {
    ($scope.getCustomers = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 4
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            $scope.customers = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerDetail.html',
            controller: 'customerDetailController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.customers[selectedItem];
                }
            }
        });
    };
});

app.controller("AccessRights", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Access Rights";
    $scope.currentRoleId = 0;
    
    ($scope.getRolesList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RoleGet",
            ContentType: 'application/json',
            data: {
                "role_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.rolesList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.getModulesList = function(roleId) {
        $scope.currentRoleId = roleId;
        if(roleId != undefined && roleId != ''){
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/ModulesGet",
                ContentType: 'application/json',
                data: {
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $scope.modulesList = data;
                getRoleaccrgts(roleId);
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            $scope.modulesList = [];
        }
    };
    
    function getRoleaccrgts(roleId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/Roleaccrgts",
            ContentType: 'application/json',
            data: {
                "RoleAccRgts_compguid": $cookieStore.get('comp_guid'),
                "RoleAccRgts_RoleId": roleId
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.Roleaccrgts = [];
            for(var i = 0; i < data.length; i++){
                var rolesAccesRgt = {};
                rolesAccesRgt.Add = data[i].RoleAccRgts_Add;
                rolesAccesRgt.View = data[i].RoleAccRgts_View;
                rolesAccesRgt.Edit = data[i].RoleAccRgts_Edit;
                rolesAccesRgt.Delete = data[i].RoleAccRgts_Del;
                $scope.Roleaccrgts.push(rolesAccesRgt);
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    function checkUndefined(checkBoxValue) {
        if(checkBoxValue == undefined){
            return 0;
        } else {
            return checkBoxValue;
        }
    };
    
    $scope.SubmitRoleaccrgts = function(formObj, formName) {
        
        if($scope.currentRoleId == undefined || $scope.currentRoleId == ''){
            alert("Please select any Role first.");
            return false;
        }
        $scope.submit = true;
        
        var rolesRightDataArray = [];
        
        for(var i = 0; i < $scope.modulesList.length; i++){
            var rolesAccesRgt = {};
            rolesAccesRgt.RoleAccRgts_compguid = $cookieStore.get('comp_guid');
            rolesAccesRgt.RoleAccRgts_RoleId = $scope.currentRoleId;
            rolesAccesRgt.RoleAccRgts_ModuleId = $scope.modulesList[i].module_id;
            if(formObj[i] != undefined){
                rolesAccesRgt.RoleAccRgts_Add = checkUndefined(formObj[i].Add);
                rolesAccesRgt.RoleAccRgts_View = checkUndefined(formObj[i].View);
                rolesAccesRgt.RoleAccRgts_Edit = checkUndefined(formObj[i].Edit);
                rolesAccesRgt.RoleAccRgts_Del = checkUndefined(formObj[i].Delete);
            } else {
                rolesAccesRgt.RoleAccRgts_Add = 0;
                rolesAccesRgt.RoleAccRgts_View = 0;
                rolesAccesRgt.RoleAccRgts_Edit = 0;
                rolesAccesRgt.RoleAccRgts_Del = 0;
            }
            
            rolesRightDataArray.push(rolesAccesRgt);
        }
        
        console.log(rolesRightDataArray);
        
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveRoleaccrgts",
                ContentType: 'application/json',
                data: rolesRightDataArray
            }).success(function(data) {
                if (data[0].RoleErrorDesc == "0") {
                    alert("Access Right Record Saved")
                    $state.go("/Leads");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});


app.controller("customerDetailController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.customer = item;
    $scope.unitStatus = [];
    $scope.unitStatus[2] = "Interested";
    $scope.unitStatus[4] = "Blocked by paying advance";
    $scope.unitStatus[5] = "Blocked by not paying advance";
    $scope.unitStatus[6] = "Sold";
    $scope.unitStatus[7] = "Cancelled";

    $scope.leadId = $scope.customer.user_id;

    if ($scope.customer.userprojlist != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.customer.userprojlist.length; i++) {
            $scope.leadUnitObj = $scope.customer.userprojlist[i];
            $scope.leadUnitObj.unitViewStatus = "N/A";
            if ($scope.customer.userprojlist[i].ProjDtl_Status != 0)
                $scope.leadUnitObj.unitViewStatus = $scope.unitStatus[$scope.customer.userprojlist[i].ProjDtl_Status];
            $scope.leadProjects.push($scope.leadUnitObj);
        }
    }

    $scope.deleteRow = function(projId, rowId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitDel",
            ContentType: 'application/json',
            data: [{
                "comp_guid": $cookieStore.get('comp_guid'),
                "ProjDtl_Id": projId
            }]
        }).success(function(data) {
            if (data.Comm_ErrorDesc == '0|0') {
                $("tr#" + rowId).remove();
                $("#unit" + rowId).removeClass('selected');
            }
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID": $scope.leadId
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});
app.controller("addUnit", function($scope, $http, $state, $cookieStore, $stateParams) {
    var projectId = $stateParams.projId;
    var phaseId = $stateParams.phaseId;

    $scope.pageTitle = "Add Unit";
    $scope.addPhaseUnitBtn = "ture";

    ($scope.getPhaseDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDt/Getdata",
            ContentType: 'application/json',
            data: {
                "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                "UnitTypeData_Phase_Id": phaseId
            }
        }).success(function(data) {
            //            console.log(data);
            if (data.UnitTypeData_Id != 0) {
                var minorType = "false";
                var nocObtainedType = "false";
                var planApprovedType = "false";
                var landConvertedType = "false";
                var relinquishType = "false";

                if (data.UnitTypeData_minor == "0") {
                    minorType = "true";
                }
                if (data.UnitTypeData_noc == "0") {
                    nocObtainedType = "true";
                }
                if (data.UnitTypeData_planappvd == "0") {
                    planApprovedType = "true";
                }
                if (data.UnitTypeData_lndconv == "0") {
                    landConvertedType = "true";
                }
                if (data.UnitTypeData_rlqyn == "0") {
                    relinquishType = "true";
                }

                $scope.addUnit = {
                    ownerShipType: data.UnitTypeData_Phase_Id,
                    ownerName: data.UnitTypeData_ownrnm,
                    ownerSowodo: data.UnitTypeData_sowodo,
                    ownerDob: data.UnitTypeData_dob,
                    ownerAddress: data.UnitTypeData_add,
                    ownerPan: data.UnitTypeData_pan,
                    minor: minorType,
                    guardianName: data.UnitTypeData_grdnm,
                    guardianSowodo: data.UnitTypeData_gunsowodo,
                    guardianDob: data.UnitTypeData_gundob,
                    guardianAddress: data.UnitTypeData_gunadd,
                    guardianPan: data.UnitTypeData_gunpan,
                    relationshipWithMinor: data.UnitTypeData_gunrltnminor,
                    totalLandArea: data.UnitTypeData_ttllndar,
                    totalHyneArea: data.UnitTypeData_ttlhynlnd,
                    totalKarabArea: data.UnitTypeData_krblnd,
                    landConverted: landConvertedType,
                    conversionOrderDocNo: data.UnitTypeData_convordr,
                    conversionOrderDocDt: data.UnitTypeData_convordrdt,
                    planApproved: planApprovedType,
                    planApproveNo: data.UnitTypeData_lstplappv[0].plnappno,
                    planApproveDt: data.UnitTypeData_lstplappv[0].plnappdt,
                    planApproveAuth: data.UnitTypeData_lstplappv[0].plnappaut,
                    nocObtained: nocObtainedType,
                    nocDate: data.UnitTypeData_lstnoc[0].nocdt,
                    nocDocNo: data.UnitTypeData_lstnoc[0].nocdocno,
                    relinquish: relinquishType,
                    docNum: data.UnitTypeData_lstlreq[0].reqsno,
                    docDate: data.UnitTypeData_lstlreq[0].reqdocndt,
                    totalSaleArea: data.UnitTypeData_ttlsalearea,
                    totalPlots: data.UnitTypeData_ttlplots,
                    areaOfRoads: data.UnitTypeData_areafrroads,
                    areaOfParks: data.UnitTypeData_araafrprks,
                    areaOfCivicAmen: data.UnitTypeData_arafrcivicamn,
                    superBuiltArea: data.UnitTypeData_sprbltupara,
                    gardenArea: data.UnitTypeData_grdnara,
                    terraceArea: data.UnitTypeData_terara,
                    terraceGarden: data.UnitTypeData_tergrdn,
                    carpetArea: data.UnitTypeData_crptara,
                    plinthArea: data.UnitTypeData_pltnara,
                    noOfFloors: data.UnitTypeData_noflors,
                    noOfBedrooms: data.UnitTypeData_nobdrms,
                    commonBathrooms: data.UnitTypeData_cmnbtrms,
                    attachedBathrooms: data.UnitTypeData_attchbtrms,
                    servantRoom: data.UnitTypeData_srvntroom,
                    carParkingArea: data.UnitTypeData_carprkara
                };
            } else {
                //                alert("wrong");
                $scope.addUnit = {
                    ownerShipType: 0,
                    nocObtained: "false",
                    planApproved: "false",
                    landConverted: "false",
                    minor: "false",
                    relinquish: "false"
                };
            }

            angular.element(".loader").hide();
        }).error(function() {
            alert("Something went wrong.");
            angular.element(".loader").hide();
        });
    })();

    $scope.savePhaseData = function(formObj, formName) {
        $scope.submit = true;
        console.log(formObj);
        if ($scope[formName].$valid) {
            //            alert("Valid Form");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDt/Save",
                ContentType: 'application/json',
                data: {
                    "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitTypeData_Phase_Id": phaseId,
                    "UnitTypeData_ownrnm": formObj.ownerName,
                    "UnitTypeData_sowodo": formObj.ownerSowodo,
                    "UnitTypeData_dob": formObj.ownerDob,
                    "UnitTypeData_add": formObj.ownerAddress,
                    "UnitTypeData_pan": formObj.ownerPan,
                    "UnitTypeData_minor": formObj.minor,
                    "UnitTypeData_grdnm": formObj.guardianName,
                    "UnitTypeData_gunsowodo": formObj.guardianSowodo,
                    "UnitTypeData_gundob": formObj.guardianDob,
                    "UnitTypeData_gunadd": formObj.guardianAddress,
                    "UnitTypeData_gunpan": formObj.guardianPan,
                    "UnitTypeData_gunrltnminor": formObj.relationshipWithMinor,
                    "UnitTypeData_ttllndar": formObj.totalLandArea,
                    "UnitTypeData_ttlhynlnd": formObj.totalHyneArea,
                    "UnitTypeData_krblnd": formObj.totalKarabArea,
                    "UnitTypeData_lndconv": formObj.landConverted,
                    "UnitTypeData_convordr": formObj.conversionOrderDocNo,
                    "UnitTypeData_convordrdt": formObj.conversionOrderDocDt,
                    "UnitTypeData_planappvd": formObj.planApproved,
                    "UnitTypeData_lstplappv": [{
                        "plnappno": formObj.planApproveNo,
                        "plnappdt": formObj.planApproveDt,
                        "plnappaut": formObj.planApproveAuth
                    }],
                    "UnitTypeData_noc": formObj.nocObtained,
                    "UnitTypeData_lstnoc": [{
                        "nocdt": formObj.nocDate,
                        "nocdocno": formObj.nocDocNo
                    }],
                    "UnitTypeData_rlqyn": formObj.relinquish,
                    "UnitTypeData_lstlreq": [{
                        "reqsno": formObj.docNum,
                        "reqdocndt": formObj.docDate
                    }],
                    "UnitTypeData_lstrel": [{
                        "relsno": "xx2",
                        "relesnoplots": "xx4"
                    }],
                    "UnitTypeData_ttlsalearea": formObj.totalSaleArea,
                    "UnitTypeData_ttlplots": formObj.totalPlots,
                    "UnitTypeData_areafrroads": formObj.areaOfRoads,
                    "UnitTypeData_araafrprks": formObj.areaOfParks,
                    "UnitTypeData_arafrcivicamn": formObj.areaOfCivicAmen,
                    "UnitTypeData_sprbltupara": formObj.superBuiltArea,
                    "UnitTypeData_grdnara": formObj.gardenArea,
                    "UnitTypeData_terara": formObj.terraceArea,
                    "UnitTypeData_tergrdn": formObj.terraceGarden,
                    "UnitTypeData_crptara": formObj.carpetArea,
                    "UnitTypeData_pltnara": formObj.plinthArea,
                    "UnitTypeData_noflors": formObj.noOfFloors,
                    "UnitTypeData_nobdrms": formObj.noOfBedrooms,
                    "UnitTypeData_cmnbtrms": formObj.commonBathrooms,
                    "UnitTypeData_attchbtrms": formObj.attachedBathrooms,
                    "UnitTypeData_srvntroom": formObj.servantRoom,
                    "UnitTypeData_carprkara": formObj.carParkingArea,
                    "UnitTypeData_Id": 0
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/UnitGeneration", {
                    projId: projectId,
                    phaseId: phaseId
                });
            }).error(function() {
                alert("Something went wrong.");
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("editUnit", function($scope, $http, $state, $cookieStore, $stateParams) {
    var projectId = $stateParams.projId;
    var phaseId = $stateParams.phaseId;

    $scope.pageTitle = "Edit Unit";
    $scope.editPhaseUnitBtn = "ture";
    $scope.editTypeDataId = 0;

    ($scope.getPhaseDetail = function() {
        angular.element(".loader").show();

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDt/Getdata",
            ContentType: 'application/json',
            data: {
                "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                "UnitTypeData_Phase_Id": phaseId
            }
        }).success(function(data) {
            console.log(data);
            if (data.UnitTypeData_Id != 0) {
                $scope.editTypeDataId = data.UnitTypeData_Id;

                var minorType = "false";
                var nocObtainedType = "false";
                var planApprovedType = "false";
                var landConvertedType = "false";
                var relinquishType = "false";

                if (data.UnitTypeData_minor == "1") {
                    minorType = "true";
                }
                if (data.UnitTypeData_noc == "1") {
                    nocObtainedType = "true";
                }
                if (data.UnitTypeData_planappvd == "1") {
                    planApprovedType = "true";
                }
                if (data.UnitTypeData_lndconv == "1") {
                    landConvertedType = "true";
                }
                if (data.UnitTypeData_rlqyn == "1") {
                    relinquishType = "true";
                }

                var planApproveNum = '';
                var planApproveDate = '';
                var planApproveAuth = '';

                if (data.UnitTypeData_lstplappv.length > 0) {
                    planApproveNum = data.UnitTypeData_lstplappv[0].plnappno;
                    planApproveDate = data.UnitTypeData_lstplappv[0].plnappdt;
                    planApproveAuth = data.UnitTypeData_lstplappv[0].plnappaut;
                }

                var nocDate = '';
                var nocNum = '';

                if (data.UnitTypeData_lstnoc.length > 0) {
                    nocDate = data.UnitTypeData_lstnoc[0].nocdt;
                    nocNum = data.UnitTypeData_lstnoc[0].nocdocno;
                }

                var reqsno = '';
                var reqdocndt = '';

                if (data.UnitTypeData_lstlreq.length > 0) {
                    reqsno = data.UnitTypeData_lstlreq[0].reqsno;
                    reqdocndt = data.UnitTypeData_lstlreq[0].reqdocndt;
                }

                $scope.addUnit = {
                    ownerShipType: data.UnitTypeData_Phase_Id,
                    ownerName: data.UnitTypeData_ownrnm,
                    ownerSowodo: data.UnitTypeData_sowodo,
                    ownerDob: data.UnitTypeData_dob,
                    ownerAddress: data.UnitTypeData_add,
                    ownerPan: data.UnitTypeData_pan,
                    minor: minorType,
                    guardianName: data.UnitTypeData_grdnm,
                    guardianSowodo: data.UnitTypeData_gunsowodo,
                    guardianDob: data.UnitTypeData_gundob,
                    guardianAddress: data.UnitTypeData_gunadd,
                    guardianPan: data.UnitTypeData_gunpan,
                    relationshipWithMinor: data.UnitTypeData_gunrltnminor,
                    totalLandArea: data.UnitTypeData_ttllndar,
                    totalHyneArea: data.UnitTypeData_ttlhynlnd,
                    totalKarabArea: data.UnitTypeData_krblnd,
                    landConverted: landConvertedType,
                    conversionOrderDocNo: data.UnitTypeData_convordr,
                    conversionOrderDocDt: data.UnitTypeData_convordrdt,
                    planApproved: planApprovedType,
                    planApproveNo: planApproveNum,
                    planApproveDt: planApproveDate,
                    planApproveAuth: planApproveAuth,
                    nocObtained: nocObtainedType,
                    nocDate: nocDate,
                    nocDocNo: nocNum,
                    relinquish: relinquishType,
                    docNum: reqsno,
                    docDate: reqdocndt,
                    totalSaleArea: data.UnitTypeData_ttlsalearea,
                    totalPlots: data.UnitTypeData_ttlplots,
                    areaOfRoads: data.UnitTypeData_areafrroads,
                    areaOfParks: data.UnitTypeData_araafrprks,
                    areaOfCivicAmen: data.UnitTypeData_arafrcivicamn,
                    superBuiltArea: data.UnitTypeData_sprbltupara,
                    gardenArea: data.UnitTypeData_grdnara,
                    terraceArea: data.UnitTypeData_terara,
                    terraceGarden: data.UnitTypeData_tergrdn,
                    carpetArea: data.UnitTypeData_crptara,
                    plinthArea: data.UnitTypeData_pltnara,
                    noOfFloors: data.UnitTypeData_noflors,
                    noOfBedrooms: data.UnitTypeData_nobdrms,
                    commonBathrooms: data.UnitTypeData_cmnbtrms,
                    attachedBathrooms: data.UnitTypeData_attchbtrms,
                    servantRoom: data.UnitTypeData_srvntroom,
                    carParkingArea: data.UnitTypeData_carprkara
                };
            } else {
                $scope.addUnit = {
                    ownerShipType: 0,
                    nocObtained: "false",
                    planApproved: "false",
                    landConverted: "false",
                    minor: "false",
                    relinquish: "false"
                };
            }

            angular.element(".loader").hide();
        }).error(function() {
            alert("Something went wrong.");
            angular.element(".loader").hide();
        });
    })();

    $scope.editPhaseData = function(formObj, formName) {
        $scope.submit = true;
        console.log(formObj);
        if ($scope[formName].$valid) {
            //            alert("Valid Form");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDt/Save",
                ContentType: 'application/json',
                data: {
                    "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitTypeData_Phase_Id": phaseId,
                    "UnitTypeData_ownrnm": formObj.ownerName,
                    "UnitTypeData_sowodo": formObj.ownerSowodo,
                    "UnitTypeData_dob": formObj.ownerDob,
                    "UnitTypeData_add": formObj.ownerAddress,
                    "UnitTypeData_pan": formObj.ownerPan,
                    "UnitTypeData_minor": formObj.minor,
                    "UnitTypeData_grdnm": formObj.guardianName,
                    "UnitTypeData_gunsowodo": formObj.guardianSowodo,
                    "UnitTypeData_gundob": formObj.guardianDob,
                    "UnitTypeData_gunadd": formObj.guardianAddress,
                    "UnitTypeData_gunpan": formObj.guardianPan,
                    "UnitTypeData_gunrltnminor": formObj.relationshipWithMinor,
                    "UnitTypeData_ttllndar": formObj.totalLandArea,
                    "UnitTypeData_ttlhynlnd": formObj.totalHyneArea,
                    "UnitTypeData_krblnd": formObj.totalKarabArea,
                    "UnitTypeData_lndconv": formObj.landConverted,
                    "UnitTypeData_convordr": formObj.conversionOrderDocNo,
                    "UnitTypeData_convordrdt": formObj.conversionOrderDocDt,
                    "UnitTypeData_planappvd": formObj.planApproved,
                    "UnitTypeData_lstplappv": [{
                        "plnappno": formObj.planApproveNo,
                        "plnappdt": formObj.planApproveDt,
                        "plnappaut": formObj.planApproveAuth
                    }],
                    "UnitTypeData_noc": formObj.nocObtained,
                    "UnitTypeData_lstnoc": [{
                        "nocdt": formObj.nocDate,
                        "nocdocno": formObj.nocDocNo
                    }],
                    "UnitTypeData_rlqyn": formObj.relinquish,
                    "UnitTypeData_lstlreq": [{
                        "reqsno": formObj.docNum,
                        "reqdocndt": formObj.docDate
                    }],
                    "UnitTypeData_lstrel": [{
                        "relsno": "xx2",
                        "relesnoplots": "xx4"
                    }],
                    "UnitTypeData_ttlsalearea": formObj.totalSaleArea,
                    "UnitTypeData_ttlplots": formObj.totalPlots,
                    "UnitTypeData_areafrroads": formObj.areaOfRoads,
                    "UnitTypeData_araafrprks": formObj.areaOfParks,
                    "UnitTypeData_arafrcivicamn": formObj.areaOfCivicAmen,
                    "UnitTypeData_sprbltupara": formObj.superBuiltArea,
                    "UnitTypeData_grdnara": formObj.gardenArea,
                    "UnitTypeData_terara": formObj.terraceArea,
                    "UnitTypeData_tergrdn": formObj.terraceGarden,
                    "UnitTypeData_crptara": formObj.carpetArea,
                    "UnitTypeData_pltnara": formObj.plinthArea,
                    "UnitTypeData_noflors": formObj.noOfFloors,
                    "UnitTypeData_nobdrms": formObj.noOfBedrooms,
                    "UnitTypeData_cmnbtrms": formObj.commonBathrooms,
                    "UnitTypeData_attchbtrms": formObj.attachedBathrooms,
                    "UnitTypeData_srvntroom": formObj.servantRoom,
                    "UnitTypeData_carprkara": formObj.carParkingArea,
                    "UnitTypeData_Id": $scope.editTypeDataId
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/UnitGeneration", {
                    projId: projectId,
                    phaseId: phaseId
                });
            }).error(function() {
                alert("Something went wrong.");
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("unitGeneration", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.untDetails = [];
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.untGeneration = {
        projectName: "1",
        phase: "2",
        type: "3"
    };
    var unitNosArr = [];

    ($scope.getBlockList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": $scope.phaseId,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    $scope.addSampleData = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            /*Update Block*/
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Block/Updt",
                ContentType: 'application/json',
                data: {
                    "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                    "Blocks_Id": formObj.block,
                    "Blocks_Floors": formObj.noOfFloors,
                    "Blocks_UnitPerfloor": formObj.unitsPerFloor,
                    "Blocks_Devation": "true"
                }
            }).success(function(data) {
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                console.log(resSplit[0]);
                if (resSplit[0] == 0) {
                    if (formObj.seperator == undefined) {
                        formObj.seperator = "";
                    }
                    if (formObj.noOfFloors > 9) {
                        floorNo = "01";
                    } else {
                        floorNo = "1";
                    }

                    angular.element("#unitRows").html('');
                    unitNosArr = [];
                    var unitsPerFloor = formObj.unitsPerFloor;
                    var unitNo = parseInt(formObj.unitNo);
                    var skipBy = parseInt(formObj.skipBy);
                    var i = 1;
                    while (i <= unitsPerFloor) {
                        unitNosArr.push(unitNo);
                        var tableRow = '<tr><td><input type="text" class="form-control" value="' + floorNo + formObj.seperator + unitNo + '" name="unitNos" ng-required="true"/></td> <td><input type="text" class="form-control" name="unitName" ng-model="untDetails[' + i + '].unitName"/></td> <td><input type="text" class="form-control" name="unitType" ng-model="untDetails[' + i + '].unitType"/></td> <td> <select class="form-control" name="unitBedroom" ng-model="untDetails[' + i + '].unitBedroom"> <option value="">Select</option> <option value="1">1</option> </select> </td> <td> <select class="form-control" name="unitBalconies" ng-model="untDetails[' + i + '].unitBalconies"> <option value="">Select</option> <option value="1">1</option> </select> </td> <td> <select class="form-control" name="unitBathrooms" ng-model="untDetails[' + i + '].unitBathrooms"> <option value="">Select</option><option>3</option> </select> </td> <td><input type="text" class="form-control" name="unitSuperArea" id="untDetails' + i + 'unitSuperArea" ng-model="untDetails[' + i + '].unitSuperArea"/></td> <td><input type="number" ng-keyup="calculatePercentage(' + i + ')" id="untDetails' + i + 'unitPercentage" class="form-control" name="unitPercentage" ng-model="untDetails[' + i + '].unitPercentage"/></td> <td><input type="text" class="form-control" ng-disabled="true" name="unitCarpetArea" id="untDetails' + i + 'unitCarpetArea" ng-model="untDetails[' + i + '].unitCarpetArea"/></td> <td> <select class="form-control" name="unitPremium" ng-model="untDetails[' + i + '].unitPremium"> <option value="">Select</option> <option>Y</option> </select> </td> <td> <select class="form-control" name="unitPosition" ng-model="untDetails[' + i + '].unitPosition"> <option value="">Select</option> <option>E</option></select></td></tr>';
                        var tableRowComplied = $compile(tableRow)($scope);
                        angular.element("#unitRows").append(tableRowComplied);
                        unitNo = unitNo + skipBy;
                        i++;
                    }
                    console.log(unitNosArr);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        }
    };

    $scope.calculatePercentage = function(id) {
        var percentage = $('#untDetails' + id + 'unitPercentage').val();

        if (percentage > 0 && percentage <= 100) {
            var superBuiltArea = $('#untDetails' + id + 'unitSuperArea').val();
            var carpetArea = superBuiltArea - (superBuiltArea * (percentage / 100));
            $('#untDetails' + id + 'unitCarpetArea').val(Math.round(parseFloat(carpetArea)));
        } else {
            alert("Percentage value should be between 0-100.");
            return false;
        }
    };

    $scope.generateForAllFloors = function(formName, formObj, parentObj) {
        /*$scope.submit = true;
        if ($scope[formName].$valid) {
            alert("Valid!");
        }
        else{
            alert("Not Valid!");
        }*/
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];
        for (i = initiator; i <= parentObj.noOfFloors; i++) {
            for (j = 1; j < formObj.length; j++) {
                var unitObj = {};
                var unitNo = unitNosArr[j - 1];
                unitNo = i + '' + parentObj.seperator + unitNo;
                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
                unitObj.UnitDtls_Unit_type_id = parentObj.type;
                unitObj.UnitDtls_Block_Id = parentObj.block;
                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
                unitObj.UnitDtls_No = unitNo;
                unitObj.UnitDtls_Name = formObj[j].unitName;
                unitObj.UnitDtls_Type = formObj[j].unitType;
                unitObj.UnitDtls_Balcn = formObj[j].unitBalconies;
                unitObj.UnitDtls_BRoom = formObj[j].unitBathrooms;
                unitObj.UnitDtls_Rooms = formObj[j].unitBedroom;
                unitObj.UnitDtls_Msrmnt = formObj[j].unitCarpetArea;
                unitObj.UnitDtls_Directn = formObj[j].unitPosition;
                unitObj.UnitDtls_Floor = i;
                unitObj.UnitDtls_Premium = formObj[j].unitPremium;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_BuliltupArea = formObj[j].unitSuperArea;
                unitObj.UnitDtls_Status = 1;
                unitsJson.push(unitObj);
            }

        }
        unitsJson = JSON.stringify(unitsJson);
        console.log(unitsJson);
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Save",
            ContentType: 'application/json',
            data: unitsJson
        }).success(function(data) {
            console.log(data);
            var res = data.Comm_ErrorDesc;
            var resSplit = res.split('|');
            console.log(resSplit[0]);
            if (resSplit[0] == 0) {
                $state.go("/Units", {
                    projId: $scope.projectId,
                    phaseId: $scope.phaseId,
                    blockId: parentObj.block
                });
            }
        }).error(function() {});
    };
	
	$scope.checkBlockUnits = function(blockId) {
		if(blockId == undefined){
			return;
		}
		var compId = $cookieStore.get('comp_guid');
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, blockId).then(function(response) {
            $scope.units = response.data[0];
			$scope.blockFloorUnits = response.data[1].Blocks_UnitPerfloor;
            $scope.UnitsArr = [];
            for (i = 0; i < $scope.units.length; i++) {
                var unitObj = {};
                unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                unitObj.UnitDtls_Name = $scope.units[i].UnitDtls_Name;
                unitObj.UnitDtls_Type = $scope.units[i].UnitDtls_Type;
                unitObj.UnitDtls_Rooms = $scope.units[i].UnitDtls_Rooms + "";
                unitObj.UnitDtls_BRoom = $scope.units[i].UnitDtls_BRoom + "";
                unitObj.UnitDtls_Balcn = $scope.units[i].UnitDtls_Balcn + "";
                unitObj.UnitDtls_BuliltupArea = $scope.units[i].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Msrmnt = $scope.units[i].UnitDtls_Msrmnt;
                unitObj.UnitDtls_Premium = $scope.units[i].UnitDtls_Premium + "";
                unitObj.UnitDtls_Directn = $scope.units[i].UnitDtls_Directn;
                unitObj.UnitDtls_Floor = $scope.units[i].UnitDtls_Floor;
                unitObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                $scope.UnitsArr.push(unitObj);			
            }			
			console.log($scope.UnitsArr);
            angular.element(".loader").hide();
        });
    };
});
app.controller("units", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.title = "Units";

    $scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.phaseListFun = function(projectName) {
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    if ($stateParams.projId != "") {
        $scope.projectListFun();
        $scope.disableProject = true;
    }
    if ($stateParams.phaseId != "") {
        $scope.phaseListFun($stateParams.projId);
        $scope.disablePhase = true;
    }
    if ($stateParams.blockId != "") {
        $scope.blockListFun($stateParams.phaseId, $cookieStore.get('comp_guid'));
        $scope.disableBlock = true;
    }
    $scope.unts = {
        projectName: $stateParams.projId,
        phase: $stateParams.phaseId,
        block: $stateParams.blockId
    };
    $scope.unitListFun = function(compId, blockId) {
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, blockId).then(function(response) {
            $scope.units = response.data[0];
            console.log($scope.units);
            $scope.UnitsArr = [];
            for (i = 0; i < $scope.units.length; i++) {
                var unitObj = {};
                unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                unitObj.UnitDtls_Name = $scope.units[i].UnitDtls_Name;
                unitObj.UnitDtls_Type = $scope.units[i].UnitDtls_Type;
                unitObj.UnitDtls_Rooms = $scope.units[i].UnitDtls_Rooms + "";
                unitObj.UnitDtls_BRoom = $scope.units[i].UnitDtls_BRoom + "";
                unitObj.UnitDtls_Balcn = $scope.units[i].UnitDtls_Balcn + "";
                unitObj.UnitDtls_BuliltupArea = $scope.units[i].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Msrmnt = $scope.units[i].UnitDtls_Msrmnt;
                unitObj.UnitDtls_Premium = $scope.units[i].UnitDtls_Premium + "";
                unitObj.UnitDtls_Directn = $scope.units[i].UnitDtls_Directn;
                unitObj.UnitDtls_Floor = $scope.units[i].UnitDtls_Floor;
                unitObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                $scope.UnitsArr.push(unitObj);
            }
            angular.element(".loader").hide();
        });
    };

    $scope.unitListFun($cookieStore.get('comp_guid'), $stateParams.blockId);

    $scope.addBlockUnit = function(formObj, formName, parentObj) {
        for (i = 0; i < formObj.length; i++) {
            formObj[i].UnitDtls_comp_guid = $cookieStore.get('comp_guid');
            formObj[i].UnitDtls_Unit_type_id = 3;
            formObj[i].UnitDtls_Block_Id = parentObj.block;
            formObj[i].UnitDtls_user_id = $cookieStore.get('user_id');
        }

        console.log(formObj);

        var unitsData = JSON.stringify(formObj);

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Update",
            ContentType: 'application/json',
            data: unitsData
        }).success(function(data) {
            console.log(data);
            alert('Sucess');
        }).error(function() {});
    }
});
app.controller("costSheetTemplate", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal) {
    $scope.title = "Cost Sheet Template";

    $scope.costSheetTemplate = {
        Untctcm_Ascending: '',
    };
    $scope.addCostComponent = function() {
        var trCount = $(".formulaTable > tr").length;
        var increment = trCount + 1;
        if (increment >= 7) {
            increment = increment + 1;
        }
        if (increment >= 20) {
            return;
        }
        var costComponentRow = '<tr> <td> <label>Code' + increment + '</label> </td> <td> <input type="text" class="form-control" name="Untctcm_code' + increment + '" ng-model="costSheetTemplate.Untctcm_code' + increment + '"/> </td> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="Untctcm_name' + increment + '" ng-model="costSheetTemplate.Untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="Untctcm_calctyp' + increment + '" ng-model="costSheetTemplate.Untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="0"> Flat </option> <option value="1"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="Untctcm_val_formula' + increment + '" ng-model="costSheetTemplate.Untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal(' + increment + ')" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="Untctcm_comments' + increment + '" ng-model="costSheetTemplate.Untctcm_comments' + increment + '"/> </td></tr>';

        costComponentRow = $compile(costComponentRow)($scope);
        angular.element(".formulaTable").append(costComponentRow);
    };

    $scope.toggleFields = function(increment) {
        var fieldName = "Untctcm_calctyp" + increment;
        if ($scope.costSheetTemplate[fieldName] == 0) {
            $("input[name='Untctcm_val_formula" + increment + "']").attr("disabled", false);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", true);
        } else {
            $("input[name='Untctcm_val_formula" + increment + "']").attr("disabled", true);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", false);
        }
    };

    $scope.openFormulaModal = function(val) {
        var modalInstance = $uibModal.open({
            templateUrl: 'formula.html',
            controller: 'costComponentFormula',
            scope: $scope,
            size: 'md',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return val;
                }
            }
        });
    };

    $scope.saveCostSheetTemplate = function(formName, formObj) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            formObj.Untctcm_comp_guid = $cookieStore.get('comp_guid');
            formObj.Untctcm_Blocks_Id = 0;
            formObj.Untctcm_SBA = 0;
            formObj.Untctcm_SiteArea = 0;

            console.log(formObj);

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Save",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go("/CostSheetTemplates");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });

        }
    };
});
app.controller("costComponentFormula", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, item) {
    $scope.formulaGen = "";
    $scope.fieldCount = item;
    var fieldName = "Untctcm_val_formula" + item;
    $scope.close = function() {
        $uibModalInstance.close();
    };
    $scope.addFormula = function(formName, formObj) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var formula = formObj.abbreviation + formObj.operator + formObj.value
            console.log(formula);
            $scope.formulaGen = formula;
            /*angular.element("#Untctcm_val_formula"+item).val(formula);*/
        }
    };
    $scope.saveFormula = function() {
        if ($scope.formulaGen != "") {
            $scope.costSheetTemplate[fieldName] = $scope.formulaGen;
            $uibModalInstance.close();
        }
    };
});

app.controller("costSheetTemplates", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal) {
    $scope.title = "Cost Sheet Templates";
    ($scope.getCostSheetTemplates = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "Untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "Untctcm_Id": 0,
                "Untctcm_Blocks_Id": 0
            }
        }).success(function(data) {
            console.log(data);
            $scope.costSheetTemplates = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
	
	$scope.showTemplateDetails = function(obj){
		console.log(obj);
		var modalInstance = $uibModal.open({
            templateUrl: 'costSheetDetail.html',
            controller: 'costSheetDetail',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return obj;
                }
            }
        });
	};
});

app.controller("costSheetDetail", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModalInstance, item) {
	$scope.costSheetDetail = item;
	$scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("blockStageController", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $rootScope, myService) {
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    $scope.phaseListFun = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.getBlockStageList = function(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/ByblockstageBlockId",
            ContentType: 'application/json',
            data: {
                "blockstageCompGuid": $cookieStore.get('comp_guid'),
                "blockstageBlockId": blockId
            }
        }).success(function(data) {
            $rootScope.blockStageList = data;
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.addStatusChange = function(blockId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'blockStatusChange.html',
            controller: 'blockStageChangeController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    var blocks = {};
                    blocks.blockId = blockId;
                    blocks.action = 'add';
                    return blocks;
                }
            }
        });
    };

    $scope.editStatusChange = function(blockstageId, currentBlockId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'blockStatusChange.html',
            controller: 'blockStageChangeController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    var blocks = {};
                    blocks.blockstageId = blockstageId;
                    blocks.action = 'edit';
                    blocks.blockId = currentBlockId;
                    return blocks;
                }
            }
        });
    };
});

app.controller("blockStageChangeController", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, $rootScope, item) {

    ($scope.getBlockStageDetail = function() {
        if (item.action == 'add') {
            $scope.blockStage = {
                completed: "0",
                action: "add"
            };
        }
        if (item.action == 'edit') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/ByblockstageId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageId": item.blockstageId
                }
            }).success(function(data) {
                $scope.blockStage = {
                    completed: data.blocksatgeCompleted + "",
                    name: data.blockstageName,
                    action: "edit"
                };
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    })();

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.addBlockStage = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/Save",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageName": formObj.name,
                    "blocksatgeCompleted": parseInt(formObj.completed),
                    "blockstageBlockId": item.blockId
                }
            }).success(function(data) {
                $uibModalInstance.close();
                getBlockStageList(data.blockstageBlockId);
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    function getBlockStageList(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/ByblockstageBlockId",
            ContentType: 'application/json',
            data: {
                "blockstageCompGuid": $cookieStore.get('comp_guid'),
                "blockstageBlockId": blockId
            }
        }).success(function(data) {
            $rootScope.blockStageList = data;
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.editBlockStage = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/BlockStage/Update",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageName": formObj.name,
                    "blocksatgeCompleted": parseInt(formObj.completed),
                    "blockstageBlockId": item.blockId,
                    "blockstageId": item.blockstageId
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getBlockStageList(data.blockstageBlockId);
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };
});

app.controller("paymentScheduleController", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $rootScope, myService) {
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    $scope.phaseListFun = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.getPaymentScheduleList = function(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
                console.log(data);
                $rootScope.paymentScheduleList = data;
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };

    $scope.editPaymentSchedule = function(paymentSchduleObj) {
        var modalInstance = $uibModal.open({
            templateUrl: 'paymentScheduleChange.html',
            controller: 'paymentScheduleChangeController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return paymentSchduleObj;
                }
            }
        });
    };
});

app.controller("paymentScheduleChangeController", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, $rootScope, item) {

    ($scope.getPaymentScheduleDetail = function() {
        $scope.blockStage = {
            paymentScheduleValue: item.PaymentScheduleCalcValue
        };
    })();

    $scope.updatePaymentSchedule = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/Update",
                ContentType: 'application/json',
                data: {
                    "PaymentScheduleId": item.PaymentScheduleId,
                    "PaymentScheduleBlockstageId": item.blockstageId,
                    "PaymentScheduleCompGuid": $cookieStore.get('comp_guid'),
                    "PaymentScheduleCalcTypeValue": 1,
                    "PaymentScheduleCalcValue": formObj.paymentScheduleValue
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getPaymentScheduleList(item.blockstageBlockId);
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    function getPaymentScheduleList(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
                console.log(data);
                $rootScope.paymentScheduleList = data;
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("employeeDetailsController", function($scope, $http, $cookieStore, $state) {

    ($scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.employees = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
});

app.controller("heirarchyController", function($scope, $http, $cookieStore, $state) {

    ($scope.heirarchyDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/DeptHeirarchy",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')           
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.dept_heirarchy = data[0]; 
            var datasource= $scope.dept_heirarchy;
    
            $('#chart-container').orgchart({
              'data' : datasource,
              'depth': 999,          
              'nodeContent': 'dept_head_name',
              'nodeId': 'dept_id'
            });

        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
});

app.controller("addEmployeeController", function($scope, $http, $state, $cookieStore, $compile, $stateParams, $window) {
    $scope.pageTitle = "Add Employee";
    $scope.addEmployeeBtn = true;

    $scope.addEmployee = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_type": 2,
                    "user_first_name": formObj.employeeFirstName,
                    "user_middle_name": formObj.employeeMiddleName,
                    "user_last_name": formObj.employeeLastName,
                    "user_mobile_no": formObj.employeeMobileNumber,
                    "user_address": formObj.employeeAddress,
                    "user_dob": formObj.employeeDob,
                    "user_doj": formObj.employeeDoj,
                    "user_email_address": formObj.employeeEmail,
                    "user_password": formObj.employeePassword,
                    "Emp_pan": formObj.employeePanNumber,
                    "Emp_aadhar": formObj.employeeAadharNumber,
                    "Emp_ctc": formObj.employeeCtc,
                    "Emp_netSallary": formObj.employeeNetSalary,
                    "Emp_desig": formObj.employeeDesignation,
                    "Emp_BankName": formObj.employeeBankName,
                    "Emp_BankBranch": formObj.employeeBankBranch,
                    "Emp_bankaccno": formObj.employeeBankAccountNo,
                    "Emp_bankadd": formObj.employeeBankAddress,
                    "Emp_bankemailid": formObj.employeeBankEmailId,
                    "Emp_bankifsccode": formObj.employeeBankIfscCode,
                    "Emp_alt_contactno": formObj.employeeAlternateNumber1,
                    "Emp_off_email": formObj.employeeAlternateEmail,
                    "Emp_Hobbies": formObj.employeeHobbies,
                    "Emp_Reference1Address": formObj.employeeReference1Address,
                    "Emp_Reference1ContactNumber": formObj.employeeReference1ContactNumber,
                    "Emp_Reference1EmailID": formObj.employeeReference1Email,
                    "Emp_Reference1Name": formObj.employeeReference1Name,
                    "Emp_Reference2Address": formObj.employeeReference2Address,
                    "Emp_Reference2ContactNumber": formObj.employeeReference2ContactNumber,
                    "Emp_Reference2EmailID": formObj.employeeReference2Email,
                    "Emp_Reference2Name": formObj.employeeReference2Name,
                    "Emp_SourceofRecruitment": formObj.employeeSourceOfRecruit,
                    "Emp_spouse_aadhar": formObj.employeeSpouseAadhar,
                    "Emp_spouse_dob": formObj.employeeSpouseDob,
                    "Emp_spouse_nm": formObj.employeeSpouseName,
                    "Emp_spouse_pan": formObj.employeeSpousePan,
                    "Emp_child1_dob": formObj.employeeChild1Dob,
                    "Emp_child1_nm": formObj.employeeChild1Name,
                    "Emp_child2_dob": formObj.employeeChild2Dob,
                    "Emp_child2_nm": formObj.employeeChild2Name,
                    "Emp_child3_dob": formObj.employeeChild3Dob,
                    "Emp_child3_nm": formObj.employeeChild3Name,
                    "Emp_child4_dob": formObj.employeeChild4Dob,
                    "Emp_child4_nm": formObj.employeeChild4Name,
                    "Emp_noof_childrn": formObj.employeeChildrenNo
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/EmployeeDetails");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    $scope.appendFields = function(noOfChild) {
        angular.element("#children").html('');
        for (i = 1; i <= noOfChild; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="addEmployee.employeeChild' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="addEmployee.employeeChild' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);
        }
    };
});

app.controller("editEmployeeController", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Edit Employee";
    $scope.editEmployeeBtn = true;
    $scope.employeeId = $stateParams.employeeId;

    ($scope.getEmployeeDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeUserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.employeeId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            
            var dateArray = [];
            dateArray.push((data.user_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.user_dob, 'yyyy-MM-dd'));
            dateArray.push((data.user_doj == '0001-01-01T00:00:00') ? '' : $filter('date')(data.user_doj, 'yyyy-MM-dd'));
            dateArray.push((data.Emp_spouse_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_spouse_dob, 'yyyy-MM-dd'));
            dateArray.push((data.Emp_child1_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child1_dob, 'yyyy-MM-dd'));
            dateArray.push((data.Emp_child2_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child2_dob, 'yyyy-MM-dd'));
            dateArray.push((data.Emp_child3_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child3_dob, 'yyyy-MM-dd'));
            dateArray.push((data.Emp_child4_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child4_dob, 'yyyy-MM-dd'));
            
            $scope.addEmployee = {
                employeeFirstName: data.user_first_name,
                employeeMiddleName: data.user_middle_name,
                employeeLastName: data.user_last_name,
                employeeMobileNumber: parseInt(data.user_mobile_no),
                employeeAddress: data.user_address,
                employeeDob: dateArray[0],
                employeeDoj: dateArray[1],
                employeeEmail: data.user_email_address,
                employeePassword: data.user_password,
                employeeAadharNumber: parseInt(data.Emp_aadhar),
                employeePanNumber: data.Emp_pan,
                employeeCtc: data.Emp_ctc,
                employeeNetSalary: data.Emp_netSallary,
                employeeDesignation: data.Emp_desig,
                employeeBankName: data.Emp_BankName,
                employeeBankBranch: data.Emp_BankBranch,
                employeeBankAccountNo: data.Emp_bankaccno,
                employeeBankAddress: data.Emp_bankadd,
                employeeBankEmailId: data.Emp_bankemailid,
                employeeBankIfscCode: data.Emp_bankifsccode,
                employeeAlternateNumber1: parseInt(data.Emp_alt_contactno),
                employeeAlternateEmail: data.Emp_off_email,
                employeeHobbies: data.Emp_Hobbies,
                employeeReference1Address: data.Emp_Reference1Address,
                employeeReference1ContactNumber: data.Emp_Reference1ContactNumber,
                employeeReference1Email: data.Emp_Reference1EmailID,
                employeeReference1Name: data.Emp_Reference1Name,
                employeeReference2Address: data.Emp_Reference2Address,
                employeeReference2ContactNumber: data.Emp_Reference2ContactNumber,
                employeeReference2Email: data.Emp_Reference2EmailID,
                employeeReference2Name: data.Emp_Reference2Name,
                employeeSourceOfRecruit: data.Emp_SourceofRecruitment,
                employeeSpouseAadhar: parseInt(data.Emp_spouse_aadhar),
                employeeSpouseDob: dateArray[2],
                employeeSpouseName: data.Emp_spouse_nm,
                employeeSpousePan: data.Emp_spouse_pan,
                employeeChild1Dob: dateArray[3],
                employeeChild1Name: data.Emp_child1_nm,
                employeeChild2Dob: dateArray[4],
                employeeChild2Name: data.Emp_child2_nm,
                employeeChild3Dob: dateArray[5],
                employeeChild3Name: data.Emp_child3_nm,
                employeeChild4Dob: dateArray[6],
                employeeChild4Name: data.Emp_child4_nm,
                employeeChildrenNo: data.Emp_noof_childrn
            };
            appendFields(data.Emp_noof_childrn);
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.editEmployee = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUserEmployee",
                ContentType: 'application/json',
                data: {
                    "Emp_comp_guid": $cookieStore.get('comp_guid'),
                    "Emp_User_Id": $scope.employeeId,
                    "user_first_name": formObj.employeeFirstName,
                    "user_middle_name": formObj.employeeMiddleName,
                    "user_last_name": formObj.employeeLastName,
                    "user_mobile_no": formObj.employeeMobileNumber,
                    "user_address": formObj.employeeAddress,
                    "user_dob": formObj.employeeDob,
                    "user_doj": formObj.employeeDoj,
                    "user_email_address": formObj.employeeEmail,
                    "user_password": formObj.user_password,
                    "Emp_pan": formObj.employeePanNumber,
                    "Emp_aadhar": formObj.employeeAadharNumber,
                    "Emp_ctc": formObj.employeeCtc,
                    "Emp_netSallary": formObj.employeeNetSalary,
                    "Emp_desig": formObj.employeeDesignation,
                    "Emp_BankName": formObj.employeeBankName,
                    "Emp_BankBranch": formObj.employeeBankBranch,
                    "Emp_bankaccno": formObj.employeeBankAccountNo,
                    "Emp_bankadd": formObj.employeeBankAddress,
                    "Emp_bankemailid": formObj.employeeBankEmailId,
                    "Emp_bankifsccode": formObj.employeeBankIfscCode,
                    "Emp_alt_contactno": formObj.employeeAlternateNumber1,
                    "Emp_off_email": formObj.employeeAlternateEmail,
                    "Emp_Hobbies": formObj.employeeHobbies,
                    "Emp_Reference1Address": formObj.employeeReference1Address,
                    "Emp_Reference1ContactNumber": formObj.employeeReference1ContactNumber,
                    "Emp_Reference1EmailID": formObj.employeeReference1Email,
                    "Emp_Reference1Name": formObj.employeeReference1Name,
                    "Emp_Reference2Address": formObj.employeeReference2Address,
                    "Emp_Reference2ContactNumber": formObj.employeeReference2ContactNumber,
                    "Emp_Reference2EmailID": formObj.employeeReference2Email,
                    "Emp_Reference2Name": formObj.employeeReference2Name,
                    "Emp_SourceofRecruitment": formObj.employeeSourceOfRecruit,
                    "Emp_spouse_aadhar": formObj.employeeSpouseAadhar,
                    "Emp_spouse_dob": formObj.employeeSpouseDob,
                    "Emp_spouse_nm": formObj.employeeSpouseName,
                    "Emp_spouse_pan": formObj.employeeSpousePan,
                    "Emp_child1_dob": formObj.employeeChild1Dob,
                    "Emp_child1_nm": formObj.employeeChild1Name,
                    "Emp_child2_dob": formObj.employeeChild2Dob,
                    "Emp_child2_nm": formObj.employeeChild2Name,
                    "Emp_child3_dob": formObj.employeeChild3Dob,
                    "Emp_child3_nm": formObj.employeeChild3Name,
                    "Emp_child4_dob": formObj.employeeChild4Dob,
                    "Emp_child4_nm": formObj.employeeChild4Name,
                    "Emp_noof_childrn": formObj.employeeChildrenNo
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/EmployeeDetails");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    $scope.appendFields = function(noOfChild) {
        angular.element("#children").html('');
        for (i = 1; i <= noOfChild; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="addEmployee.employeeChild' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="addEmployee.employeeChild' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);
        }
    };
    
    function appendFields(noOfChild) {
        angular.element("#children").html('');
        for (i = 1; i <= noOfChild; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="addEmployee.employeeChild' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="addEmployee.employeeChild' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);
        }
    };
});

app.controller("salaryComponentDetailsController", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $rootScope) {
    
    ($scope.getSalaryComponentDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalaryHeadsGet",
            ContentType: 'application/json',
            data: {
                "SalHeads_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $rootScope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.editSalaryComponent = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSalaryComponent.html',
            controller: 'editSalaryComponentController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.salaryComponentDetails[selectedItem];
                }
            }
        });
    };
    
    $scope.addSalaryComponent = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSalaryComponent.html',
            controller: 'addSalaryComponentController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return 0;
                }
            }
        });
    };
});

app.controller("addSalaryComponentController", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Add Salary Component";
    $scope.addSalaryComponentBtn = true;
    
    $scope.addSalaryComponent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalaryHeadsInsert",
                ContentType: 'application/json',
                data: {
                    "SalHeads_comp_guid" : $cookieStore.get('comp_guid'),
                    "SalHeads_Name" : formObj.salaryComponentName,
                    "SalHead_Paytyp" : formObj.salaryPayType,
                    "SalHead_TxSts" : formObj.salaryTaxStatus,
                    "SalHead_CalTyp" : formObj.salaryCalculationType,
                    "SalHead_CalTypVal" : formObj.salaryCalculationValue,
                    "SalHead_PrtofCTC" : formObj.salaryPartOfCtc,
                    "SalHead_VarFxd":formObj.salaryComponentType,
                    "SalHead_Code": formObj.salaryAbbreviation
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getSalaryComponentDetails();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    function getSalaryComponentDetails() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalaryHeadsGet",
            ContentType: 'application/json',
            data: {
                "SalHeads_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $rootScope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("editSalaryComponentController", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Edit Salary Component";
    $scope.editSalaryComponentBtn = true;
    
    ($scope.getSalaryComponentDetails = function() {
        console.log(item);
        $scope.addSalaryComponent = {
            salaryComponentName: item.SalHeads_Name,
            salaryAbbreviation: item.SalHead_Code,
            salaryPayType: item.SalHead_Paytyp+'',
            salaryTaxStatus: item.SalHead_TxSts,
            salaryCalculationType: item.SalHead_CalTyp+'',
            salaryCalculationValue: item.SalHead_CalTypVal,
            salaryPartOfCtc: item.SalHead_PrtofCTC,
            salaryComponentType: item.SalHead_VarFxd
        };
    })();
    
    $scope.editSalaryComponent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalaryHeadsUpdate",
                ContentType: 'application/json',
                data: {
                    "SalHeads_Id":item.SalHeads_Id,
                    "SalHeads_comp_guid" : $cookieStore.get('comp_guid'),
                    "SalHeads_Name" : formObj.salaryComponentName,
                    "SalHead_Paytyp" : formObj.salaryPayType,
                    "SalHead_TxSts" : formObj.salaryTaxStatus,
                    "SalHead_CalTyp" : formObj.salaryCalculationType,
                    "SalHead_CalTypVal" : formObj.salaryCalculationValue,
                    "SalHead_PrtofCTC" : formObj.salaryPartOfCtc,
                    "SalHead_VarFxd":formObj.salaryComponentType,
                    "SalHead_Code": formObj.salaryAbbreviation
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getSalaryComponentDetails();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    function getSalaryComponentDetails() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SalaryHeadsGet",
            ContentType: 'application/json',
            data: {
                "SalHeads_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $rootScope.salaryComponentDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("addDepartmentController", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    
    ($scope.getParentDepartmentDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/Department",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.parentDepartmentList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    ($scope.getManagerNameDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid" : $cookieStore.get('comp_guid'),
                "user_type" :2
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.managersList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.addNewDepartment = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SaveDept",
                ContentType: 'application/json',
                data: {
                    "dept_compguid" : $cookieStore.get('comp_guid'),
                    "dept_branchid" : formObj.branchName,
                    "dept_name" : formObj.departmentName,
                    "dept_head_userid" : formObj.managerName,
                    "dept_parentid": formObj.parentDepartment
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/Heirarchy");
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
});