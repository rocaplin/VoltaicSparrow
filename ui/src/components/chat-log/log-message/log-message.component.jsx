const LogMessage = ({message}) => {
    return (
        <div
            className={`chat-text`}
        >
            <span>{message.message}</span>
        </div>
    );
};

export default LogMessage;