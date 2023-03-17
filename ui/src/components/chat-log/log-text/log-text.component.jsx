import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";


import TextLink from "./text-link/text-link.component";


const LogText = ({text}) => {
    return(
        <div
            className={`chat-text`}
        >
                <ReactMarkdown 
                    children={text.text}
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                        a: TextLink,
                        p: "span"
                    }}
                />
        </div>
    );
};

export default LogText;