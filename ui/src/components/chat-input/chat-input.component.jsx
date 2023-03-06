import "./chat-input.styles.css";
import {useState} from "react";

const ChatInput = ({sendHandler}) => {
    const [currentRequest, setCurrentRequest] = useState("");

    return(
        <div className="chat-input">
                <input
                    type="text"
                    value={currentRequest}
                    placeholder="Ask Chomp a question..."
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
                <button onClick={() => {
                    sendHandler(currentRequest);
                    setCurrentRequest("");
                }}>Send</button>
            </div>
    );
};

export default ChatInput;