import './App.css';
import {useState} from "react";
import io from "socket.io-client";

import ChatWindow from "./components/chat-window/chat-window.component";
import ChatControls from "./components/chat-controls/chat-controls.component";

// Connect to Rasa via Socket.Io.
const socket = io.connect(`http://${window.location.hostname}:5005`, {path: "/socket.io", forceNew: true, reconnectionAttempts: 3, timeout: 2000, upgrades:["websocket"], pingTimeout:20000, ingInterval:25000});

socket.on('connect', function() {
  console.log("Connected to Rasa.");
});

socket.on('connect_error', (error) => {
  console.log(error);
});

// Should ChatWindow be rendered or not?
const renderChatWindow = (isOpen, connection) => {
  if (isOpen) {
    return (<ChatWindow socket={connection}/>);
  }
};

function App() {
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

  return (
    <div className="App">
      {renderChatWindow(isChatWindowOpen, socket)}
      <ChatControls chatOpen={isChatWindowOpen} chatOpenHandler={setIsChatWindowOpen}/>
    </div>
  );
}

export default App;