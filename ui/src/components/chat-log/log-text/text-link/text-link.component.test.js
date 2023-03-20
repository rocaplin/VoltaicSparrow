import {render, screen} from "@testing-library/react";
import TextLink from "./text-link.component";

const hrefMock = "This is a test."

test('that text URLs from Rasa are returned within anchor tags', () => {
    render(<TextLink
                href={hrefMock}
            />
    );

    // Verify link.
    const link = screen.getByRole("link", {name: hrefMock});
    expect(link).toBeInTheDocument();
});