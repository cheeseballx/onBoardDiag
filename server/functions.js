//for now this file is not used any more its just for copy sth from here

//add influx with token
const {Point, InfluxDB} = require('@influxdata/influxdb-client');
const influx = new InfluxDB({
    url: "http://localhost:8086" , 
    token: process.env.influxToken
});

//variables
const org = "odb";
const bucket = "test1h";


//build the api
const queryClient = influx.getQueryApi(org)
//const writeClient = influx.getWriteApi(org, bucket,'ns')


//query for last few minutes or whatever timespan is given
let influxLastMinutes = `
  from(bucket: "${bucket}")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "oil_temp")
`;

//query for reading the last insert and really just the last one
let influxLastInsert = `
  from(bucket: "${bucket}") 
    |> range(start: -20m )
    |> filter(fn: (r) => r._measurement == "oil_temp")
    |> tail(n:1)
`;
/*
function latestData(processResult,updateMs){

  setInterval(() => {

    let result;
    result = await xDo();



  },updateMs);
  
}*/

async function xDo( ){
  const start = "-" + updateMs*2 + "ms";
  const influxDataSinceLastQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${updateMs})
      |> filter(fn: (r) => r["_measurement"] == "oil_temp")
      |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
      |> yield(name: "mean")
  `;

  //can be a huge ram overflow
  return queryClient.collectRows(influxDataSinceLastQuery);
}

//this is the query for reading the last minutes or whatever timespan, not
//used yet
function lastMinutes(){
  queryClient.queryRows(influxLastMinutes, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      //io.emit("data", tableObject);
      //no idea how to emit here maybe it should be done 
      //with collectRows
    },
    error: (error) => {
      console.error('\nError', error)
    },
    complete: () => {
      console.log('.')
    }
  });
}

//this always gives back just a single row
//so we dont have to be panic because of the memory overload from collectRows
async function lastInsert(processResult){

  //no mapper calls the default toObject thing and thats good
  const result = await queryClient.collectRows(influxLastInsert);

  //we know for sure that there is just one row, so unpack the one row array already
  processResult(result[0]);
}

//export the functions that should be used by the server
module.exports = { lastInsert, lastMinutes};