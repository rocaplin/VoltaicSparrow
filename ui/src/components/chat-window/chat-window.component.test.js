import {render, screen} from "@testing-library/react";
import ChatWindow from "./chat-window.component";

const socketMock = {
    on: (mockEvent, mockCallback) => {
        if (mockEvent == "bot_uttered") {
            mockCallback();
        }
    }
};

test('chat window renders', () => {
    render(<ChatWindow socket={socketMock}/>);

    // ChatLog is displayed.
    // NOTE: TestID cannot be set on react-scroll-to-bottom container 
    // within the chatlog. Since React Testing Library is user oriented 
    // and does not provide for testing of "implementation details", there 
    // isn't a good way to detect that this is rendered from this test.

    // ChatInput is displayed.
    const chatInput = screen.getByTestId('chat-input');
    expect(chatInput).toBeInTheDocument();
});