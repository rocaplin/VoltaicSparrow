// https://github.com/remarkjs/react-markdown#appendix-b-components

const TextLink = ({href}) => {
    return (
        <span className="chat-link">
            <a href={href} target="_blank" rel="noreferrer">
                {href}
            </a>
        </span>
    );
};

export default TextLink;