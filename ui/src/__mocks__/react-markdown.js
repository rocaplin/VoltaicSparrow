// Jest unable to handle react-markdown. See:
//https://github.com/remarkjs/react-markdown/issues/635#issuecomment-956158474
const ReactMarkdown = ({children}) => {
    return <>{children}</>;
};

export default ReactMarkdown;