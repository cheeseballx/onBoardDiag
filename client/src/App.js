import { socket } from './socket';
import { useState, useEffect } from 'react'
import { ConnectionManager } from './ConnectionManager';



function App() {

  const [x,setX] = useState(-1);

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
      setX(dat._value);
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
      <br/>
      <br/>
      {x}
    </div>
    
  );
}

export default App;
   