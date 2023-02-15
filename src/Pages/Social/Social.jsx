import { useState } from "react";
import styles from "./Social.module.css"
// import { Button, ButtonGroup, Container, Dropdown, Row } from "react-bootstrap"

export default function Social() {
  const [selectedFriend, setSelectedFriend] = useState(null);
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
  const [message, setMessage] = useState('');

  const user = {
    username: "Rimuru Tempest",
    // status: "Online",
    slime: {
      color: "green",
      face: "happy",
    },
    rank: 7,
  }

  const [chat, setChat] = useState([
    {
      message: "JK",
      from: "Rimuru Tempest",
    },
    {
      message: ":(",
      from: "funny_man2",
    },
    {
      message: "No",
      from: "Rimuru Tempest",
    },
    {
      message: "Want to play?",
      from: "funny_man2",
    },
    {
      message: "Hi",
      from: "Rimuru Tempest",
    },
    {
      message: "Hello",
      from: "funny_man2",
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      message,
      from: user.username
    }

    if (selectedFriend && message) {
      setChat(prev => [newMessage, ...prev]);
      setMessage('');
    }
  }

  return (
    <div className={styles.social}>
      <section className={styles.leftSidebar}>
        <ul className={styles.friends}>
          {friends.map((friend, i) => (
            <li className={styles.friend} key={i} onClick={() => setSelectedFriend(friend)}>
              <div className={styles.slimeBody}>:3</div>
              <div>
                <p>{friend.username}</p>
                <p className={`${styles.presence} ${styles[friend.status]}`}>{friend.status}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.userStatus}>
          <div className={styles.slimeBody}>:3</div>
          <div>
            <p>{user.username}</p>
            <p className={`${styles.presence} ${styles.Online}`}>Online</p>
          </div>
        </div>
      </section>

      <section className={styles.chat}>
        <div className={styles.messages}>
          {selectedFriend ?
            chat.map(message => (
              <div className={`${styles.message} ${message.from === user.username ? styles.mine : ''}`}>
                <p>{message.message}</p>
              </div>
            ))
            : (
              <div>Select a friend to chat with them here.</div>
            )}
        </div>
        <form className={styles.messageForm} onSubmit={handleSubmit}>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button><i className="material-symbols-outlined">send</i></button>
        </form>
      </section >

      <section className={styles.rightSidebar}>
        {selectedFriend ? (
          <>
            <p>{selectedFriend.username}</p>
            <div className={styles.slimeBody}>:3</div>
            <p>Rank {selectedFriend.rank}</p>
          </>
        ) : (
          <div>Select a friend to see their information here.</div>
        )}
      </section>
    </div >
  )
}
