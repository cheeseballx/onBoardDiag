//add influx with token
const {InfluxDB} = require('@influxdata/influxdb-client');
const influx = new InfluxDB({
    url: "http://localhost:8086" , 
    token: process.env.influxToken
});

const queryClient = influx.getQueryApi('odb');


class DB_Reader {

    constructor(name, bucket, measures, updateIntervalMs,aggregationWindow, processResultsFun){
        
        //Store these variables for usage in other functions
        this.name = name;
        this.bucket = bucket;
        this.updateIntervalMs = updateIntervalMs;
        this.aggregationWindow = aggregationWindow;
        this.break;

        //Log it
        console.log('start %s (bucket: %s) with updateInterval %d and aggregationWindow %d',
            this.name, this.bucket,
            this.updateIntervalMs, this.aggregationWindow
        );

        //structure to hold the measure items for the queries
        this.mQueries = measures.reduce((a,v) => {a[v]={lastRes: undefined, other:"tbd"}; return a;},{});

        //the runner function
        this.runner = () => {
            //it checks if it needs a break
            if (this.break)
                console.log(this.name + " stops with code: " + this.break);
            
            //and if not it runs the task and restarts l
            else {
                this.queryAndEmit(processResultsFun);
                setTimeout(this.runner, this.updateIntervalMs);
            }
        }
    };

    start(){
        this.runner();
    };

    stop(why){
        this.break = why;
    };

    async queryAndEmit(processResultsFun){
        const first = "-" + (this.updateIntervalMs * 2) + "ms";
        
        //collect results
        let results = {};
    
        //for every Query
        Object.keys(this.mQueries).forEach(async q => {
    
            //if there is a last reasult from query before, use this as starttime if not use the first time
            const start = this.mQueries[q].lastRes ? this.mQueries[q].lastRes._time : first;
            
            console.log(start);

            //build the query
            const query = `
                from(bucket: "${this.bucket}")
                |> range(start: ${start})
                |> filter(fn: (r) => r["_measurement"] == "${q}")
                |> aggregateWindow(every: ${this.aggregationWindow}ms, fn: mean, createEmpty: false)
                |> yield(name: "mean")
            `;
    
            //can be a huge ram overflow, not if aggregateWindow is choosen wisely in combination with updateInterval
            const result = await queryClient.collectRows(query);
            results[q] = result;
            console.log(result.length);
        
            //save the last row here
            this.mQueries[q].lastRes = result[result.length-1];
        });
    
        //process the result
        processResultsFun(results);
    }
}


module.exports = {DB_Reader};
