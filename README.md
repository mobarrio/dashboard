Dashboard Linux
===

Dashboard minimalista y no intrusiva para servers linux. Monitoriza en tiempo real Procesos CPU, Memoria y SWAPE utilizando NodeJS y Socke.IO

Dashboard minimalist and non-intrusive for Linux Servers. Monitoring in real-time Proccess, CPU, memory and Swap with NodeJS and Socke.IO

### Instalacion:

**En Linux/Solaris:**
<<<<<<< HEAD

```
 $ mkdir -p /var/adm/ssoo
=======
>>>>>>> 3a0256d... README.md edited online with Bitbucket

 $ cd /var/adm/ssoo 

 $ git clone https://github.com/mobarrio/dashboard.git

 $ cd dashboard && npm install
```


**Preparamos scripts de arranque automatico:**
<<<<<<< HEAD
```
 $ npm -g install forever
=======
   $ npm -g install forever
>>>>>>> 3a0256d... README.md edited online with Bitbucket
   
 $ cp /var/adm/ssoo/dashboard/etc/dashgs.sh /etc/init.d/dashgs
   
 $ chmod 755 /etc/init.d/dashgs
   
 $ chkconfig --add dashgs
```

 
**Ejecutar la app en modo DEBUG:**
<<<<<<< HEAD
```
 $ DEBUG=dashboard:server

 $ npm start
```


**Ejecutar la app STANDALONE:**
```
=======
     $ DEBUG=dashboard:server
     $ npm start

**Ejecutar la app STANDALONE:**
>>>>>>> 3a0256d... README.md edited online with Bitbucket
     $ node bin/www
```


**Ejecutar la app via init.d (FOREVER):**
<<<<<<< HEAD
```
=======
>>>>>>> 3a0256d... README.md edited online with Bitbucket
     $ /etc/init.d/dashgs start
```

   
**Después ejecutamos en un navegador:**
<<<<<<< HEAD
```
   http://server:3000/
```
=======

   http://serverip:3000/
>>>>>>> 3a0256d... README.md edited online with Bitbucket
   

### Demo
<img src="https://raw.githubusercontent.com/mobarrio/Dashboard/master/public/images/Dashboard.png" />
   
### Credits
**
Esta aplicación utiliza las siguientes librerías:**

<<<<<<< HEAD
```
- Socke.IO - by http://socket.io
- TopParser - by https://github.com/devalexqt/topparser
- Bootstrap - by http://getbootstrap.com
- Lumino Admin Bootstrap Template - by http://medialoot.com
```
=======
- 
- Socke.IO - by http://socket.io/
- TopParser - by https://github.com/devalexqt/topparser
- Bootstrap - by http://getbootstrap.com/


 $ npm -g install forever
 $ cp /var/adm/ssoo/dashboard/etc/dashgs.sh /etc/init.d/dashgs
 $ chmod 755 /etc/init.d/dashgs
 $ chkconfig --add dashgs
>>>>>>> 3a0256d... README.md edited online with Bitbucket
