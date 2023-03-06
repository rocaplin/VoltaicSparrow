import "./chat-log.styles.css";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ChatLink from "../chat-link/chat-link.component";

const ChatLog = ({log, sendHandler}) => {
    return (
        <ScrollToBottom className="chat-log">
            {
                // Loop over log and construct elements based on entry type.
                // NOTE: Rasa responses seem to have a lot of nesting. This 
                // is probably to make it easy to add future response types to 
                // RASA easily. Could present a performance issue for us though 
                // as it leads to nested loops. If it becomes a problem we might 
                // be able to do more processing on receipt as opposed to during 
                // render since receipt would only run once for each new response.
                // The trade off is that the stored data would not reflect what 
                // was originally received from Rasa as well, which may limit some 
                // display possibilities.
                log.map((elem) => {
                    let key = Object.keys(elem)[0];
                    if (key === "text") {
                        return (
                            <div
                                className={`chat-text is-bot-${elem.isBot}`}
                                key={`${elem.time}:${Math.random()}`}
                            >
                                <ReactMarkdown 
                                    children={elem.text}
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ChatLink
                                    }}
                                    />
                            </div>
                        );
                    } else if (key === "quick_replies") {
                        return (
                            <div
                                className={`quick-reply-container is-bot-${elem.isBot}`}
                                key={`${elem.time}:${Math.random()}`}
                            >
                            {
                                elem[key].map((qr_link, i) => {
                                    return (
                                        <button
                                            className="quick-link"
                                            key={`${i}-${Math.random()}`}
                                            value={qr_link.payload}
                                            // Function binding...
                                            // https://reactjs.org/docs/faq-functions.html
                                            // https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
                                            onClick={() => {sendHandler(qr_link.payload)}}
                                        >
                                            {`${qr_link.title}`}
                                        </button>
                                    );
                                })     
                            }
                            </div>
                        );
                    } else if (key === "attachment") {
                        // NOTE: There doesn't seem to be a way to send alt text from RASA. 
                        // If we end up using images in responses we will need to consider 
                        // accessibility.
                        return (
                            <div
                                className={`chat-image-container is-bot-${elem.isBot}`}
                                key={`${elem.time}:${Math.random()}`}
                            >
                                <img src={elem.attachment.payload.src} alt="" className="chat-image"/>
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