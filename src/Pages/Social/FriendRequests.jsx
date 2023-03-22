import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import styles from "./Social.module.css";
import firebase from "firebase";

const FriendRequests = ({ close }) => {
  const { user, userRef } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const requests = await Promise.all(user.data.friendRequests.map(async sender => {
        const doc = await sender.get();
        const { slimeType, slimeSkin } = doc.data();
        return {
          _id: doc.id,
          ...doc.data(),
          slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
        };
      }));

      setRequests(requests.sort((a, b) => a.username > b.username));
    }

    getFriends();
  }, [user.data.friendRequests]);

  const rejectRequest = async (id) => {
    const friendRef = projectFirestore.collection("users").doc(id);

    // Remove request from user's request list
    userRef.update({
      friendRequests: firebase.firestore.FieldValue.arrayRemove(friendRef),
    })
  }

  const acceptRequest = async (id) => {
    const friendRef = projectFirestore.collection("users").doc(id);

    // Update user's friend requests and friends list
    userRef.update({
      friendRequests: firebase.firestore.FieldValue.arrayRemove(friendRef),
      friends: firebase.firestore.FieldValue.arrayUnion(friendRef)
    })

    // Update friend's friend list
    friendRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(userRef)
    })
  }

  return (
    <div className={styles.modalBackdrop} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.friendRequestsHeader}>Incoming Friend Requests</h2>
        {user.data.friendRequests.length > 0 ?
          <ul>
            {requests.map((request, i) =>
              <li className={styles.friend} key={request._id} >
                <img src={request.slimePath + ".svg"} className={styles.slimeBody}></img>
                <div>
                  <p>{request.username}</p>
                  <p className={`${styles.presence} ${styles[request.status]}`}>
                    {request.status}
                  </p>
                </div>
                <div className={styles.requestActions}>
                  <i className="material-symbols-outlined" onClick={() => rejectRequest(request._id)}>close</i>
                  <i className="material-symbols-outlined" onClick={() => acceptRequest(request._id)}>done</i>
                </div>
              </li>
            )}
          </ul>
          : <p>You have no incoming friend requests.</p>}
      </div>
    </div>
  );
}

export default FriendRequests;