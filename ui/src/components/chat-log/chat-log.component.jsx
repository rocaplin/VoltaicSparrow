import "./chat-log.styles.css";
import ScrollToBottom from "react-scroll-to-bottom";

import LogMessage from "./log-message/log-message.component";
import LogText from "./log-text/log-text.component";
import LogButton from "./log-button/log-button.component";
import LogAttachment from "./log-attachment/log-attachment.component";

import avatar from "../../images/avatar.png";

const ChatLog = ({log, sendHandler}) => {
    return (
        <ScrollToBottom
            className="chat-log"
            behavior="auto"
        >
            {
                // Loop over log and construct elements based on entry type.
                log.map((elem) => {
                    let key = Object.keys(elem)[0];
                    if (key === "message") {
                        return (
                            <div
                                className={`chat-log-entry is-bot-${elem.isBot}`}
                                key={`message-${elem.time}:${Math.random()}`}
                                data-testid="message"
                            >
                                <LogMessage message={elem}/>
                            </div>
                        );
                    } else if (key === "text") {
                        return (
                            <div
                                className={`chat-log-entry is-bot-${elem.isBot}`}
                                key={`text-${elem.time}:${Math.random()}`}
                                data-testid="text"
                            >
                                <div className="avatar-container">
                                    <img src={avatar} alt=""/>
                                </div>                                
                                <LogText text={elem}/>
                            </div>
                        );
                    } else if (key === "quick_replies") {
                        return (
                            <div
                                className={`chat-log-entry`}
                                key={`quick-reply-${elem.time}:${Math.random()}`}
                                data-testid="quick_replies"
                            >
                                <LogButton buttons={elem} sendHandler={sendHandler}/>
                            </div>
                        );
                    } else if (key === "attachment") {
                        // NOTE: There doesn't seem to be a way to send alt text from RASA. 
                        // If we end up using images in responses we will need to consider 
                        // accessibility.
                        return (
                            <div
                                className={`chat-log-entry`}
                                key={`image-${elem.time}:${Math.random()}`}
                                data-testid="attachment"
                            >
                                <LogAttachment attachment={elem}/>
                            </div>
                        );
                    } else {
                        // Unsupported response type:
                        console.log(Object.keys(elem));
                        console.log(elem);
                    }
                })
            }
        </ScrollToBottom>
    );
};

export default ChatLog;