var tconfig;
var myObj = "";
var ftpurl = "http://47.95.248.121:30010/";
//onload page
$(function() {
	LoginStatus("UserDuedateCheck","appcontrol.html"); 
	
    LoadJsonFile();
    $("#messageone").on("change", function(){
        if($(this).val().trim().length != 0){
            $("#uninstallalertone").hide();
            $("#launchalertone").hide();
        }        
    })

    $("#messagetwo").on("change", function(){
        if($(this).val().trim().length != 0){
            $("#uninstallalerttwo").hide();
            $("#launchalerttwo").hide();
        }
    })
});
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
		SetHTML("barset_appcontrol");
		GetAllDevices();
		//$("#appFilter").html(filter).selectpicker('refresh');
		var filter = [];
	});
}

var selectedDeviceId;
var selectedDeviceIdtwo;
var ReturnCount = 0;
var AllOptions = "";
function GetDeviceDetails(deviceid,cid){
    if(cid == "one"){
        selectedDeviceIdtwo = null;
        selectedDeviceId = deviceid;
    }else if(cid == "two"){
        selectedDeviceId = null;
        selectedDeviceIdtwo = deviceid;
    }
	if(company === "Guest"){
		$("a[href='#device']").addClass( "hide" );
		SendByGolang(deviceid+"/", GetCommand(97, "Comm"), GetCommand(97, "CommTitle"), "", "system");	
	}else{
		SendByGolang(deviceid+"/", GetCommand(97, "Comm")+"@%@"+GetCommand(97, "Path")+"@%@;;;"+GetCommand(97, "Param"), GetCommand(97, "CommTitle"), "", "system");	
	}
	
	// device management
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
            if(ReturnCount >=2){
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
            if(ReturnCount >=2){
                ReturnCount = 0;
                $('#UpdateTimetwo').html(DateToTime(new Date()));
            }
        }
    }

	
}

function StopSystemRequire(deviceid){
	SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;requireStopAPP;;;1;;;2000;;;10", GetCommand(27, "CommTitle"), "Stop", "system");	
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
	$.post("http://172.21.73.144:9090",
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

function ChangeIdtoName(data, id){
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === id){
			return data[i][1];
		}
	}
	return false;
}

function installapp(cid){ 
        var selecteddid = getselecteddid(cid)
        if(selecteddid == false){
            return 
        }
        var appid = $("#applist"+cid).val();
        var select = document.getElementById("applist"+cid);
        var appname = select.options[select.selectedIndex].text;
        appid = appid.trim();
        appname = appname.trim();
        var DownloadPath = ftpurl+appname;
        SendByGolang(selecteddid+"/", GetCommand(8, "Comm")+"@%@"+DownloadPath+";;;"+appname, GetCommand(8, "CommTitle"), appname, "user");
        setTimeout(function(){
            GetDeviceDetails(selecteddid,cid);
        }, 15000);
        UpdateDone(selecteddid)
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

function uninstallapp(cid){
        var selecteddid = getselecteddid(cid)
        if(selecteddid == false){
            return 
        }
        var appid = $("#appinstalled"+cid).val();
        if(appid != null)
        appid = appid.trim();
        var msg = $("#message"+cid).val().trim();
        if(msg == ""){
            $("#uninstallalert"+cid).show();
            $("#launchalert"+cid).hide();
            return;
        }else{
            $("#uninstallalert"+cid).hide();
            $("#launchalert"+cid).hide();
        }
        SendByGolang(selecteddid+"/", GetCommand(53, "Comm")+";;;"+msg, GetCommand(53, "Comm"), msg, "user")
        SendByGolang(selecteddid+"/", GetCommand(9, "Comm")+"@%@;;;"+appid, GetCommand(9, "CommTitle"), appid, "user");
        GetDeviceDetails(selecteddid,cid)
        UpdateDone(selecteddid)
}

function lanunchapp(cid){
    var selecteddid = getselecteddid(cid)
    if(selecteddid == false){
        return 
    }
    var appid = $("#lanunch"+cid).val();
    var msg = $("#message"+cid).val().trim();
    if(msg == ""){
        $("#uninstallalert"+cid).hide();
        $("#launchalert"+cid).show();
        return;
    }else{
        $("#uninstallalert"+cid).hide();
        $("#launchalert"+cid).hide();
    }
    if(appid != null)
    appid = appid.trim();
    SendByGolang(selecteddid+"/", GetCommand(53, "Comm")+";;;"+msg, GetCommand(53, "Comm"), msg, "user")
    SendByGolang(selecteddid+"/", GetCommand(10, "Comm")+"@%@"+appid, GetCommand(10, "CommTitle"), appid, "user");		
    UpdateDone(selecteddid)
}

function addmessage(e,cid){
    var appid = e.options[e.selectedIndex].text;
    if(cid == "launch_one"){
        var msg =appid+" will run";
        $("#messageone").val(msg);
    }else　if(cid == "launch_two"){
        var msg =appid+" will run";
        $("#messagetwo").val(msg)
    }else if(cid == "uninstall_one"){
        var msg =appid+" will uninstall";
        $("#messageone").val(msg);
    }else if(cid == "uninstall_two"){
        var msg =appid+" will uninstall";
        $("#messagetwo").val(msg)
    }
}
//Get Json command to myObj
//e.g. GetCommand(3,"CommTitle")
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

function SetAppList(deviceid, AppName, AppPackageName, AppType){

	if(deviceid == selectedDeviceId){
        if(AppType === "Third-party "){
            AllOptions = "<option value='"+AppPackageName+"'>"+AppName+"</option>";
            document.getElementById("appinstalledone").innerHTML += AllOptions;
            document.getElementById("lanunchone").innerHTML += AllOptions;
        }else{
            AllOptions = "<option value='"+AppPackageName+"'>"+AppName+"</option>";
            document.getElementById("lanunchone").innerHTML += AllOptions;
        }
      
    }else if(deviceid == selectedDeviceIdtwo){
        if(AppType === "Third-party "){
            AllOptions = "<option value='"+AppPackageName+"'>"+AppName+"</option>";
            document.getElementById("appinstalledtwo").innerHTML += AllOptions;
            document.getElementById("lanunchtwo").innerHTML += AllOptions;
        }else{
            AllOptions = "<option value='"+AppPackageName+"'>"+AppName+"</option>";
            document.getElementById("lanunchtwo").innerHTML += AllOptions;
        }
    }
    UpdateDone(deviceid);
}
function emptyApplist(deviceid){
    if(deviceid == selectedDeviceId){
        document.getElementById("appinstalledone").options.length = 0;
        document.getElementById("lanunchone").options.length = 0;
    }else if(deviceid == selectedDeviceIdtwo){
        document.getElementById("appinstalledtwo").options.length = 0;
        document.getElementById("lanunchtwo").options.length = 0;
    }
}	