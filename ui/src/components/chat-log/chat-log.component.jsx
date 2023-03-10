import "./chat-log.styles.css";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import avatar from "../../images/avatar.png";

import ChatLink from "../chat-link/chat-link.component";

const ChatLog = ({log, sendHandler}) => {
    return (
        <ScrollToBottom className="chat-log">
            {
                // Loop over log and construct elements based on entry type.
                log.map((elem) => {
                    let key = Object.keys(elem)[0];
                    if (key === "message") {
                        return (
                            <div
                                className={`chat-log-entry is-bot-${elem.isBot}`}
                                key={`message-${elem.time}:${Math.random()}`}
                            >
                                <div
                                    className={`chat-text`}
                                >
                                    <span>{elem.message}</span>
                                </div>
                            </div>
                        );
                    } else if (key === "text") {
                        return (
                            <div
                                className={`chat-log-entry is-bot-${elem.isBot}`}
                                key={`text-${elem.time}:${Math.random()}`}
                            >
                                <div className="avatar-container">
                                    <img src={avatar} alt=""/>
                                </div>
                                <div
                                    className={`chat-text`}
                                >
                                        <ReactMarkdown 
                                            children={elem.text}
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            components={{
                                                a: ChatLink,
                                                p: "span"
                                            }}
                                        />
                                </div>
                            </div>
                        );
                    } else if (key === "quick_replies") {
                        return (
                            <div
                                className={`chat-log-entry`}
                                key={`quick-reply-${elem.time}:${Math.random()}`}
                            >
                                <div
                                    className={`quick-reply-container`}
                                >
                                    {
                                        elem[key].map((qr_link, i) => {
                                            return (
                                                <button
                                                    className="quick-reply"
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
                            >
                                <div
                                    className={`chat-image-container`}
                                >
                                    <img src={elem.attachment.payload.src} alt="" className="chat-image"/>
                                </div>
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