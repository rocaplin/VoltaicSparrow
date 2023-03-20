import './App.css';
import {useState} from "react";
import io from "socket.io-client";

import ChatWindow from "./components/chat-window/chat-window.component";
import ChatControls from "./components/chat-controls/chat-controls.component";

// Connect to Rasa via Socket.Io.
const socket = io(`${window.location.protocol}//${window.location.hostname}:5005`);

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