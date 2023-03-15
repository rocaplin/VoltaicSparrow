import "./chat-window.styles.css";
import {useState, useEffect} from "react";

import ChatLog from "../chat-log/chat-log.component";
import ChatInput from "../chat-input/chat-input.component";

const ChatWindow = ({socket}) => {
    const [chatLog, setChatLog] = useState([]);

    // Add metadata then append message to chatLog.
    const appendChat = (message, isBot) => {
        message.isBot = isBot;
        message.time = new Date(Date.now());
        // Avoiding race conditions when setting state in functional components:
        // https://reactjs.org/docs/hooks-reference.html#functional-updates
        setChatLog((prevLog) => {
            return prevLog.concat([message]);
        });
    };

    // Listen for responses from Rasa websocket channel.
    // Iterates over JSON from Rasa, appends each response
    // within to the chatLog. Rasa supports 4 response types:
    //
    // text: 'string'
    //
    // quick_replies: [
    //     content_type: 'text'
    //     title: 'string'
    //     payload: '/nlu/intent'
    //   ]
    //
    // attachment: {
    //   payload: {src: "image url"},
    //   type: "image"
    // }
    //
    // custom defined data:
    useEffect(() => {
        socket.on("bot_uttered", (res) => {
            for (let key in res) {
                if (key === "text") {
                    appendChat({text: res[key]}, true);
                } else if (key === "quick_replies") {
                    appendChat({quick_replies: res[key]}, true);
                } else if (key === "attachment") {
                    appendChat({attachment: res[key]}, true);
                } else {
                    // NOTE: May want to make console output dependent on 
                    // a debug flag.
                    // Unsupported response type:
                    console.log("Unhandled Response Type:")
                    console.log(`{${key}: ${res[key]}}`);
                    console.log(res);
                }
            };
        });
      }, [socket]);

    // Send requests to Rasa websocket channel then add to chatLog.
    const sendRequest = async (req) => {
        // Rasa is expecting "message" key for texts, it will not 
        // respond if "text" is used as key.
        let message = {message: req};
       await socket.emit("user_uttered", message);
       appendChat(message, false);
    };

    return(
        <div className="chat-window">
            <ChatLog log={chatLog} sendHandler={sendRequest}/>
            <ChatInput sendHandler={sendRequest}/>
        </div>            
    );
};

export default ChatWindow;