import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { checkUsernameIsExists } from "../services/firebase";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Signup() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [error, setError] = useState("");
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordConfirmVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };
    const isInvalid =
        password === "" || emailAddress === "" || password !== passwordConfirm;
    const handleSignup = async (e) => {
        e.preventDefault();

        const usernameExists = await checkUsernameIsExists(username); //it will return empty array if it's not existed

        if (!usernameExists.length) {
            // => it means if username is not exist
            try {
                const createdUserResult = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(emailAddress, password);
                //update username user
                await createdUserResult.user.updateProfile({
                    displayName: username,
                });
                //firebase user collection
                await firebase
                    .firestore()
                    .collection("users")
                    .add({
                        userId: createdUserResult.user.uid,
                        username: username.toLowerCase(),
                        emailAddress: emailAddress.toLowerCase(),
                        fullName,
                        following: ["cPfhvCrzVWXUBuvsBx4Yx0P2Qr72"],
                        followers: [],
                        dateCreated: Date.now(),
                    });
                return history.push(ROUTES.DASHBOARD);
            } catch (error) {
                setUsername("");
                setFullName("");
                setEmailAddress("");
                setPassword("");
                setPasswordConfirm("");
                setError(error.message);
            }
        } else {
            setUsername("");
            setFullName('');
            setEmailAddress('');
            setPassword('');
            setError("That username is already taken, please try another.");
        }
    };

    useEffect(() => {
        document.title = "Sign Up - Trinitigram";
    }, []);

    return (
        <div className="container flex mx-auto max-w-screen-md items-center h-screen">
            <div className="flex w-2/4">
                <img
                    src="/images/iphone-with-profile.png"
                    alt="iPhone with Trinitigram app"
                />
            </div>
            <div className="flex flex-col w-2/4">
                <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
                    <h1 className="flex justify-center w-full">
                        <img
                            src="/images/logos.png"
                            alt="Instagram"
                            className="mt-2 w-6/12 mb-4"
                        />
                    </h1>
                    {error && (
                        <p className="mb-4 text-xs text-red-primary">{error}</p>
                    )}
                    <form
                        onSubmit={handleSignup}
                        method="POST"
                        data-testid="sign-up"
                    >
                        <input
                            aria-label="Enter your username"
                            type="text"
                            placeholder="Username"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                            onChange={({ target }) => setUsername(target.value)}
                            value={username}
                        />
                        <input
                            aria-label="Enter your full name"
                            type="text"
                            placeholder="Full name"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                            onChange={({ target }) => setFullName(target.value)}
                            value={fullName}
                        />
                        <input
                            aria-label="Enter your email address"
                            type="text"
                            placeholder="Email address"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                            onChange={({ target }) =>
                                setEmailAddress(target.value)
                            }
                            value={emailAddress}
                        />
                        <div className="relative flex flex-col">
                            <input
                                aria-label="Enter your password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                onChange={({ target }) =>
                                    setPassword(target.value)
                                }
                                value={password}
                            />
                            <i
                                onClick={togglePasswordVisibility}
                                className="absolute text-gray-base"
                                style={{ top: "20%", right: "10px" }}
                            >
                                {showPassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                            </i>
                        </div>
                        <div className="relative flex flex-col">
                            <input
                                aria-label="Enter your password confirmation"
                                type={showPasswordConfirm ? "text" : "password"}
                                placeholder="Password confirmation"
                                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                                onChange={({ target }) =>
                                    setPasswordConfirm(target.value)
                                }
                                value={passwordConfirm}
                            />
                            <i
                                onClick={togglePasswordConfirmVisibility}
                                className="absolute text-gray-base"
                                style={{ top: "20%", right: "10px" }}
                            >
                                {showPasswordConfirm ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                            </i>
                        </div>
                        <button
                            disabled={isInvalid}
                            type="submit"
                            className={`bg-blue-medium text-white w-full rounded h-8 font-bold
            ${isInvalid && "opacity-50"}`}
                        >
                            Sign up
                        </button>
                    </form>
                </div>
                <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
                    <p className="text-sm">
                        Already have an account?{` `}
                        <Link
                            to={ROUTES.LOGIN}
                            className="font-bold text-blue-medium"
                            data-testid="login"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
