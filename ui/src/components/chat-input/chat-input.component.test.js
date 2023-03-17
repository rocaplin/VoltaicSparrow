import {render, screen} from "@testing-library/react";
import ChatInput from "./chat-input.component";

const sendHandlerMock = () => {};

test('that chat input area renders properly', () => {
    render(<ChatInput
                sendHandler={sendHandlerMock}
            />
    );
    // Verify textarea.
    const textarea = screen.getByPlaceholderText(/Ask Chomp a question.../i);
    expect(textarea).toBeInTheDocument();

    // Verify send button.
    const sendButton = screen.getByRole('button', {name: /Send message to Chomp Sci./});
    expect(sendButton).toBeInTheDocument();
});