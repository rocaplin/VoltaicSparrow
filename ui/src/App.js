import './App.css';
import {useState, useEffect} from "react";
import io from "socket.io-client";

import ChatControls from "./components/chat-controls/chat-controls.component";
import ChatLog from "./components/chat-log/chat-log.component";
import ChatInput from "./components/chat-input/chat-input.component";

// Connect to Rasa via Socket.Io.
const socket = io(`${window.location.protocol}//${window.location.hostname}:5005`);

socket.on('connect', function() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Connected to Rasa.");
  }
  socket.emit("user_uttered", {message: "/greet"});
});

socket.on('connect_error', (error) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(error);
  }
});


function App() {
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [chatLog, setChatLog] = useState([]);

  // Add metadata then append message to chatLog.
  const appendChat = (message, isBot) => {
      message.isBot = isBot;
      // Avoiding race conditions when setting state in functional components:
      // https://reactjs.org/docs/hooks-reference.html#functional-updates
      setChatLog((prevLog) => {
          // adding static ids to chat log entries
          message.id = prevLog.length;
          return prevLog.concat([message]);
      });
  };

  // Listen for responses from Rasa websocket channel.
  // Iterates over JSON from Rasa, appends each response
  // within to the chatLog. Rasa supports 3 defined response 
  // types in addition to custom data:
  //
  // text: 'string'
  // quick_replies: an array of objects
  // attachment: an object
  useEffect(() => {
      socket.on("bot_uttered", (res) => {
          for (let key in res) {
              if (key === "text") {
                  appendChat({text: res[key]}, true);
              } else if (key === "quick_replies") {
                  // adding static ids to buttons
                  let qrArray = res[key];
                  for (let i = 0; i < qrArray.length; ++i) {
                      qrArray[i].id = i;
                  }
                  appendChat({quick_replies: qrArray}, true);
              } else if (key === "attachment") {
                  appendChat({attachment: res[key]}, true);
              } else if (process.env.NODE_ENV !== "production") {
                  // Unsupported response type:
                    console.log("Unhandled Response Type:")
                    console.log(`{${key}: ${res[key]}}`);
                    console.log(res);
              }
          };
      });
    }, []);

  // Send requests to Rasa websocket channel then add to chatLog.
  // req - a string "message" to send to Rasa.
  // alt - optional alt text to log in the chat log,
  //       for human-readable quick_links.
  const sendRequest = async (req, alt) => {
      // Rasa will only respond to "message" key.
      let message = {message: req};
     await socket.emit("user_uttered", message);
     if (alt) {
      message = {message: alt};
     }
     appendChat(message, false);
  };

  // Should ChatWindow be rendered or not?
const renderChatWindow = (isOpen, connection) => {
  if (isOpen) {
    return(
      <div className="chat-window">
          <ChatLog log={chatLog} sendHandler={sendRequest}/>
          <ChatInput sendHandler={sendRequest}/>
      </div>            
  );
  }
};

  return (
    <div className="App">
      {renderChatWindow(isChatWindowOpen, socket)}
      <ChatControls chatOpen={isChatWindowOpen} chatOpenHandler={setIsChatWindowOpen}/>
    </div>
  );
}

export default App;