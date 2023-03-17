import {render, screen} from "@testing-library/react";
import LogMessage from "./log-message.component";

const mockMessage = {
    message: "This is a test."
};

test('that user messages are rendored.', () => {
    render(<LogMessage
                message={mockMessage}
            />
    );

    // Verify message.
    const message = screen.getByText(mockMessage.message);
    expect(message).toBeInTheDocument();
});