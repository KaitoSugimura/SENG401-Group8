import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import styles from "./Social.module.css";
import firebase from "firebase";
import FriendRequests from "./FriendRequests";
import Modal from "./Modal";
import Search from "./Search";
import AccountBanner from "../../Components/AccountBanner";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Slices/userSlice";

// const ENDPOINT = "http://localhost:5000";
// const ENDPOINT = "https://seng-401-server.onrender.com";
// const socket = io(ENDPOINT);

export default function Social() {
  const { user, auth } = useSelector((state) => state);
  const { userRef } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState("global");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [chatRef, setChatRef] = useState(
    projectFirestore.collection("chats").doc("global")
  );
  const [showSearch, setShowSearch] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  if (selectedChat && selectedChat !== "global" && user.data.unreadMessages[selectedChat._id] > 0) {
    userRef.update({
      [`unreadMessages.${selectedChat._id}`]: 0
    });
    // user.data.unreadMessages[selectedChat._id] = 0;
  }

  // Fetch friends
  useEffect(() => {
    const getFriends = async () => {
      const friends = await Promise.all(
        user.data.friends.map(async (friend) => {
          const doc = await friend.get();
          const { slimeType, slimeSkin } = doc.data();
          return {
            _id: doc.id,
            ...doc.data(),
            slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
          };
        })
      );

      setFriends(friends.sort((a, b) => a.username > b.username));
    };

    getFriends();
  }, [user.data.friends]);

  // Stupid stupid stupid code
  useEffect(() => {
    const unsub = chatRef
      .collection("messages")
      .orderBy("sentAt", "asc")
      .onSnapshot(async (snapshot) => {
        const messages = [];

        snapshot.docChanges().forEach((change) => {
          const message = change.doc.data();
          messages.push(message);
          setMessages((prev) => [message, ...prev]);
        });
      });

    return () => unsub();
  }, [chatRef]);

  // Set chatRef for selected channel, then above useEffect listens for messages
  // World's stupidest code right here
  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      if (selectedChat === "global") {
        setChatRef(projectFirestore.collection("chats").doc("global"));
      } else {
        // console.log("READ FROM SOCIAL");
        const [docs1, docs2] = await Promise.all([
          projectFirestore
            .collection("chats")
            .where("users", "array-contains", auth.uid)
            .get()
            .then((res) => res.docs),
          projectFirestore
            .collection("chats")
            .where("users", "array-contains", selectedChat._id)
            .get()
            .then((res) => res.docs),
        ]);
        const intersectDocs = docs1.filter((doc1) => {
          return docs2.some((doc2) => doc2.id === doc1.id);
        });

        // Create chat if it doesn't exist
        if (!intersectDocs[0]) {
          await projectFirestore.collection("chats").add({
            users: [auth.uid, selectedChat._id],
          });
        }

        setChatRef(intersectDocs[0].ref);
      }
    };
    console.log("getting messages")
    getMessages();
  }, [selectedChat]);

  const sendMessage = (e) => {
    e.preventDefault();

    // If message has content and a chat is selected
    if (message && selectedChat) {
      const newMessage = {
        content: message,
        username: user.data.username,
        id: auth.uid,
        slimePath: user.data.slimePath,
        sentAt: firebase.firestore.Timestamp.now(),
      };
      console.log(newMessage)

      setMessage("");
      chatRef.collection("messages").add(newMessage);

      if (selectedChat !== "global") {
        projectFirestore.collection("users").doc(selectedChat._id).update({
          [`unreadMessages.${auth.uid}`]: firebase.firestore.FieldValue.increment(1),
        });
      }
    }
  };

  const unfriend = async (id) => {
    const friendRef = projectFirestore.collection("users").doc(id);

    // Update user's friend requests and friends list
    dispatch(updateUser({
      friends: firebase.firestore.FieldValue.arrayRemove(friendRef),
      [`unreadMessages.${id}`]: firebase.firestore.FieldValue.delete(),
    }))

    // Update friend's friend list
    friendRef.update({
      friends: firebase.firestore.FieldValue.arrayRemove(userRef),
      [`unreadMessages.${auth.uid}`]: firebase.firestore.FieldValue.delete(),
    });

    setSelectedChat("global");
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
          <div className={styles.friendsHeader}>
            <h2>Friends</h2>
            <i
              className="material-symbols-outlined"
              onClick={() => setShowSearch(true)}
            >
              add
            </i>
            <i
              className="material-symbols-outlined"
              onClick={() => setShowRequests(true)}
            >
              markunread_mailbox
            </i>
          </div>
          <ul className={styles.friends}>
            {friends.map((friend, i) => (
              <li
                className={`${styles.friend} ${selectedChat === friend ? styles.selected : ""
                  }`}
                key={i}
                onClick={() => setSelectedChat(friend)}
              >
                <img
                  src={friend.slimePath + ".svg"}
                  className={styles.slimeBody}
                ></img>
                <div>
                  <p>{friend.username}</p>
                  <p className={`${styles.presence} ${styles[friend.status]}`}>
                    {friend.status}
                  </p>
                </div>
                {user.data.unreadMessages[friend._id] > 0 &&
                  <div className={styles.unreadMessages}>
                    {user.data.unreadMessages[friend._id]}
                  </div>
                }
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.userStatus}>
          <img
            src={user.data.slimePath + ".svg"}
            className={styles.slimeBody}
          ></img>
          <div>
            <p>{user.data.username}</p>
            <p className={`${styles.presence} ${styles.ONLINE}`}>ONLINE</p>
          </div>
        </div>
      </section>

      <section className={styles.chat}>
        <div className={styles.messages}>
          {selectedChat ? (
            messages.map((message, i) => (
              <div  key={i}>
                {i + 1 < messages.length &&
                  message.sentAt - messages[i + 1].sentAt > 60 && message.id != messages[i + 1].id && (
                    <div className={styles.DateTime}>{message.sentAt.toDate().toDateString() + " " + message.sentAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  )}
                <Message
                  message={message}
                  previousMessage={
                    i + 1 < messages.length ? messages[i + 1] : null
                  }
                 
                ></Message>
              </div>
            ))
          ) : (
            <div>Select a channel on the left to chat here.</div>
          )}
        </div>
        <form className={styles.messageForm} onSubmit={sendMessage}>
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
            <p className={styles.username}>{selectedChat.username}</p>
            <img
              src={selectedChat.slimePath + ".svg"}
              className={styles.slimeBody}
            ></img>
            <p>RankPoints: {selectedChat.rankPoints}</p>
            <button
              className={styles.unfriend}
              onClick={() => unfriend(selectedChat._id)}
            >
              <p>Unfriend</p>
              <i className="material-symbols-outlined">person_remove</i>
            </button>
          </>
        ) : (
          <div className={styles.World}>
            <p>World chat</p>
            <i className="material-symbols-outlined">public</i>
          </div>
        )}
      </section>

      {showSearch && (
        <Modal close={() => setShowSearch(false)}>
          <Search />
        </Modal>
      )}
      {showRequests && (
        <Modal close={() => setShowRequests(false)}>
          <FriendRequests />
        </Modal>
      )}
    </div>
  );
}
