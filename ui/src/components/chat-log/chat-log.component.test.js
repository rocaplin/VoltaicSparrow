import {render, screen} from "@testing-library/react";
import ChatLog from "./chat-log.component";

// NOTE: screen.debug() is a useful method to print parse tree.

// Normally used to send messages to Rasa.
const sendMock = () => {
    /*
      empty block because mocking dependency
    */
};

// Mock chat log data from chat-window.component
const chatLogMock = [
    {
        message: "message test 0",
        isBot: false,
        id: 0
    },
    {
        text: "text test 0",
        isBot: true,
        id: 1
    },
    {
        message: "\nmessage test 1",
        isBot: false,
        id: 2
    },
    {
        text: "text test 1",
        isBot: true,
        id: 3
    },
    {
        quick_replies: [
            {
                content_type: "text",
                title: "button 0",
                payload: "/payload/test0",
                id: 0
            },
            {
                content_type: "text",
                title: "button 1",
                payload: "/payload/test1",
                id: 1
            }            
        ],
        isBot: true,
        id: 4
    },
    {
        attachment: {
            payload: {
                src: "../../images/avatar.png"
            },
            type: "image"
        },
        isBot: true,
        id: 5
    },
    {
        message: "button 0",
        isBot: false,
        id: 6
    },
    {
        text: "text test 2",
        isBot: true,
        id: 7
    }
];

test('chat log correctly identifies and renders log entries', () => {
    render(<ChatLog
                log={chatLogMock}
                sendHandler={sendMock}
            />
    );

    // Message Tests.
    const messages = screen.getAllByTestId('message');
    expect(messages.length).toBe(3); 
    const messageTest0 = screen.getByText(/message test 0/);
    expect(messages[0]).toContainElement(messageTest0);
    const messageTest1 = screen.getByText(/message test 1/);
    expect(messages[1]).toContainElement(messageTest1);
    const messageTest2 = screen.getAllByText(/button 0/);
    expect(messages[2]).toContainElement(messageTest2[1]);

    // Text Tests.
    const texts = screen.getAllByTestId('text');
    expect(texts.length).toBe(3); 
    const textTest0 = screen.getByText(/text test 0/);
    expect(texts[0]).toContainElement(textTest0);
    const textTest1 = screen.getByText(/text test 1/);
    expect(texts[1]).toContainElement(textTest1);
    const textTest2 = screen.getByText(/text test 2/);
    expect(texts[2]).toContainElement(textTest2);

    // Buttons Tests.
    const buttonContainers = screen.getAllByTestId('quick_replies');
    expect(buttonContainers.length).toBe(1);
    const buttonTest0 = screen.getByRole('button', {name: /button 0/});
    expect(buttonTest0).toHaveValue("/payload/test0");
    expect(buttonContainers[0]).toContainElement(buttonTest0);
    const buttonTest1 = screen.getByRole('button', {name: /button 1/});
    expect(buttonTest1).toHaveValue("/payload/test1");
    expect(buttonContainers[0]).toContainElement(buttonTest1);

    // Attachment Test.
    const attachment = screen.getByTestId('attachment');
    const attachmentPayload = screen.getByTestId('attachment-payload');
    expect(attachment).toContainElement(attachmentPayload);
});