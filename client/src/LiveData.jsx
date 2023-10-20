import { useEffect, useRef, useState } from "react";
import ApexChart from "apexcharts";
import Chart from "react-apexcharts";


export function LiveData({dat,head}) {

    const renderCounter = useRef(0);
    const fullDat = useRef([]);
    
    
    useEffect(() =>{
        const arr = dat && dat.length>0 ? dat.map(x=> {return {x:x._time, y:x._value}}) : [];
        fullDat.current = fullDat.current.concat(arr);
        
        ApexChart.exec('line', 'updateSeries', [{data: fullDat.current}]);
        renderCounter.current = renderCounter.current + 1;
    },[dat])

    const st_border = {
        border: "1px solid black",
        position: "relative",
        overflow: "hidden",
        width: "200px",
        height: "200px",
        lineHeight:"200px",
        textAlign: "center"
    }
    
    const st_val = {
         fontSize:"2.2em"
    }

    const st_head = {
        position:"absolute",
        top:"calc(-100px + 0.5em)",
        right:0,
        fontSize:"1em"
    }

    const y = (dat && dat.length>0) ? dat[dat.length-1]._value : -1; 

   

    //put at least 5 numbers in the beginning 
    const paddedNr = " ".repeat(5) + y.toFixed(2);
    const output = paddedNr.substring(paddedNr.length - 6);

    const series = [ //data on the y-axis
    {
      name: "Temperature in Celsius",
      data: []
    }
  ];
  const options = {
    chart: { 
        id: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 400000
            }
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime'
        }
        }
  };

    return (
        <>
        <div style={st_border}>
            <span style={st_head}>{head}</span>
            <span style={st_val}>{output}</span>
            {renderCounter.current}
        </div>
        <Chart
        options={options}
        series={series}
        type="line"
        width="450"
      />
        </>
    )
}