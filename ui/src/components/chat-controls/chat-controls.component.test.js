import {render, screen} from "@testing-library/react";
import ChatControls from "./chat-controls.component";

// User interaction relies on @testing-library/user-event and 
// async ... await / promises
// https://testing-library.com/docs/user-event/intro

let chatOpenMock = false;
const setChatOpenMock = (value) => {
    chatOpenMock = value;
};

test('that chat conrols rendor properly when the widget is closed', () => {
    render(<ChatControls
                chatOpen={chatOpenMock}
                chatOpenHandler={setChatOpenMock}
            />
    );
    // Verify Call to action.
    const callToAction = screen.getByText(/Try it now!/i);
    expect(callToAction).toBeInTheDocument();

    // Verify open button.
    const openButton = screen.getByRole('button', {name: /Open Chomp Sci Chat Window./});
    expect(openButton).toBeInTheDocument();

    // Verify close button is not present.
    const closeButton = screen.queryByRole('button', {name: /Close Chomp Sci Chat Window./});
    expect(closeButton).not.toBeInTheDocument();
});



test('that chat controls rendor properly when the widget is open', () => {
    setChatOpenMock(true);
    render(<ChatControls
            chatOpen={chatOpenMock}
            chatOpenHandler={setChatOpenMock}
        />
    );

    // Verify call to action not present.
    const callToAction = screen.queryByText(/Try it now!/i);
    expect(callToAction).not.toBeInTheDocument();

    // Verify open button not present.
    const openButton = screen.queryByRole('button', {name: /Open Chomp Sci Chat Window./});
    expect(openButton).not.toBeInTheDocument();

    // Verify close button present.
    const closeButton = screen.queryByRole('button', {name: /Close Chomp Sci Chat Window./});
    expect(closeButton).toBeInTheDocument();
});