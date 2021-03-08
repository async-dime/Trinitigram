import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Login from "../../pages/login";
import FirebaseContext from "../../context/firebase";
import * as ROUTES from "../../constants/routes";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe("<Login/>", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the login page with a form submission and logs the user in", async () => {
        // expect(1).toEqual(1)
        const succeedLogin = jest.fn(() => Promise.resolve("I am signed in!"));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: succeedLogin,
            })),
        };
        const { getByTestId, getByPlaceholderText, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <Login />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            expect(document.title).toEqual("Login - Trinitigram");
            await fireEvent.change(getByPlaceholderText("Email address"), {
                target: { value: "gilangbram@gmail.com" },
            });
            await fireEvent.change(getByPlaceholderText("Password"), {
                target: { value: "gilangbram" },
            });
            fireEvent.submit(getByTestId("login"));

            expect(succeedLogin).toHaveBeenCalled();
            expect(succeedLogin).toHaveBeenCalledWith(
                "gilangbram@gmail.com",
                "gilangbram"
            );

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
                expect(getByPlaceholderText("Email address").value).toBe(
                    "gilangbram@gmail.com"
                );
                expect(getByPlaceholderText("Password").value).toBe(
                    "gilangbram"
                );
                expect(queryByTestId("error")).toBeFalsy();
            });
        });
    });

    it("renders the login page with a form submission and fails to login the user", async () => {
       
        const failedLogin = jest.fn(() => Promise.reject(new Error("Cannot signed in!")));
        const firebase = {
            auth: jest.fn(() => ({
                signInWithEmailAndPassword: failedLogin,
            })),
        };
        const { getByTestId, getByPlaceholderText, queryByTestId } = render(
            <Router>
                <FirebaseContext.Provider value={{ firebase }}>
                    <Login />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            expect(document.title).toEqual("Login - Trinitigram");
            await fireEvent.change(getByPlaceholderText("Email address"), {
                target: { value: "gilangbram.com" },
            });
            await fireEvent.change(getByPlaceholderText("Password"), {
                target: { value: "gilangbram" },
            });
            fireEvent.submit(getByTestId("login"));

            expect(failedLogin).toHaveBeenCalled();
            expect(failedLogin).toHaveBeenCalledWith(
                "gilangbram.com",
                "gilangbram"
            );

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
                expect(getByPlaceholderText("Email address").value).toBe(
                    ""
                );
                expect(getByPlaceholderText("Password").value).toBe(
                    ""
                );
                expect(queryByTestId("error")).toBeTruthy();
            });
        });
    })


});
