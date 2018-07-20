var tconfig;
var myObj = "";
//onload page
$(function() {
    LoginStatus("UserDuedateCheck","devicesecurity.html"); 

    LoadJsonFile();
});

function updatedevice(){
    var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	postdata = {
		company: company,
		name: name,
		submit: "GetAllDevices"
	}
	$.post("/golang",
	postdata,
	function(data,status){
		if(data === "DeviceNotFound"){
		}else{
            var GetUpdateDevice = "";
            for(var i=0;i<Object.keys(data).length;i++){
                deviceid = data[i].DEVICEID;
                GetUpdateDevice += deviceid +"/";
            }
            SendByGolang(GetUpdateDevice, GetCommand(1, "Comm"), GetCommand(1, "Comm"), "", "system");
		}
	});
}

function lockdevice(cid){
    var selecteddid = getselecteddid(cid)
    if(!selecteddid){
        swal("","Please select your device","info")
        return;
    }
    
    var newpassword = $("#newpwd"+cid).val();
    var reg = /^[0-9]+$/
    if(!reg.test(newpassword)){
        swal("", "The lock password must be number and not empty", "info");
        return;
    }else{
        swal({
            title: "remember new password",
            text: "Once lock device, you only unlock by new password",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                SendByGolang(selecteddid+"/", GetCommand(5, "Comm")+";;;"+newpassword, GetCommand(5, "Comm"), newpassword, "user");
                UpdateDone(selecteddid)
            }
        });
    }  
}

function factory(cid){
    var selecteddid = getselecteddid(cid);
    if(!selecteddid){
        swal("","Please select your device","info")
        return;
    }
    swal({
        title: "Are you sure?",
        text: "Once Factory Reset,all information in device will lose",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            SendByGolang(selecteddid+"/", GetCommand(6, "Comm"), GetCommand(6, "CommTitle"), "factory reset", "user");
            UpdateDone(selecteddid)
        } 
    });
    
}
function cleandata(cid){
    swal({
        title: "Are you sure?",
        text: "Once clean EMMA and SD Card data, you will lose all their data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            
        } 
    });
}

function getselecteddid(cid){
    if(cid == "one"){
        var devobj = document.getElementById("devIdone");
        
    }else if(cid == "two"){
        var devobj = document.getElementById("devIdtwo");
    }
    var selecteddid = devobj.options[devobj.selectedIndex].getAttribute("data-subtext")
    if(selecteddid === null || selecteddid == "" || selecteddid == undefined){
        return false;
    }
    selecteddid = $.trim(selecteddid);
    return selecteddid;
}

var company = localStorage.getItem("Company");	var type="";
if(company === "Guest"){
	type = "assets/json/lite.txt";
}else{
	type = "assets/json/pro.txt";
}

var myObj = "";
function LoadJsonFile() {
	$.getJSON( type, function( data ) {
		myObj = data;
        SetHTML("barset_devicesecurity");
        updatedevice();
		GetAllDevices();
		//$("#appFilter").html(filter).selectpicker('refresh');
		var filter = [];
	});
}

var selectedDeviceId;
var selectedDeviceIdtwo
var ReturnCount=0;
function GetDeviceDetails(deviceid,cid){
    if(cid == "one"){
        selectedDeviceIdtwo = null;
        selectedDeviceId = deviceid;
    }else if(cid == "two"){
        selectedDeviceId = null;
        selectedDeviceIdtwo = deviceid;
    }
    document.getElementById('orgpwd'+cid).value = "123456";	
}

function UpdateDone(deviceid){
    if(deviceid == selectedDeviceId){
        ReturnCount++;
        if(localStorage.getItem("Company") === "Guest"){
            if(ReturnCount >=1){
                ReturnCount = 0;
                $('#UpdateTime').html(DateToTime(new Date()));
            }
        }else{
            if(ReturnCount >=1){
                ReturnCount = 0;
                $('#UpdateTime').html(DateToTime(new Date()));
            }
        }
    }else if(deviceid == selectedDeviceIdtwo){
        ReturnCount++;
        if(localStorage.getItem("Company") === "Guest"){
            if(ReturnCount >=1){
                ReturnCount = 0;
                $('#UpdateTimetwo').html(DateToTime(new Date()));
            }
        }else{
            if(ReturnCount >=1){
                ReturnCount = 0;
                $('#UpdateTimetwo').html(DateToTime(new Date()));
            }
        }
    }

	
}

function GetAllDevices(){
	var sub = "GetAllDevices"; var postdata = {submit: sub};
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	postdata = {
		company: company,
		name: name,
		submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		if(data === "DeviceNotFound"){
		}else{
			var DeviceDetails = [];
			for(var i=0;i<data.length;i++){
				DeviceDetails.push([data[i].DEVICEID,data[i].DEVICENAME,data[i].STATUS]);
			}
			GetDevicesId(DeviceDetails);
		}
	});
}

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('%');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}


function GetDevicesId(data){
    var txtdevice = ""; var txtOnline="";
    var txtOffline="";
    var getDevice = getUrlVars()["d"];
    var tmpCheck=false;
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === getDevice){
			if(data[i][2] === "online"){
				txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
				tmpCheck = true;
				GetDeviceDetails(data[i][0]);
            }
            else{
				txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}
			txtdevice = '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>'+ txtdevice;
			
		}else{
			if(data[i][2] === "online"){
				txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
            }
            else{
				txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
			}
			txtdevice = txtdevice+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
		}
	}
	txtOnline = '<optgroup label="Online" class="color-green" >'+ txtOnline +'</optgroup>';
	txtOffline =  '<optgroup label="Offline" class="color-red" disabled >'+ txtOffline +'</optgroup>';
	
    txtdevice = txtOnline + txtOffline;
    // console.log($("#devIdone"))
	$("#devIdone").html(txtdevice).selectpicker('refresh');
	$("#devIdone").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selectedD = $(this).find('option').eq(clickedIndex).text();
		GetDeviceDetails(ChangeNametoId(data, selectedD),"one");
	});
	if(tmpCheck)
        $('#devIdtwo').selectpicker('val', ChangeIdtoName(data, getDevice));
    $("#devIdtwo").html(txtdevice).selectpicker('refresh');
    $("#devIdtwo").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
        var selectedD = $(this).find('option').eq(clickedIndex).text();
        GetDeviceDetails(ChangeNametoId(data, selectedD),"two");
    });
    if(tmpCheck)
        $('#devIdtwo').selectpicker('val', ChangeIdtoName(data, getDevice));
}
function ChangeNametoId(data, name){
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][1] === name){
			return data[i][0];
		}
	}
	return false;
}

function GetCommand(number, title){
	var str = ""+number+""; 
	var dd = myObj[str];
	if(title === "CommTitle"){ 
		command = dd[0].CommTitle;
	}else if(title === "Enabled"){
		command = dd[1].Enabled;
	}else if(title === "Comm"){
		command = dd[2].Comm;
	}else if(title === "Param"){
		command = dd[3].Param;
	}else if(title === "Resultdelay"){
		command = dd[4].Resultdelay;
	}else if(title === "Path"){
		command = dd[5].Path;
	}else if(title === "Icon"){
		command = dd[6].Icon;
	}
	return command;
}