import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const headerElement = screen.queryByText(/contact form/i);
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, "123");

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId("error");
        expect(errorMessage).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, "David");

    const lastNameField = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameField, "Ellis");

    const button = screen.getByRole("button");
    userEvent.click(button);

    const errorMessage = await screen.findAllByTestId("error");
    expect(errorMessage).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, "dave@gmail");

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);

    userEvent.type(firstNameField, "David");
    userEvent.type(lastNameField, "Ellis");
    userEvent.type(emailField, "dave@gmail.com");

    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor(() => {
        const firstnameDisplay = screen.queryByText("David");
        const lastnameDisplay = screen.queryByText("Ellis");
        const emailDisplay = screen.queryByText("dave@gmail.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)

    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);
    const messageField = screen.getByLabelText(/Message/i);

    userEvent.type(firstNameField, "David");
    userEvent.type(lastNameField, "Ellis");
    userEvent.type(emailField, "dave@gmail.com");
    userEvent.type(messageField, "message");

    const submitButton = await screen.findByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstnameDisplay = screen.queryByText("David");
        const lastnameDisplay = screen.queryByText("Ellis");
        const emailDisplay = screen.queryByText("dave@gmail.com");
        const messageDisplay = screen.queryByTestId(/message/i);

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});