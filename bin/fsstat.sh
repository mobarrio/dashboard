#!/usr/bin/bash


#while true
#do
/usr/bin/df -h | /usr/bin/grep -v Filesystem | /usr/bin/awk '{print $5":"$6":"$2":"$3":"$4":"$1}' | /usr/bin/sort -nr
#sleep $1
#done
