import { socket } from './socket';
import { useState, useEffect } from 'react'
import { ConnectionManager } from './ConnectionManager';
import { LiveData } from './LiveData';

const time = Date.now();

function App() {

  const [dat,setDat] = useState({});

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
      setDat(dat);
    };

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
      Hello World 
      <ConnectionManager />
      <div style={{display:"flex", flexWrap: "wrap"}}>
        <LiveData dat={dat.oil_temp} head={"Oil Temp"}/>
      </div>
    </div>
    
  );
}

export default App;
   