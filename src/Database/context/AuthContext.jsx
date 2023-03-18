import { createContext, useEffect, useReducer } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import firebase from "firebase";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(async (user) => {
      // If user is logged in
      if (user) {
        let userData = await projectFirestore.collection("users").doc(user.uid).get().then(res => res.data());

        // If user data doesn't exist
        if (!userData) {
          // Account is new: create user data
          userData = {
            level: 31,
            rank: 15,
            musicVolume: 100,
            gold: 1234,
            gems: 2,
            chestLastOpenedOn: firebase.firestore.Timestamp.fromMillis(Date.now() - 86400),
            bannerFilepath: "/Account/Banners/Sky.jpg"
          }


          await projectFirestore.collection("users").doc(user.uid).set(userData);
        }

        // Attach user information (level, gold, etc.) to data property of user
        user = { ...user, data: userData };

        console.log(user);
        dispatch({ type: "AUTH_IS_READY", payload: user });
      }
    });

    return () => {
      unsub();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
