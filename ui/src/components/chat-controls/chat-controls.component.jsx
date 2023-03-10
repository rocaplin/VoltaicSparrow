import "./chat-controls.styles.css";
import {useState} from "react";

import callToActionTag from "../../images/call-to-action-tag.svg";
import chatCloseIcon from "../../images/chat-close-icon.svg";
import chatOpenIcon from "../../images/chat-open-icon.svg";

const ChatControls = ({chatOpen, chatOpenHandler}) => {
    const [callToAction, setCallToAction] = useState(true);

    // Call to Action tag render
    const actionTag = (isCallToAction) => {
        if (isCallToAction) {
            return (
                <div id="call-to-action">
                    <span id="call-to-action-text">Try it now!</span>
                    <div id="call-to-action-tag">
                        <img src={callToActionTag} alt=""/>
                    </div>
                </div>  
            );
        }
    };

    // Open/ Close Button render
    const chatButton = (isChatOpen) => {
        if (!chatOpen) {
            return (
                <div id="chat-button-container">
                <button
                    id="chat-open-button"
                    className="chat-button"
                    onClick={() => {
                        chatOpenHandler(true);
                    }}
                >
                    <img src={chatOpenIcon} alt="Open Chomp Sci Chat Window."/>
                </button>
            </div>
            );
        } else {
            // If Chat has been opened once, disable call to action tag.
            if(callToAction) {
                setCallToAction(false);
            };          
            return (
                <div id="chat-button-container">
                <button
                    id="chat-close-button"
                    className="chat-button"
                    onClick={() => {
                        chatOpenHandler(false);
                    }}
                >
                    <img src={chatCloseIcon} alt="Close Chomp Sci Chat Window."/>
                </button>
            </div>                
            );
        }
    };

    return (
        <div id="chat-controls-container">
            {actionTag(callToAction)}
            {chatButton(chatOpen)}
        </div>
    );
};

export default ChatControls;