#!/bin/sh
#
# chkconfig: 345 99 01
# description: Dashboard 1.0
#
# vi /etc/init.d/dashgs
# chmod 755 /etc/init.d/dashgs
# chkconfig --add dashgs
# chkconfig --list

export NODE_PATH=$NODE_PATH:/usr/lib/node_modules:/var/adm/ssoo/dashboard/node_modules
case "$1" in
	start)
		RUNNING=`ps -ef|grep "/usr/bin/node /var/adm/ssoo/dashboard/bin/server.js"|grep -v grep |wc -l`
		if [ "$RUNNING" -eq "1" ]; 
		then 
		 	echo "failed. Service is running."
			exit 0; 
		fi
		echo -n "Starting dashboard..."
		exec /usr/bin/forever start -s --minUptime 10000  --spinSleepTime 1000 /var/adm/ssoo/dashboard/bin/server.js 2>&1 >/dev/null
		echo "done."
		;;
	stop)
		echo -n "Stopping dashboard..."
		exec /usr/bin/forever stop /var/adm/ssoo/dashboard/bin/server.js 2>&1 >/dev/null
		echo "done."
		;;
	restart)
		echo -n "Restarting dashboard..."
		exec /usr/bin/forever restart /var/adm/ssoo/dashboard/bin/server.js 2>&1 >/dev/null
		echo "done."
		;;
	*)
		echo "Usage: /etc/init.d/dashgs {start|stop|restart}"
		exit 1
		;;
esac

exit 0