#!/usr/bin/env node

var os = require("os");

function parseFS(_result,_line){
	var items=_line.split(":");
	var fsline={
			fsuse:items[0],
			fsmounted:items[1],
			fssize:items[2],
			fsused:items[3],
			fsavail:items[4],
			fsfilesystem:items[5]
	};
	if(items[0] !== undefined && items[0] !== '') _result.data.fs.push(fsline);
}//parseFS

function parse(data, pid_limit){
    if(!data){return}
    var result={};
    result.data={};
    var data_line=data.split("\n");

    result.data.fs=[];
    for (var i in data_line) {
    	parseFS(result,data_line[i]);
    }
    result.data.time = new Date().getTime();
    return result;
}//parse

exports.parse=parse;
