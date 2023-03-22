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

      return { ...response };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log("Error while logging in..");
      console.log(message);
      return thunkAPI.rejectWithValue();
    }
  }
);

// TODO: Create register and logout thunk

// A 'slice' is a state object that is in the store.
// By using the createSlice API, we can write clean code that doesn't worry about "mutating" logic
// Under the hood, new immutable state is being recreated based on changes described in reducer.
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    value: {
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
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      const user = action.payload.user

      // Placeholder friends
      // Delete this later on
      const friends = ["dThrxOT2NHNboaRNGkpsY2JBUf22", "zfF4DaVYqnep4a266euByoWbcLl1", "FRlFwdxGq1cToR3ttvXqhEFJScA3"];

      state.value = {
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
        friends
      }
      console.log(state.value)
    },
    [login.rejected]: (state, action) => {

    },
  }
})

// Action creators are generated for each case reducer function
// export const { login, logout } = authSlice.actions

export default authSlice.reducer