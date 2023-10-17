import { socket } from './socket';
import { useState, useEffect } from 'react'
import { ConnectionManager } from './ConnectionManager';
import { LiveData } from './LiveData';

const time = Date.now();

function App() {

  const [dat,setDat] = useState({val: -1, time: -1, fps: -1});
  const [dt, set_dt] = useState(0);

  //use effect without param means we just start it once
  useEffect(() => {
    const onConnect = () => {
      console.log("connected");
    };

    const onDisconnect = () => {
      console.log("disconnected");
    };

    const onError = (e) => {
      console.log("Error connecting: " + e.message);
    };

    const onData = (dat) => {
      setDat({val:dat._value, time:dat._time, fps:dat.fps});
    };

    //Interval of arount and refresh this around all ten seconds
    setInterval(() => {
      set_dt((Date.now() - time)/1000.0);
    },10000);

    //rgister the listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error',onError);
    socket.on('data',onData);

    //cleanup and remove the registrations
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error',onError);
      socket.off('data',onData);
    };
  }, []);

  return (
    <div>
      Hello World {dt}
      <ConnectionManager />
      <div style={{display:"flex", flexWrap: "wrap"}}>
        <LiveData dat={dat} head={"Oil Temp"} dt={dt}/>
      </div>
    </div>
    
  );
}

export default App;
   