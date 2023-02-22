import { useEffect, useState } from "react";
import styles from "./Social.module.css"

export default function Social() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friends, setFriends] = useState([
    {
      username: "funny_man2",
      status: "Online",
      slime: {
        color: "green",
        face: "happy",
      },
      rank: 7,
    },
    {
      username: "Sidekick",
      status: "Away",
      slime: {
        color: "green",
        face: "happy",
      },
      rank: 121,
    },
    {
      username: "xX_GitGud_Xx",
      status: "Offline",
      slime: {
        color: "green",
        face: "happy",
      },
      rank: 2,
    },
    {},
    {},
    {},
    {},
    {},
    {},
  ]);

  const user = {
    _id: "63f67ca701b010b2c4379399",
    name: "Rimuru Tempest",
    email: "rimuru@example.com",
    status: "ONLINE",
    rank: 7,
    friends: [],
    friendRequests: [],
    slime: {
      color: "green",
      face: "happy",
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3Y2E3MDFiMDEwYjJjNDM3OTM5OSIsImlhdCI6MTY3NzA5ODE1MSwiZXhwIjoxNjc5NjkwMTUxfQ.gSXaeP1jQJN84qiWpvt2f5an7OxvHf5xEeytYV57bdw"
  }

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      if (selectedChat === "global") { // If user selected global chat
        setSelectedUser(null);

        const data = await fetch("http://localhost:5000/api/chat/global", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }).then(res => res.json());

        console.log(data);
        setMessages(data.reverse());
      } else if (selectedChat) { // If user selected friend
        setSelectedUser(selectedChat);
        setMessages([]);
      } else { // Else, user closed chat
        setSelectedUser(null);
      }
    }

    getMessages();
  }, [selectedChat])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      content: message,
      sender: user
    }

    if (selectedChat === "global" && message) {
      await fetch("http://localhost:5000/api/chat/global", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        method: "post",
        body: JSON.stringify(newMessage)
      });
      setMessage('');
    } else {

    }
    if (selectedChat && message) {
      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
    }
  }

  return (
    <div className={styles.social}>
      <section className={styles.leftSidebar}>
        <div className={styles.channels}>
          <div className={`${styles.global} ${selectedChat === "global" ? styles.selected : ''}`} onClick={() => setSelectedChat("global")}>
            <i className="material-symbols-outlined">public</i>
            <p>World</p>
          </div>
          <h2 className={styles.friendsHeader}>Friends</h2>
          <ul className={styles.friends}>
            {friends.map((friend, i) => (
              <li className={styles.friend} key={i} onClick={() => setSelectedChat(friend)}>
                <div className={styles.slimeBody}>:3</div>
                <div>
                  <p>{friend.username}</p>
                  <p className={`${styles.presence} ${styles[friend.status]}`}>{friend.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.userStatus}>
          <div className={styles.slimeBody}>:3</div>
          <div>
            <p>{user.name}</p>
            <p className={`${styles.presence} ${styles.Online}`}>Online</p>
          </div>
        </div>
      </section>

      <section className={styles.chat}>
        <div className={styles.messages}>
          {selectedChat ?
            messages.map((message, i) => {
              return (
                <div className={`${styles.messageContainer} ${message.sender._id === user._id ? styles.mine : ''}`} key={i}>
                  <p className={styles.name}>{message.sender.name}</p>
                  <p className={styles.message}>{message.content}</p>
                </div>
              )
            })
            : (
              <div>Select a channel on the left to chat here.</div>
            )}
        </div>
        <form className={styles.messageForm} onSubmit={handleSubmit}>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button><i className="material-symbols-outlined">send</i></button>
        </form>
      </section >

      <section className={styles.rightSidebar}>
        {selectedUser ? (
          <>
            <p>{selectedUser.username}</p>
            <div className={styles.slimeBody}>:3</div>
            <p>Rank {selectedUser.rank}</p>
          </>
        ) : (
          <div>Select a user to see their information here.</div>
        )}
      </section>
    </div >
  )
}
