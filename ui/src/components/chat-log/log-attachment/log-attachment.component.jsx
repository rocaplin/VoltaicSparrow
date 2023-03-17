const LogAttachment = ({attachment}) => {
    return(
        <div
            className={`chat-image-container`}
        >
            <img src={attachment.attachment.payload.src} alt="" className="chat-image"/>
        </div>
    );
};

export default LogAttachment;