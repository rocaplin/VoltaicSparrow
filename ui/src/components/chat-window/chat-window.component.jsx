import "./chat-window.styles.css";
import {useState, useEffect} from "react";

import ChatLog from "../chat-log/chat-log.component";
import ChatInput from "../chat-input/chat-input.component";

const ChatWindow = ({socket}) => {
    // State
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
    // text: 'string'
    // quick_replies: [
    //     content_type: 'text'
    //     title: 'string'
    //     payload: '/nlu/intent'
    //   ]
    // attachment: {
    //   payload: {src: "image url"},
    //   type: "image"
    // }
    // custom defined data
    // -> Additional processing includes detecting URLs in text 
    // responses so that anchor tags can be constructed.

    // NOTE: If a property is defined twice in a JS object, the 
    // second instance is treated as a reassignment. I initially 
    // assumed Rasa might return duplicate types via JSON but this 
    // seems unlikely. Worth looking at sample data to confirm.
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
        // Rasa is expecting "message" key for texts apparently.
        // Rasa doesn't respond if "text" is used as key.
        // For now I will use uniform format on frontend for easier 
        // display.
       await socket.emit("user_uttered", {message: req});
       appendChat({message: req}, false);
    };

    return(
        <div className="chat-window">
            <ChatLog log={chatLog} sendHandler={sendRequest}/>
            <ChatInput sendHandler={sendRequest}/>
        </div>            
    );
};

export default ChatWindow;