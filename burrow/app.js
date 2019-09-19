const express = require("express");
var bodyParser = require("body-parser");
const app = express();
var _http = require('http');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const exec = require('child_process').exec;
const execA = require('await-exec')
const cmd = require('node-cmd');
 
app.use(express.static('src'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

http.listen(3000, function () {
    console.log('Check out the sensor data at http://localhost:3000');
});
 
var addresses = [];
var command = '';
app.post('/insertData',function(req,res){
	var data = '"' + req.body.device +'","'+ req.body.ts +'","'+ req.body.seq +'","'+ req.body.ddata +'","'+ req.body.dsize +'","'+ req.body.dhash+'"';
	command = 'snak call SensorData insertData '+ JSON.stringify(data);
	console.log(command);
	exec(command, async function(err,stdout,stderr){
		if(err){
			console.log(stderr);
		}
		else
		{
			res.json('inserted');		
		}		
	});
});

app.post('/getAll',async function(req,res){
	command = 'snak call SensorData allSensor'
	exec(command, async function(err,stdout,stderr){
		if(!err){
			console.log(stdout);
			var sensors = [];
			var arr;
			var count = parseInt(stdout.replace('"',''));
			console.log(count);
			for(i = 0; i < count; i++){
				command = 'snak call SensorData sensorDetails '+i
				console.log(command);
				const data = await execA(command);
				if(data.stdout){
					console.log(data.stdout);
					arr = JSON.parse(data.stdout.replace('\n',''))
					sensors.push(arr);			
				} else{
					console.log("error");
				}
			}
			res.json({'sensors': sensors});			
		} else{
			console.log(stderr);
			console.log(err);
		}
	});
});

app.post('/getSensor/:id',function(req,res){
	command = 'snak call SensorData sensorDetails '+req.params.id
	exec(command,function(err,stdout,stderr){
		if(!err){
			var array = JSON.parse(stdout);
			console.log(stdout);
			res.json({'sensor': array});			
		} else{
			console.log(stderr);
		}
	});
});

io.on('disconnect', function(socket) {
	console.log('socket disconeceted');
})
