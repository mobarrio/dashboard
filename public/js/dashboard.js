var Dashboard = (function() {
    // Locales
    var debug = 0,
  	    ncpus = 0,
  	    not_lvg = 0,
	    not_zmb = 0,
  	    not_cpu = 0,
  	    not_ram = 0,
  	    not_swp = 0,
  	    not_ios = 0,
        socket;

    var settings = {
        interval_ios: 5,
        interval_top: 5, 
        iostat: 0,
        done: function() {}
    };

	SocketStatus = function (data) { if (debug) console.log("SocketStatus - ", data.message); };

    SocketConnected = function (data) {
        if (debug) console.log("SocketConnected - ",data.message);
        socket.emit('start_top', { message: 'Iniciar Streaming TOP.' });
    };

	SocketMsgIOstat = function(msg){
		if(!msg || !msg.data || !msg.data.avgcpu) return;
		if (debug) console.log("SocketMsgIOstat - ", JSON.stringify(msg.data.avgcpu.iowait));
		// $("input[name='iostat-checkbox']").bootstrapSwitch('state', true, true);
		// $(".panel-body-iostat").css("display","");
		$("#iostat").bootstrapTable('removeAll').bootstrapTable('append', msg.data.process);
		if(msg.data.avgcpu.iowait) $("#iowait").html(msg.data.avgcpu.iowait + "%");		
	};

	SocketRefresh = function(msg){
		if(!msg) return;
		if (debug) console.log("SocketRefresh - msg.iostat: [", JSON.stringify(msg),"]");

		if(msg.iostat && msg.iostat.enabled !== null && msg.iostat.enabled !== undefined){
			if(msg.iostat.enabled === false){
				$("input[name='iostat-checkbox']").bootstrapSwitch('state', false, true);
				$(".panel-body-iostat").css("display","none");
				$("#iostat").bootstrapTable('removeAll');
			}else{
				$("input[name='iostat-checkbox']").bootstrapSwitch('state', true, true);
				$(".panel-body-iostat").css("display","");
			}
		}
		if(msg.top && msg.top.enabled !== null && msg.top.enabled !== undefined){
			if(msg.top.enabled === false){
				$("input[name='top-checkbox']").bootstrapSwitch('state', false, true);
				$(".panel-body-process").css("display","none");
				$("#top").bootstrapTable('removeAll');
			}else{
				$("input[name='top-checkbox']").bootstrapSwitch('state', true, true);
				$(".panel-body-process").css("display","");
			}
		}
	};

	SocketMsgTop = function (msg) { 
		if(!msg) return;
		$(".panel-body-process").css("display","");
		ncpus = msg.data.cpus.length;
		$("#ncpus").html(ncpus);
		$("#hostname").html(msg.hostname); 
		$("#ostype").html(msg.data.os.type); 
		$("#load1m").html(msg.data.loadavg.avg1);
		$("#load5m").html(msg.data.loadavg.avg5); 
		$("#load15m").html(msg.data.loadavg.avg15); 
		$("#task_total").html(msg.data.task.total);
		$("#task_running").html(msg.data.task.running);
		$("#task_sleeping").html(msg.data.task.sleeping);
		$("#task_stopped").html(msg.data.task.stopped);
		$("#task_zombie").html(msg.data.task.zombie);
		$("#cpu_usr").html(msg.data.cpu.user.toFixed(2));
		$("#cpu_sys").html(msg.data.cpu.system.toFixed(2));
		$("#cpu_idl").html(msg.data.cpu.idle.toFixed(2));
		// $("#release").html(msg.data.os.type + " " + msg.data.os.release);
		$("#ram_total").html(msg.data.ram.total);
		$("#ram_free").html(msg.data.ram.free);
		$("#ram_used").html(msg.data.ram.used);
		$("#ram_buff_cache").html(msg.data.ram.buff_cache);
		$("#swap_total").html(msg.data.swap.total);
		$("#swap_free").html(msg.data.swap.free);
		$("#swap_used").html(msg.data.swap.used);
		$("#swap_avail").html(msg.data.swap.avail);
		$("#procesos").bootstrapTable('removeAll').bootstrapTable('append', msg.data.process);

		// Update header info
		$("#cpuusage").html((100-msg.data.cpu.idle).toFixed(2) + "%");
		$("#memusage").html(((1-(msg.data.ram.free/msg.data.ram.total))*100).toFixed(2) + "%");
		$("#swapusage").html(((1-(msg.data.swap.free/msg.data.swap.total))*100).toFixed(2) + "%");

		// High load average
		if((msg.data.loadavg.avg1 >= ncpus) || (msg.data.loadavg.avg5 >= ncpus) || (msg.data.loadavg.avg15 >= ncpus)){
			if(!not_lvg){
				$(".load-average-status").removeClass("status-warning").removeClass("status-ok").addClass("status-alert");
				n = new Notification( "High Load Average", { body: "Attention: High Load Average on "+msg.hostname, icon : "/images/alert.jpg" });
				setTimeout(function() { n.close(); }, 10000);
				not_lvg=1;
			}
		}else if((msg.data.loadavg.avg1 >=(ncpus/2)) || (msg.data.loadavg.avg5 >= (ncpus/2)) || (msg.data.loadavg.avg15 >= (ncpus/2))){
			$(".load-average-status").removeClass("status-alert").removeClass("status-ok").addClass("status-warning");
		}else{
			$(".load-average-status").removeClass("status-warning").removeClass("status-alert"); //.addClass("status-ok");
			not_lvg=0;
		}

		// Zombie Process
		if(msg.data.task.zombie > 0){
			if(!not_zmb){
				$(".tasks-status").removeClass("status-ok").addClass("status-alert");
				n = new Notification( "Zombie Process", { body: "Attention: Detect sombie process on "+msg.hostname, icon : "/images/alert.jpg" });
				setTimeout(function() { n.close(); }, 10000);
				not_zmb = 1;
			}
		}else{
			$(".tasks-status").removeClass("status-alert"); //.addClass("status-ok");
			not_zmb = 0;
		}

		// High cpu usage
		if(msg.data.cpu.idle.toFixed(2) <= 5){
			if(!not_cpu){
				$(".cpu-status").removeClass("status-warning").removeClass("status-ok").addClass("status-alert");
				n = new Notification( "High CPU Usage", { body: "Attention: High CPU Usage on "+msg.hostname, icon : "/images/alert.jpg" });
				setTimeout(function() { n.close(); }, 10000);
				not_cpu = 1;
			}
		}else if(msg.data.cpu.idle.toFixed(2) <= 75){
			$(".cpu-status").removeClass("status-alert").removeClass("status-ok").addClass("status-warning");
		} else {
			$(".cpu-status").removeClass("status-alert").removeClass("status-warning"); //.addClass("status-ok");
			not_cpu = 0;
		}

		// High ram usage
		if((msg.data.ram.free/msg.data.ram.total).toFixed(2) <= .10 ){ // 10%
			if(!not_ram){
				$(".ram-status").removeClass("status-warning").removeClass("status-ok").addClass("status-alert");
				n = new Notification( "High Memory Usage", { body: "Attention: High Memory Usage on "+msg.hostname+" try: sync && echo 3 > /proc/sys/vm/drop_caches", icon : "/images/alert.jpg" });
				setTimeout(function() { n.close(); }, 10000);
				not_ram = 1;
			}
		}else if((msg.data.ram.free/msg.data.ram.total).toFixed(2) <= .60 ){ // 60%
			$(".ram-status").removeClass("status-alert").removeClass("status-ok").addClass("status-warning");
		} else {
			$(".ram-status").removeClass("status-alert").removeClass("status-warning"); //.addClass("status-ok");
			not_ram = 0;
		}

		// High swap usage
		if((msg.data.swap.free/msg.data.swap.total).toFixed(2) <= .35 ){ // 34%
			if(!not_swp){
				$(".swap-status").removeClass("status-warning").removeClass("status-ok").addClass("status-alert");
				n = new Notification( "High SWAP Usage", { body: "Attention: High SWAP Usage on "+msg.hostname+" try : swapoff -a && swapon -a", icon : "/images/alert.jpg" });
				setTimeout(function() { n.close(); }, 10000);
				not_swp = 1;
			}
		}else if((msg.data.swap.free/msg.data.swap.total).toFixed(2) <= .90 ){ // 90%
			$(".swap-status").removeClass("status-alert").removeClass("status-ok").addClass("status-warning");
		} else {
			$(".swap-status").removeClass("status-alert").removeClass("status-warning"); //.addClass("status-ok");
			not_swp = 0;
		}
	};

	SocketMsgOSType = function(msg){
		if(!msg) return;
		$("#release").html(msg.os);
	};

	SocketInit = function(config) {
		socket = io.connect();
		//socket.removeAllListeners();
		socket.on("msgiostat",	SocketMsgIOstat);
		socket.on("msgtop",		SocketMsgTop);
		socket.on("msgostype",	SocketMsgOSType);
		socket.on("connected",	SocketConnected);
		socket.on("status",		SocketStatus);
		socket.on("refresh",	SocketRefresh);
    };  

    SocketpreInit = function(callback) {
        if (debug) console.log("SocketpreInit - Iniciando conexion.");              
        typeof callback === 'function' && callback();
    };

	return {
        init: function(config) {
            SocketInit(config);
            SocketpreInit(function(){
                if(Notification.permission !== 'granted'){ Notification.requestPermission(); }
            });
        },
        StopIOstat: function() {
			socket.emit('stop_iostat', { message: 'Detener Streaming IOSTAT.' });
			$(".panel-body-iostat").css("display","none");
        },
        StartIOstat: function() {
			socket.emit('start_iostat', { message: 'Iniciar Streaming IOSTAT.' });
			$(".panel-body-iostat").css("display","");
        },
        StopTop: function() {
			socket.emit('stop_top', { message: 'Detener Streaming TOP.' });
			$(".panel-body-process").css("display","none");
        },
        StartTop: function() {
			socket.emit('start_top', { message: 'Iniciar Streaming TOP.' });
			$(".panel-body-process").css("display","");
        },
        SetInterval: function(interval){
        	settings.interval = interval;
        	socket.emit('changeInterval', { interval_top: interval, interval_ios: interval });
        },
        Connected: function() { return socket.socket.connected; }
    };
}());