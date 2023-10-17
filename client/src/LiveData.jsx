import { useRef, useState } from "react";



export function LiveData({dat,head}) {

    const renderCounter  = useRef(0);
    renderCounter.current = renderCounter.current + 1;

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
         fontSize:"3em"
    }

    const st_head = {
        position:"absolute",
        top:"calc(-100px + 0.5em)",
        right:0,
        fontSize:"1em"
    }

    //put at least 5 numbers in the beginning 
    const paddedNr = "0".repeat(5) + dat.val.toFixed(2);
    const output = paddedNr.substring(paddedNr.length - 6);

    return (
        <div style={st_border}>
            <span style={st_head}>{head}</span>
            <span style={st_val}>{output}</span>
            {renderCounter.current}
        </div>
    )
}