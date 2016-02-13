#!/usr/bin/env node

var os = require("os");

function parseProces(_result,_line){
	var items=_line.split(",");
	var process={
			device:items[0],
			rrqms:items[1],
			wrqms:items[2],
			rs:items[3],
			ws:items[4],
			rkbs:items[5],
			wkbs:items[6],
			avgrqsz:items[7],
			avgqusz:items[8],
			await:items[9],
			r_await:items[10],
			w_await:items[11],
			svctm:items[12],
			util:items[13]
	};
	_result.data.process.push(process);
}//parseProces

function parseAvgCPU(_result,_name,_line){
	var line = _line.replace(RegExp(" +","g")," ").replace(RegExp("^ +","g"),"").split(" ");
    if(!_line.length) return;
    _result[_name]={}
    _result[_name]['user']   = parseFloat(line[0]);
    _result[_name]['nice']   = parseFloat(line[1]);
    _result[_name]['system'] = parseFloat(line[2]);
    _result[_name]['iowait'] = parseFloat(line[3]);
    _result[_name]['steal']  = parseFloat(line[4]);
    _result[_name]['idle']   = parseFloat(line[5]);
}//parseAvgCPU

function parse(data, pid_limit){
    if(!data){return}
    var result={};
    result.data={};
    var data_line=data.substring(data.indexOf("avg-cpu:")).split("\n");

    // Extrae datos avg-cpu
    parseAvgCPU(result.data,"avgcpu",data_line[1]);

    result.data.process=[];
    //process
    if(pid_limit){
            if(pid_limit>=data_line.length-1){
                    pid_limit=data_line.length-1
            }else{
                    pid_limit+=4;
            }
    }else{
            pid_limit=data_line.length-1;
    }//if pid_limit

    for(var i=4,item=data_line[i];i<pid_limit;item=data_line[++i]){
            if(item){
                    var line=item.replace(/\s{1,}/g, ',');
                    if(line!=""){
                            parseProces(result,line);
                    }//if
            }//if item
    }//for process
    result.data.time = new Date().getTime();
    return result;
}//parse

exports.parse=parse;
