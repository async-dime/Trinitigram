import { firebase, FieldValue } from "../lib/firebase";

export async function checkUsernameIsExists(username) {
    const result = await firebase
        .firestore()
        .collection("users")
        .where("username", "==", username)
        .get();

    return result.docs.map((user) => user.data().length > 0);
}

export async function getUserByUsername(username) {
    const result = await firebase
        .firestore()
        .collection("users")
        .where("username", "==", username)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
    }));
}

//get user from firestore => where userId === userId (passed from the auth)
// export async function getUserFromFirestoreByUserId(userId) {
export async function getUserByUserId(userId) {
    const result = await firebase
        .firestore()
        .collection("users")
        .where("userId", "==", userId)
        .get();
    const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
    }));

    return user;
}

export async function getSuggestedProfiles(userId, following) {
    const result = await firebase
        .firestore()
        .collection("users")
        .limit(10)
        .get();

    return result.docs
        .map((user) => ({ ...user.data(), docId: user.id }))
        .filter(
            (profile) =>
                profile.userId !== userId && !following.includes(profile.userId)
        );
}

export async function updateLoggedInUserFollowing(
    loggedInUserDocId, //current user's document ID (our profile)
    profileId, //the user that us requests to follow
    isFollowingProfile //check true / false => did us already follow this user?
) {
    return firebase
        .firestore()
        .collection("users")
        .doc(loggedInUserDocId)
        .update({
            following: isFollowingProfile      //   updating our following and increment it to 1 (this particular another user)
                ? FieldValue.arrayRemove(profileId)
                : FieldValue.arrayUnion(profileId),
        });
}

export async function updateFollowedUserFollowers(
    profileDocId, //suggested profile/ another user document ID
    loggedInUserDocId, //current user's document ID (our profile)
    isFollowingProfile //check true / false => did us already follow this user?
) {
    return firebase
        .firestore()
        .collection("users")
        .doc(profileDocId)
        .update({
            followers: isFollowingProfile  //   updating another user's followers and increment to 1 (us)
                ? FieldValue.arrayRemove(loggedInUserDocId)
                : FieldValue.arrayUnion(loggedInUserDocId),
        });
}

export async function getPhotos(userId, following) {
    const result = await firebase
        .firestore()
        .collection("photos")
        .where("userId", "in", following)
        .get();

    const userFollowedPhotos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id,
    }));

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            const user = await getUserByUserId(photo.userId);
            const { username } = user[0];
            return { username, ...photo, userLikedPhoto };
        })
    );

    return photosWithUserDetails;
}

export async function getUserPhotosByUsername(username) {
    const [user] = await getUserByUsername(username);
    const result = await firebase
        .firestore()
        .collection("photos")
        .where("userId", "==", user.userId)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
    }));
}

export async function isUserFollowingProfile(
    loggedInUserUsername,
    profileUserId
) {
    const result = await firebase
        .firestore()
        .collection("users")
        .where("username", "==", loggedInUserUsername)
        .where("following", "array-contains", profileUserId)
        .get();

    //destructuring response from array, and make it return to an object
    const [response = {}] = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
    }));

    return response.userId;
}

export async function toggleFollow(
    isFollowingProfile, //  => are we following this particular another user? (true/ false)
    activeUserDocId,    //  => our docId
    profileDocId,       //  => another user's docId
    profileUserId,      //  => another user's userId
    followingUserId     //  => our userId
) { 
    //1st param: our docId
    //2nd param: other user userId => the user that us requests to follow
    //3rd param: are we following this user's profile? (true/ false)
    await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile)

    //1st param: another user docId
    //2nd param: our userId
    //3rd param: are we following this user's profile? (true/ false)
    await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile)
}
