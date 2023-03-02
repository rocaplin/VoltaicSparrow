const ChatLog = ({log}) => {
    return (
        <div className="chat-log">
            {
                // Loop over log and construct elements based on entry type.
                log.map((elem) => {
                    if (Object.keys(elem)[0] == "text") {
                        return (
                            <div
                                className={`chat-text is-bot-${elem.isBot}`}
                                key={`${elem.time}:${Math.random()}`}
                            >
                                <p>{elem.text}</p>
                            </div>
                        );
                    } else {
                        // Unsupported response type:
                        console.log(Object.keys(elem));
                        console.log(elem);
                    }
                })
            }
        </div>
    );
};

export default ChatLog;