//add influx service and add the token
const {Point, InfluxDB} = require('@influxdata/influxdb-client');
const influx = new InfluxDB({
    url: "http://localhost:8086" , 
    token: process.env.influxToken });


//function to write a random value to the 'oil_temp'
function writeRandomPoint(){
    
    //choose a value at random
    let val = Math.random()*10.0;  

    //tag the run with test and give it that value
    let point = new Point('oil_temp')
        .tag('run', 'test')
        .floatField('value', val);
    
    //write and flush it 
    writeClient.writePoint(point);
    writeClient.flush();
}


//variables
const org = "odb";
const bucket = "test1h";

//build the api, query is not used for now but the write will be used
const queryClient = influx.getQueryApi(org);
const writeClient = influx.getWriteApi(org, bucket,'ns');

//interval of just 1 ms 
setInterval(writeRandomPoint, 1);


  