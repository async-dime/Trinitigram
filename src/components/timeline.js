import {useContext} from "react";
import Skeleton from "react-loading-skeleton";
import usePhotos from "../hooks/use-photos";
import LoggedInUserContext from '../context/logged-in-user';
import Post from "./post";

export default function Timeline() {
    //get the logged in user's photos with hook
    //use skeleton when loading the photo
    //if have a photo, render them
    //if have no photo tell user to create post
    const { user } = useContext(LoggedInUserContext);
    const { photos } = usePhotos(user);

    return (
        <div className="container col-span-2">
            {!photos ? (
                <Skeleton count={4} width={640} height={500} className="mb-5" />
            ) : photos?.length > 0 ? (
                photos.map((content) => (
                    <Post key={content.docId} content={content} />
                ))
            ) : (
                <p className="text-center text-2xl mt-10">
                    Follow more people to see more photos!
                </p>
            )}
        </div>
    );
}
