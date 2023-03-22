import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { projectAuth, projectFirestore } from "../Database/firebase/config";
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
      userRef.onSnapshot((doc) => {
        const data = doc.data();
        thunkAPI.dispatch(setData(data))
      })
      
      thunkAPI.dispatch(setLoginStatus(response.user))


      return thunkAPI.fulfillWithValue();
    } catch (error) {
      console.log("Error while logging in..");
      const message = error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue();
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async ({ }, thunkAPI) => {
    try {
      await projectAuth.signOut();
      console.log("logged out")
      return thunkAPI.fulfillWithValue();
    } catch (error) {
      console.log("Error while logging in..");
      const message = error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue();
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
        userRef.onSnapshot((doc) => {
          const data = doc.data();
          thunkAPI.dispatch(setData(data))
        })  
        thunkAPI.dispatch(setLoginStatus(user))
        console.log("heya check login");
      } 
    })
    return thunkAPI.fulfillWithValue();
  }
);

// TODO: Create register and logout thunk

// A 'slice' is a state object that is in the store.
// By using the createSlice API, we can write clean code that doesn't worry about "mutating" logic
// Under the hood, new immutable state is being recreated based on changes described in reducer.
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
    },
  },
  // TODO: Remove once DB returns all this data
  reducers: {
    setLoginStatus: (state, action) => {
      const user = action.payload

      // Placeholder friends
      // Delete this later on
      const friends = ["dThrxOT2NHNboaRNGkpsY2JBUf22", "zfF4DaVYqnep4a266euByoWbcLl1", "FRlFwdxGq1cToR3ttvXqhEFJScA3"];
      state.user = {
        username: user.displayName,
        level: Math.floor(Math.random() * 50),
        rank: Math.floor(Math.random() * 30),
        musicVolume: 100,
        gold: 1234,
        chestLastOpenedOn: firebase.firestore.Timestamp.fromMillis(0),
        bannerFilepath: "/Account/Banners/Sky.jpg",
        slimeType: "Normal",
        slimeSkin: 1,
        status: "ONLINE",
        friends,
      }
    },
    setData: (state, action) => {
      console.log("setting data")
      const data = action.payload
      console.log(data)
      const { slimeType, slimeSkin } = data;
      state.user.data = {
        ...data,
        slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
        daysSinceLastChest: (Date.now() - data.chestLastOpenedOn.toDate()) / 1000 / 60 / 60 / 24,
      }
      state.isLoggedIn = true;
    }
  },
  // In the future, I think these thunks should directly update state using action.payload
  // Meaning that the state.user should be the raw firebase data here.
  // And the actual properties of the users ex: username, level, rank should be retrieved straight from the db, not hardcoded
  // This means that the pure reducer on the top wouldn't be needed.
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      // state.isLoggedIn = true;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [logout.fulfilled]: (state, action) => {
      console.log('fullfilled');
      state.isLoggedIn = false;
    },
    [logout.rejected]: (state, action) => {
      // state.isLoggedIn = false;
    },
    [check_login.fulfilled]: (state, action) => {
      // state.isLoggedIn = true;
    },
    [check_login.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
  }
})

// Action creators are generated for each case reducer function
// export const { login, logout } = authSlice.actions
export const {setLoginStatus, setData} = authSlice.actions
export default authSlice.reducer