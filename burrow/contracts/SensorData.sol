pragma solidity ^0.4.18;

contract SensorData {

    struct Sensor {
      uint id;
      string device;
      string ts;
		  string seq;
		  string ddata;
		  string dsize;
		  string dhash;
      address senAdd;
    }
	  
    mapping (address => Sensor[]) public sensors;
    Sensor[] public sensorAll;

    function insertData(string dev, string t, string se, string ddat, string dsiz, string dhas) public
    {
      Sensor memory sensor = Sensor({id: sensorAll.length, device: dev, ts: t, seq: se, ddata: ddat, dsize: dsiz, dhash: dhas, senAdd: msg.sender});
      sensorAll.push(sensor);
    }

    function sensorDetails(uint _id) public view returns (uint id, string device, string ts, string seq, string ddata, string dsize, string dhash) {
      Sensor memory s = sensorAll[_id];
      return (s.id, s.device, s.ts, s.seq, s.ddata, s.dsize, s.dhash);
    }

    function allSensor() public view returns (uint) {
      return sensorAll.length;
    }
}