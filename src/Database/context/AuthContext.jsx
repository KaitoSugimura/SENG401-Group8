import { createContext, useEffect, useReducer, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import firebase from "firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRef, setUserRef] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const unsubAuth = projectAuth.onAuthStateChanged(async (user) => {
      // If user is logged in
      if (user) {
        // Get reference to user data document
        const userRef = projectFirestore.collection("users").doc(user.uid);
        setUserRef(userRef);

        const userData = await userRef.get();

        // // Placeholder friends
        // const friends = [];
        // ["dThrxOT2NHNboaRNGkpsY2JBUf22", "zfF4DaVYqnep4a266euByoWbcLl1", "FRlFwdxGq1cToR3ttvXqhEFJScA3"].forEach(friendID => {
        //   if (friendID != user.uid) {
        //     friends.push(projectFirestore.collection("users").doc(friendID));
        //   }
        // })

        // If user data doesn't exist
        if (!userData.exists) {
          // Account is new: create user data
          await userRef.set({
            username: user.displayName,
            level: 1,
            rankPoints: 1000,
            musicVolume: 1,
            gold: 1234,
            skinShard: 3600,
            characterShard: 1800,
            chestLastOpenedOn: firebase.firestore.Timestamp.fromMillis(0),
            bannerFilepath: "/Account/Banners/Sky.jpg",
            message: "Hello I am a good slime!",
            slimeType: "Normal",
            slimeSkin: 1,
            status: "ONLINE",
            slimes: ["Normal1"],
            friends: [],
            friendRequests: [],
            bannerUnlocked: 0b0000000010001000000011000010,
          });
        }

        // Subscribe to user data changes
        const unsubFirestore = userRef.onSnapshot((doc) => {
          const data = doc.data();
          const { slimeType, slimeSkin } = data;

          // Attach user data (level, gold, etc.) to data property of user
          setUser({
            ...user,
            data: {
              ...data,
              slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
              daysSinceLastChest: (Date.now() - data.chestLastOpenedOn.toDate()) / 1000 / 60 / 60 / 24,
            }
          });
          setUserLoaded(true);
        })

        return unsubFirestore;
      } else {
        setUser(null);
        setUserLoaded(true);
      }
    });

    return unsubAuth;
  }, []);

  // // DEBUGGING
  // useEffect(() => {
  //   if (user) {
  //     console.log(user);
  //   }
  // }, [user])

  return (
    <AuthContext.Provider value={{ user, userRef, userLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
