import { useState, useEffect } from "react";
import { getUserByUserId } from "../services/firebase";

export default function useUser(userId) {
    const [activeUser, setActiveUser] = useState({});

    useEffect(() => {
        async function getUserObjectByUserId(userId) {
            //function that we can call (firebase service ) that gets user data based on ID
            // const [response] with bracket means destructuring the array
            const [user] = await getUserByUserId(userId);
            setActiveUser(user || {});
        }
        if (userId) {
            getUserObjectByUserId(userId);
        }
    }, [userId]);

    return { user: activeUser };
}
