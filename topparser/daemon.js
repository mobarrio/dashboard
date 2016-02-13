#!/usr/bin/env node

var topparser   = require("./topparser");
var spawn 	= require('child_process').spawn;
var proc 	= null;
var startTime 	= 0;
var pid_limit   = 5;
var callback    = null;
var interval    = 5;
var top_data    = "";

startTime =  new Date().getTime();
proc      = spawn('top', ['-b',"-d", interval]);
// console.log("started process, pid: "+proc.pid);

proc.stdout.on('data', function (data) {
	//console.log('stdout: ' + data);
	top_data+=data.toString();
	processData(top_data);
});

proc.on('close', function (code) { console.log('child process exited with code ' + code); });

var processData = function (_data){
	var start=_data.indexOf("top - ");
	var end=_data.indexOf("top - ",start+1);
	if(end==-1||end==start){return}
	var data=_data.slice(start,end);
	var result=topparser.parse(data,pid_limit);
	if(callback){callback(null,result)}
	console.log(JSON.stringify(result));
	top_data="";
}//processData
