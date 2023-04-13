import {render, screen} from "@testing-library/react";
import LogButton from "./log-button.component";

const sendMock = () => {
    /*
      empty block because mocking dependency
    */
};

const buttonsMock = {
    quick_replies: [
        {
            content_type: 'text',
            title: 'button_0',
            payload: '/nlu/intent_0',
            id: 0
         },
         {
            content_type: 'text',
            title: 'button_1',
            payload: '/nlu/intent_1',
            id: 1
         }
    ]
};

test( 'quick_replies buttons', () => {
    render(<LogButton
                buttons={buttonsMock}
                sendHandler={sendMock}
            />
    );

    // Verify button titles.
    const button0 = screen.getByRole('button', 
        {name: buttonsMock.quick_replies[0].title});
    const button1 = screen.getByRole('button', 
        {name: buttonsMock.quick_replies[1].title});

    // Verify button payloads.
    expect(button0).toHaveValue(buttonsMock.quick_replies[0].payload);
    expect(button1).toHaveValue(buttonsMock.quick_replies[1].payload);

    // Verify render.
    expect(button0).toBeInTheDocument();
    expect(button1).toBeInTheDocument();
});