import './App.css';
import io from "socket.io-client";
import {useEffect} from "react";

// Connect to Rasa via Socket.Io.
//const socket = io.connect("http://localhost:5005", {path: "/socket.io", forceNew: true, reconnectionAttempts: 3, timeout: 2000, sid:"test_session_widgit", upgrades:["websocket"], pingTimeout:20000,ingInterval:25000});
const socket = io.connect(`http://${window.location.hostname}:5005`, {path: "/socket.io", forceNew: true, reconnectionAttempts: 3, timeout: 2000, sid:"test_session_widgit", upgrades:["websocket"], pingTimeout:20000,ingInterval:25000});

// Debug
// Send test message from socket.io-client to rasa's socket.io channel.
const socketChannelTest = async () => {
  let testMessage = {message: "Hello from socket.io-client."};
  await socket.emit("user_uttered", testMessage);
  console.log(testMessage);
};

socket.on('connect', function() {
  console.log("Connected to Rasa.");
  console.log(socket);
  console.log("Running basic communication test...");
  socketChannelTest();
});

socket.on('connect_error', (error) => {
  console.log(error);
});

function App() {
  // Debug
  // Listen for response from rasa's socket.io channel.
  useEffect(() => {
    socket.on("bot_uttered", (res) => {
      // Rasa responses are always JSON but have a variety of properties.
      // The most basic form is {text: "string"}. Different features like 
      // buttons, image URLs, etc will need to be handled by the chat 
      // widget. I'm not sure documentation is available, if not the 
      // appropriate structures can be discerned from debugging.
      console.log(res);
    });
  }, [socket]);

  return (
    <div className="App">
      <h2>Chat Widget Prototype</h2>
    </div>
  );
}

export default App;
