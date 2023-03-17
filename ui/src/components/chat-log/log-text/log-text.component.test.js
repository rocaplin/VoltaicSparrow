import {render, screen} from "@testing-library/react";
import LogText from "./log-text.component";

const textMock = {
    text: "This is a test."
};

test('that "text" responses render properly.', () => {
    render(<LogText
                text={textMock}
            />
    );

    // Verify text.
    const text = screen.getByText(textMock.text);
    expect(text).toBeInTheDocument();
});