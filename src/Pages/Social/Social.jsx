import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import styles from "./Social.module.css";
import firebase from "firebase";

// const ENDPOINT = "http://localhost:5000";
// const ENDPOINT = "https://seng-401-server.onrender.com";
// const socket = io(ENDPOINT);

export default function Social() {
  const { user } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState("global");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [chatRef, setChatRef] = useState(projectFirestore.collection("chats").doc("global"));

  // Fetch friends
  useEffect(() => {
    const getFriends = async () => {
      const friends = await Promise.all(user.data.friends.map(async friend => {
        const doc = await friend.get();
        const { slimeType, slimeSkin } = doc.data();
        return {
          _id: doc.id,
          ...doc.data(),
          slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
        };
      }))

      setFriends(friends);
    }

    getFriends();
  }, []);

  // Stupid stupid stupid code
  useEffect(() => {
    const unsub = chatRef.collection("messages").orderBy("sentAt", "asc").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        setMessages(prev => [change.doc.data(), ...prev])
      })
    });

    return () => unsub();
  }, [chatRef]);

  // Fetch messages for selected channel
  // World's stupidest code right here
  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      if (selectedChat === "global") {
        setChatRef(projectFirestore.collection("chats").doc("global"));
      } else {
        const docs1 = await projectFirestore.collection("chats").where("users", "array-contains", user.uid).get().then(res => res.docs);
        const docs2 = await projectFirestore.collection("chats").where("users", "array-contains", selectedChat).get().then(res => res.docs);

        const intersectDocs = docs1.filter((doc1) => {
          return docs2.some((doc2) => doc2.id === doc1.id);
        });

        // Create chat if it doesn't exist
        if (!intersectDocs[0]) {
          await projectFirestore.collection("chats").add({
            users: [user.uid, selectedChat]
          })
        }

        setChatRef(intersectDocs[0].ref);
      }
    }

    getMessages();
  }, [selectedChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If message has content and a chat is selected
    if (message && selectedChat) {
      const newMessage = {
        content: message,
        sender: user.data.username,
        sentAt: firebase.firestore.Timestamp.now(),
      };

      setMessage("");
      await chatRef.collection("messages").add(newMessage);
    }
  };

  return (
    <div className={styles.social}>
      <section className={styles.leftSidebar}>
        <div className={styles.channels}>
          <div
            className={`${styles.global} ${selectedChat === "global" ? styles.selected : ""
              }`}
            onClick={() => setSelectedChat("global")}
          >
            <i className="material-symbols-outlined">public</i>
            <p>World</p>
          </div>
          <h2 className={styles.friendsHeader}>Friends</h2>
          <ul className={styles.friends}>
            {friends.map((friend, i) => (
              <li
                className={`${styles.friend} ${selectedChat === friend ? styles.selected : ""
                  }`}
                key={i}
                onClick={() => setSelectedChat(friend._id)}
              >
                <img src={friend.slimePath + ".svg"} className={styles.slimeBody}></img>
                <div>
                  <p>{friend.username}</p>
                  <p className={`${styles.presence} ${styles[friend.status]}`}>
                    {friend.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.userStatus}>
          <img src={user.data.slimePath + ".svg"} className={styles.slimeBody}></img>
          <div>
            <p>{user.data.username}</p>
            <p className={`${styles.presence} ${styles.ONLINE}`}>ONLINE</p>
          </div>
        </div>
      </section>

      <section className={styles.chat}>
        <div className={styles.messages}>
          {selectedChat ? (
            messages.map((message, i) => {
              return (
                <div
                  className={`${styles.messageContainer} ${message.sender === user.data.username ? styles.mine : ""
                    }`}
                  key={i}
                >
                  <p className={styles.name}>{message.sender}</p>
                  <p className={styles.message}>{message.content}</p>
                </div>
              );
            })
          ) : (
            <div>Select a channel on the left to chat here.</div>
          )}
        </div>
        <form className={styles.messageForm} onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button>
            <i className="material-symbols-outlined">send</i>
          </button>
        </form>
      </section>

      <section className={styles.rightSidebar}>
        {selectedChat && selectedChat !== "global" ? (
          <>
            <p>{selectedChat.name}</p>
            <img src={user.data.slimePath + ".svg"} className={styles.slimeBody}></img>
            <p>Rank {selectedChat.rank}</p>
          </>
        ) : (
          <div className={styles.World}>
            <p>World chat</p>
            <i className="material-symbols-outlined">public</i>
          </div>
        )}
      </section>
    </div>
  );
}
