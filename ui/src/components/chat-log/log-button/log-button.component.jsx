import {useScrollToBottom} from "react-scroll-to-bottom";

const LogButton = ({buttons, sendHandler}) => {
    // NOTE: npmjs.com/package/react-scroll-to-bottom
    // "scrollToBottom/scrollToEnd/scrollToStart/scrollToTop 
    //   now accept an option { behavior: 'auto' | 'smooth' }"
    // -> Option doesn't seem to work.
    const scrollToBottom = useScrollToBottom();

    return (
        <div
            className={`quick-reply-container`}
        >
            {
                /* Would be nice to pass key as prop... not wanting to work though... */
                buttons["quick_replies"].map((qr_link) => {
                    return (
                        <button
                            className="quick-reply"
                            key={`${qr_link.id}`}
                            value={qr_link.payload}
                            // Function binding...
                            // https://reactjs.org/docs/faq-functions.html
                            // https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
                            onClick={() => {
                                sendHandler(qr_link.payload, qr_link.title);
                                scrollToBottom({behavior: 'auto'});
                            }}
                        >
                            {`${qr_link.title}`}
                        </button>
                    );
                })     
            }
        </div>
    );
};

export default LogButton;