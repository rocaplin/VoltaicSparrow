import {render, screen} from "@testing-library/react";
import LogAttachment from "./log-attachment.component";

const mockAttachment = {
    attachment: {
        payload: {
            src: "../../../images/avatar.png"
        },
        type: "image"
    }    
};

test('that attachment payloads from Rasa are rendered', () => {
    render(<LogAttachment
                attachment={mockAttachment}
            />
    );

    // Verify attachment payload.
    const payload = screen.getByTestId('attachment-payload');
    expect(payload).toBeInTheDocument();
});