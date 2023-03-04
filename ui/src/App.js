import './App.css';
import io from "socket.io-client";

import ChatWindow from "./components/chat-window/chat-window.component"

// Connect to Rasa via Socket.Io.
const socket = io.connect(`http://${window.location.hostname}:5005`, {path: "/socket.io", forceNew: true, reconnectionAttempts: 3, timeout: 2000, sid:"test_session_widgit", upgrades:["websocket"], pingTimeout:20000,ingInterval:25000});

socket.on('connect', function() {
  console.log("Connected to Rasa.");
});

socket.on('connect_error', (error) => {
  console.log(error);
});

function App() {
  return (
    <div className="App">
      <ChatWindow socket={socket}/>
      <div className="chat-button">
      </div>
    </div>
  );
}

export default App;
