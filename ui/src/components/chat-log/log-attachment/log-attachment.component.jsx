const LogAttachment = ({attachment}) => {
    return(
        <div
            className={`chat-image-container`}
        >
            <img src={attachment.attachment.payload.src}
                 alt=""
                 className="chat-image"
                 data-testid="attachment-payload"
                 />
        </div>
    );
};

export default LogAttachment;