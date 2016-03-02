#!/usr/bin/env node

var os = require("os");
var crypto = require('crypto');

function parseLine(_result,_name,_line){
	var line=_line.replace(RegExp("%","g"),"").split(":")[1].replace(RegExp(" ","g"),"")
		_result[_name]={}
		var line_items=line.split(",");
		for(var i=0,item=line_items[i];i<line_items.length;item=line_items[++i]){
			var value=parseFloat(item)
			if(value==0&&item.indexOf(".")!=-1){value="0.0"}
			var name=item.replace(value,"").replace(".0","")
			_result[_name][name]=parseFloat(value)
		}//for
}//parseLine

function parseProces(_result,_line){
	var items=_line.split(",");
	var process={
			pid:items[0],
			user:items[1],
			pr:items[2],
			ni:items[3],
			virt:items[4],
			res:items[5],
			shr:items[6],
			s:items[7],
			cpu:items[8],
			mem:items[9],
			time:items[10],
			command:items[11]
	};
	_result.data.process.push(process);
}//parseProces



function parse(data,pid_limit){
	if(!data){return}
	var result={};
	result.id = crypto.createHash('md5').update(os.hostname()).digest("hex");
	result.hostname = os.hostname();
	result.data={};
	result.data.os={};
	result.data.loadavg = {
		avg1:os.loadavg()[0].toFixed(4), 
		avg5:os.loadavg()[1].toFixed(4), 
		avg15:os.loadavg()[2].toFixed(4)
	};
	var data_line=data.split("\n");
	/*
	-- Top EL6.7
	top - 18:37:58 up  1:40,  7 users,  load average: 0.63, 0.76, 0.87
	Tasks: 172 total,   1 running, 171 sleeping,   0 stopped,   0 zombie
	Cpu(s):  1.3%us,  0.3%sy,  0.0%ni, 98.2%id,  0.2%wa,  0.0%hi,  0.0%si,  0.0%st
	Mem:   8193704k total,  5033148k used,  3160556k free,    91056k buffers
	Swap:  4128764k total,        0k used,  4128764k free,  2779588k cached

	-- Top CentOS
	top - 18:51:40 up 5 days,  9:19,  2 users,  load average: 0.00, 0.01, 0.05
	Tasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie
	%Cpu(s):  0.2 us,  0.0 sy,  0.0 ni, 99.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
	KiB Mem :  3882108 total,  3015352 free,   183828 used,   682928 buff/cache
	KiB Swap:  4190204 total,  4190204 free,        0 used.  3423452 avail Mem 
	*/
	parseLine(result.data,"task",data_line[1]);
	parseLine(result.data,"cpu",data_line[2].replace("us,","user,").replace("sy,","system,").replace("id,"," idle,"));
	result.data.cpus     = os.cpus();
	parseLine(result.data,"ram",data_line[3].replace(RegExp("k ","g")," ").replace("buff/cache","buff_cache").replace("buffers","buff_cache") );
	parseLine(result.data,"swap",data_line[4].replace(RegExp("k ","g")," ").replace("avail Mem","avail").replace("cached","avail").replace("used.","used,") );

	// Transformamos la RAM a MB
	result.data.ram.total      = Math.round(result.data.ram.total/1024).toFixed(2);
	result.data.ram.free       = Math.round(result.data.ram.free/1024).toFixed(2);
	result.data.ram.used       = Math.round(result.data.ram.used/1024).toFixed(2);
	result.data.ram.buff_cache = Math.round(result.data.ram.buff_cache/1024).toFixed(2);


	// Transformamos la SWAP a MB
	result.data.swap.total = Math.round(result.data.swap.total/1024).toFixed(2);
	result.data.swap.free  = Math.round(result.data.swap.free/1024).toFixed(2);
	result.data.swap.used  = Math.round(result.data.swap.used/1024).toFixed(2);
	result.data.swap.avail = Math.round(result.data.swap.avail/1024).toFixed(2);

	result.data.os.type     = os.type();
	result.data.os.platform = os.platform();
	result.data.os.release  = os.release();
	result.data.os.uptime  = os.uptime();
	result.data.net      = os.networkInterfaces();


	result.data.process=[];
	//process
	if(pid_limit){
		if(pid_limit>=data_line.length-1){
			pid_limit=data_line.length-1}else{pid_limit+=7;
		}
	}else{
		pid_limit=data_line.length-1;
	}//if pid_limit

	for(var i=7,item=data_line[i];i<pid_limit;item=data_line[++i]){
		if(item){
			var line=item.replace(/\s{1,}/g, ',').substring(1);
			if(line!=""){
				parseProces(result,line);
			}//if
		}//if item
	}//for process
	result.data.time = new Date().getTime();
	return result;
}//parse

exports.parse=parse;
