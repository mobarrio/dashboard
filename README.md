Dashboard Linux
===

Dashboard minimalista y no intrusiva para servers linux. Monitoriza en tiempo real Procesos CPU, Memoria y SWAPE utilizando NodeJS y Socke.IO

Dashboard minimalist and non-intrusive for Linux Servers. Monitoring in real-time Proccess, CPU, memory and Swap with NodeJS and Socke.IO

### Pre-Instalacion:

**Linux:**

```
 Install: 
 	CentOS, Redhat, Fedora: lsb_release
 	Ubuntu, Debian: lsb-release
 
 eg: CentOS 
          # yum -y install redhat-lsb-core*
     Debian 
          # apt-get install lsb-release
```


### Instalacion:

**Linux:**

```
 $ mkdir -p /var/adm/ssoo

 $ cd /var/adm/ssoo 

 $ git clone https://github.com/mobarrio/dashboard.git

 $ cd dashboard && npm install
```


**Preparamos scripts de arranque automatico:**
```
 $ npm -g install forever
   
 $ cp /var/adm/ssoo/dashboard/etc/dashgs.sh /etc/init.d/dashgs
   
 $ chmod 755 /etc/init.d/dashgs
   
 $ chkconfig --add dashgs
```

 
**Ejecutar la app en modo DEBUG:**
```
 $ DEBUG=dashboard:server

 $ npm start
```


**Ejecutar la app STANDALONE:**
```
     $ node bin/server.js
```


**Ejecutar la app via init.d (FOREVER):**
```
     $ /etc/init.d/dashgs start
```

   
**Después ejecutamos en un navegador:**
```
   http://server:666/
```
   

### Demo
**TOP Output**
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard.png" />

**IOSTAT Output**
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard-iostat.png" />

**FSSTAST Output**
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard-fsstat.png" />

**Alerts**
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard02.png" />
<div style="text-align: center;">
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard-info.png" />
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard-alert.png" />
</div>

**Resumen**
<div style="text-align: center;">
<img src="https://raw.githubusercontent.com/mobarrio/dashboard/master/public/images/Dashboard-header.png" />
</div>

### Credits
**Esta aplicación utiliza las siguientes librerías:**

```
- Socke.IO - by http://socket.io
- TopParser - by https://github.com/devalexqt/topparser
- Bootstrap - by http://getbootstrap.com
- Lumino Admin Bootstrap Template - by http://medialoot.com
```