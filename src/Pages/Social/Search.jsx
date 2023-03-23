import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import firebase from "firebase";
import styles from './Social.module.css'

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { user, userRef } = useContext(AuthContext);

  useEffect(() => {
    const searchUsers = async () => {
      const result = [];
      const users = await projectFirestore.collection("users")
        .where('username', '>=', search)
        .where('username', '<=', `${search}\uf8ff`)
        .get();


      const friendIDs = user.data.friends.map(friend => friend.id);

      users.forEach(doc => {
        // Skip if this user is you 
        if (doc.id === user.uid) {
          return;
        }

        // Skip if you're already friends with this user
        if (friendIDs.includes(doc.id)) {
          return;
        }

        // Skip if you already sent a friend request to this user
        if (doc.data().friendRequests.map(request => request.id).includes(user.uid)) {
          return;
        }

        const { slimeType, slimeSkin } = doc.data();
        result.push({
          _id: doc.id,
          ...doc.data(),
          slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
        });
      });
      setResults(result);
    }

    searchUsers();
  }, [search]);

  const sendRequest = async (i) => {
    projectFirestore.collection("users").doc(results[i]._id).update({
      friendRequests: firebase.firestore.FieldValue.arrayUnion(userRef)
    });

    setResults(prev => prev.filter((_, j) => i !== j));
  }

  return (
    <>
      <h2 className={styles.friendRequestsHeader}>Add Friends</h2>
      <input className={styles.textInput} type="text" placeholder="Enter a username here" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)} />
      <ul className={styles.results}>
        {results.map((user, i) =>
          <li className={styles.friend} key={user._id} >
            <img src={user.slimePath + ".svg"} className={styles.slimeBody}></img>
            <div>
              <p>{user.username}</p>
              <p className={`${styles.presence} ${styles[user.status]}`}>
                {user.status}
              </p>
            </div>
            <div className={styles.actions}>
              <i className="material-symbols-outlined" onClick={() => sendRequest(i)}>add</i>
            </div>
          </li>
        )}
      </ul>
    </>
  );
}

export default Search;