import { useEffect } from "react";
import Header from "../components/header";

export default function NotFound() {
    useEffect(() => {
        document.title = "Not Found - Trinitigram";
    }, []);

    return (
        <div className="bg-gray-background">
            <Header />
            <div className="flex justify-center items-center h-screen">
                <div className="mx-auto max-w-screen-lg">
                    <p className="text-center text-2xl">Not Found!</p>
                </div>
            </div>
        </div>
    );
}
