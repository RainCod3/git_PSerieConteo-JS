
// Minuto 30 tutorial
// Falta realizar un diagrama mas detallado de las conexiones


const express = require('express');     // Conexion clientes-server (declaracion de biblioteca)
const app = express();

const socketIO = require('socket.io');    // sockets entre el hardware y el server (declaracion de biblioteca)
const http = require('http');     // modulo WEB (declaracion de biblioteca)

const server = http.createServer(app);     // Se vincula la web con el Server

const io = socketIO.listen(server);   // vincula el servidor con los sockets

io.on('connection', function (socket) {
  console.log('>>Nuevo usuario conectado');
});

app.get('/', function (req,res,next) {        // Manejador de peticiones FUNCTION
  res.sendFile(__dirname + '/index.html');
});

// ----------------------------------------------
// const pserie = require('serialport');  // declara la biblioteca de funciones
// const Readline = pserie.parsers.Readline;  // Desde puerto serie, lee una linea y la almacena en Readline (etiqueta de instruccion)
// const parser = new Readline();
//
// const MyPserie = new pserie('COM1', {
//   baudRate: 9600
// });     // Funcion de configuracion de puerto serie

const pserie = require('serialport');  // declara la biblioteca de funciones
const Readline = pserie.parsers.Readline;  // Desde puerto serie, lee una linea y la almacena en Readline (etiqueta de instruccion)
// const Ready = pserie.parsers.Ready;
// const Delimiter = pserie.parsers.Delimiter;
const MyPserie = new pserie('COM1', {
  baudRate: 9600
});     // Funcion de configuracion de puerto serie
// const parser = MyPserie.pipe(new Ready({ delimiter: 'MX' })).pipe(new Readline({ delimiter: '\n\r' }));
const parser = MyPserie.pipe(new Readline({ delimiter: '\r\n' }));
// const parser = MyPserie.pipe(new Ready({ delimiter: 'MX' }));

MyPserie.on('open', function () {
  console.log('puerto serie ABIERTO');
});    // Abre puerto serie previamente especificado y emite un mensaje en consola


parser.on('ready', function () {
  console.log('Datos de inicio recibidos');
});

// parser.on('data', console.log);

parser.on('data', function(input) {
    //console.log("################# RECIEVE ##################");
    //console.log("Message: "+input);

    // const input2=input.replace(/^MX|(\r|\n|(\\|0)(x|X))/g,"");
    // console.log("Sanitized Input: ",input2);

    try{
        const data=Buffer.from(input)
        console.log("REPRINT HEX FOR VERIFICATION: " + data.toString('hex'));
        //console.log("############ END RECIEVE ##############");
    } 
	catch(e) {
        console.error(e);
    }
	
	io.emit('board:data', {
		// const data_html = Buffer.from(input)
		//value: Buffer.from(input).toString('hex')		// datos en crudo hexadecimal
		value: Buffer.from(input).toString()
	});
	
	// MyPserie.flush();
	
});

// MyPserie.on('data', function (data) {
//   //console.log(data);  // aqui estan en formato binario
//   console.log(data.toString('hex'));
//
//   io.emit('board:data', {       // emision de servidor, con un nombre
//     value: data.toString()
//   });
//
// });   // Lee datos y los retransmite en consola

MyPserie.on('err', function (err) {
  console.log(err.message);
});
// ----------------------------------------------

server.listen(3000, function () {
  console.log('Servidor en el puerto: ', 3000);
});
