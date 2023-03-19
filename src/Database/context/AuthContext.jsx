import { createContext, useEffect, useReducer, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import firebase from "firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRef, setUserRef] = useState(null);
  const [userLoaded, setuserLoaded] = useState(false);

  useEffect(() => {
    const unsubAuth = projectAuth.onAuthStateChanged(async (user) => {
      // If user is logged in
      if (user) {
        // Get reference to user data document
        const userRef = projectFirestore.collection("users").doc(user.uid);
        setUserRef(userRef);

        const userData = await userRef.get();

        // If user data doesn't exist
        if (!userData.exists) {
          // Account is new: create user data
          await userRef.set({
            level: 31,
            rank: 15,
            musicVolume: 100,
            gold: 1234,
            gems: 2,
            chestLastOpenedOn: firebase.firestore.Timestamp.fromMillis(Date.now() - 86400),
            bannerFilepath: "/Account/Banners/Sky.jpg"
          });
        }

        // Subscribe to user data changes
        const unsubFirestore = userRef.onSnapshot((doc) => {
          console.log({ ...user, data: doc.data() });
          // Attach user data (level, gold, etc.) to data property of user
          setUser({ ...user, data: doc.data() });
          setuserLoaded(true);
        })

        return unsubFirestore;
      } else {
        setuserLoaded(true);
        setUser(null);
      }
    });

    return () => {
      unsubAuth();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRef, userLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
