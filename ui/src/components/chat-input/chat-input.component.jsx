import "./chat-input.styles.css";
import {useState} from "react";

import sendIcon from "../../images/send-icon.svg";

const ChatInput = ({sendHandler}) => {
    const [currentRequest, setCurrentRequest] = useState("");

    return(
        <div className="chat-input" data-testid="chat-input">
                <textarea
                    type="text"
                    value={currentRequest}
                    placeholder="Ask Chomp a question..."
                    maxLength="144"
                    cols="42"
                    rows="1"
                    onChange={(event) => {
                        setCurrentRequest(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            sendHandler(currentRequest);
                            setCurrentRequest("");
                        }
                    }}
                />
                <div 
                    className="send-button-container"
                >
                    <button onClick={() => {
                        sendHandler(currentRequest);
                        setCurrentRequest("");
                    }}><img src={sendIcon} alt="Send message to Chomp Sci."/></button>
                </div>
            </div>
    );
};

export default ChatInput;