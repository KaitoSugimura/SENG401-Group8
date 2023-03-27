import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { projectAuth, projectFirestore } from "../Database/firebase/config";
import { setInitialState, updateUser, setExistingState, deleteExistingUser, setSlimePath, setDaysSinceLastChest, setUID } from './userSlice';
import firebase from "firebase";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await projectAuth.signInWithEmailAndPassword(
        email,
        password
      );

      const userRef = projectFirestore.collection("users").doc(response.user.uid);

      userRef.onSnapshot(async(doc) => {
        const data = doc.data();
        console.log("found doc data:")
        console.log(data);
        await thunkAPI.dispatch(setExistingState(data))
        thunkAPI.dispatch(setUID(user.uid))
        await thunkAPI.dispatch(setLoginStatus())
        // thunkAPI.dispatch(setLoginStatus())
      })
      
      // await 

      return thunkAPI.fulfillWithValue();
    } catch (error) {
      console.log("Error while logging in..");
      const message = error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue("Error while logging in..");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
    async(_, thunkAPI) => {
    try {
      await projectAuth.signOut().then(() => {
         thunkAPI.dispatch(setLogoutStatus())
         thunkAPI.dispatch(deleteExistingUser())
      });

      return thunkAPI.fulfillWithValue();
    } catch (error) {
      console.log("Error while logging out..");
      const message = error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue("Error while logging out..");
    }
  }
);


// TODO: displayName not being updated properly
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, username }, thunkAPI) => {
    try {
      const response = await projectAuth.createUserWithEmailAndPassword(email, password).then(res => {
        console.log(res)
        console.log(res.user)
        res.user.updateProfile({ displayName: username })
        res.user.displayName = username;
        // Sets initial state of user
        thunkAPI.dispatch(setInitialState(res.user))
      })
      .catch(error => {
        console.log(error.message);
      })
      console.log(response)
      return thunkAPI.fulfillWithValue();
    } catch (error) {
      console.log("Error while registering..");
      const message = error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue("Error while registering..");
    }
  }
);

// Checks persistent login using onAuthStateChanged
export const check_login = createAsyncThunk(
  "auth/check_login",
  async({}, thunkAPI) => {
    console.log("trying to check..")
    projectAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = projectFirestore.collection("users").doc(user.uid);
        userRef.onSnapshot(async (doc) => {
          const data = doc.data();
          await thunkAPI.dispatch(setExistingState(data))
          thunkAPI.dispatch(setSlimePath())
          thunkAPI.dispatch(setDaysSinceLastChest())
          thunkAPI.dispatch(setUID(user.uid))
          await thunkAPI.dispatch(setLoginStatus())
        })  
        
        console.log(userRef)
        console.log(user)
        
        console.log("heya check login");
      } else {
        console.log("user not found")
      }
    })
    return thunkAPI.fulfillWithValue();
  }
);

// A 'slice' is a state object that is in the store.
// By using the createSlice API, we can write clean code that doesn't worry about "mutating" logic
// Under the hood, new immutable state is being recreated based on changes described in reducer.
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    uid: null
  },
  // TODO: Remove once DB returns all this data
  reducers: {
    // setLoginStatus: (state, action) => {
    //   const user = action.payload

    //   // Placeholder friends
    //   // Delete this later on
    //   const friends = ["dThrxOT2NHNboaRNGkpsY2JBUf22", "zfF4DaVYqnep4a266euByoWbcLl1", "FRlFwdxGq1cToR3ttvXqhEFJScA3"];
    //   state.user = {
    //     username: user.displayName,
    //     level: Math.floor(Math.random() * 50),
    //     rank: Math.floor(Math.random() * 30),
    //     musicVolume: 100,
    //     gold: 1234,
    //     chestLastOpenedOn: firebase.firestore.Timestamp.fromMillis(0),
    //     bannerFilepath: "/Account/Banners/Sky.jpg",
    //     slimeType: "Normal",
    //     slimeSkin: 1,
    //     status: "ONLINE",
    //     friends,
    //   }
    // },
    // setData: (state, action) => {
    //   console.log("setting data")
    //   const data = action.payload
    //   console.log(data)
    //   const { slimeType, slimeSkin } = data;
    //   state.user.data = {
    //     ...data,
    //     slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
    //     daysSinceLastChest: (Date.now() - data.chestLastOpenedOn.toDate()) / 1000 / 60 / 60 / 24,
    //   }
    //   state.isLoggedIn = true;
    // },
    setLoginStatus: (state) => {
      console.log("login status being set to true")
      state.isLoggedIn = true;
    },
    setLogoutStatus: (state) => {
      console.log("login status being set to false")
      state.isLoggedIn = false;
    },
  },
  // In the future, I think these thunks should directly update state using action.payload
  // Meaning that the state.user should be the raw firebase data here.
  // And the actual properties of the users ex: username, level, rank should be retrieved straight from the db, not hardcoded
  // This means that the pure reducer on the top wouldn't be needed.
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      console.log("login fulfilled!")
    },
    [login.rejected]: (state, action) => {
      throw new Error("Email and password do not match.");
    },
    [logout.fulfilled]: (state, action) => {
      console.log("logout fulfilled!")
    },
    [logout.rejected]: (state, action) => {
      console.log("???")
    },
    [check_login.fulfilled]: (state, action) => {
      console.log("login session action fulfilled!")
    },
    [check_login.rejected]: (state, action) => {
      console.log("login session not found")
    },
    [register.fulfilled]: (state, action) => {
      console.log("register fulfilled!")
    },
    [register.rejected]: (state, action) => {
      console.log("register not fulfilled..")
    },
  }
})

// Action creators are generated for each case reducer function
// export const { login, logout } = authSlice.actions
export const { setLoginStatus, setLogoutStatus } = authSlice.actions
export default authSlice.reducer