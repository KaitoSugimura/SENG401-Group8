import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { projectAuth, projectFirestore } from "../Database/firebase/config";
import firebase from "firebase";
import { AuthContext } from "../Database/context/AuthContext";
import { useContext, useEffect, useState } from "react";


const { userRef } = useContext(AuthContext);

// export const updateBanner = createAsyncThunk(
//     "user/updateBanner",
//     async ({ bannerPath }, thunkAPI) => {
//       try {
//         userRef.update({ bannerFilepath: bannerPath });
//         thunkAPI.dispatch(setBannerFilePath(bannerPath))
//         return thunkAPI.fulfillWithValue();
//       } catch (error) {
//         const message = error.toString();
//         console.log("Error while setting banner..");
//         console.log(message);
//         return thunkAPI.rejectWithValue("Error while setting banner..");
//       }
//     }
// );

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async ({ toUpdate }, thunkAPI) => {
      try {
        userRef.update(toUpdate);
        
        // Check if we need to update the store
        for(const property in object) {
            switch(property) {
                case 'username':
                    thunkAPI.dispatch(setUsername(toUpdate.property))
                case 'level':
                    thunkAPI.dispatch(setLevel(toUpdate.property))                
                case 'rank':
                    thunkAPI.dispatch(setRank(toUpdate.property))                
                case 'musicVolume':
                    thunkAPI.dispatch(setMusicVolume(toUpdate.property))                
                case 'gold':
                    thunkAPI.dispatch(setGold(toUpdate.property))                
                case 'chestLastOpenedOn':
                    thunkAPI.dispatch(setChestLastOpened(toUpdate.property))                
                case 'bannerFilepath':
                    thunkAPI.dispatch(setBannerFilePath(toUpdate.property))                
                case 'slimeType':
                    thunkAPI.dispatch(setSlimeType(toUpdate.property))                
                case 'slimeSkin':
                    thunkAPI.dispatch(setSlimeSkin(toUpdate.property))                
                case 'status':
                    thunkAPI.dispatch(setStatus(toUpdate.property))                
                case 'friends':
                    thunkAPI.dispatch(setFriends(toUpdate.property))                
                case 'message':
                    thunkAPI.dispatch(setMessage(toUpdate.property))    
                case 'friendRequests':
                    thunkAPI.dispatch(setFriendRequests(toUpdate.property))    
            }
        }
        
        return thunkAPI.fulfillWithValue();
      } catch (error) {
        const message = error.toString();
        console.log("Error while updating user..");
        console.log(message);
        return thunkAPI.rejectWithValue("Error while updating user..");
      }
    }
);

// export const unlockAllBanners = createAsyncThunk(
//     "user/unlockAllBanners",
//     async ({ }, thunkAPI) => {
//       try {
//         userRef.update({ bannerUnlocked: 0b1111111111111111111111111111 });
//         return thunkAPI.fulfillWithValue();
//       } catch (error) {
//         const message = error.toString();
//         console.log("Error while unlocking all banners..");
//         console.log(message);
//         return thunkAPI.rejectWithValue("Error while unlocking all banners..");
//       }
//     }
//   );


// export const updateMessage = createAsyncThunk(
//     "user/updateMessage",
//     async ({ message }, thunkAPI) => {
//         try {
//             userRef.update({ message: newMessage });
//             thunkAPI.dispatch(setMessage(message))
//             return thunkAPI.fulfillWithValue();
//         } catch (error) {
//             const message = error.toString();
//             console.log("Error while setting message..");
//             console.log(message);
//             return thunkAPI.rejectWithValue("Error while setting message..");
//         }
//     }
// );

// Contains reducers that handle user action (ex: opening daily chest, setting main chracter, etc)
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: {
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
            message: null,
            friendRequests: null,
        }
    },
    // TODO: Remove once DB returns all this data
    reducers: {
        // Called from authSlice
        // This sets the initial state of the user upon account creation with default values
        setInitialState: (state, action) => {
            const user = action.payload

            // Placeholder friends
            // Delete this later on
            const friends = ["dThrxOT2NHNboaRNGkpsY2JBUf22", "zfF4DaVYqnep4a266euByoWbcLl1", "FRlFwdxGq1cToR3ttvXqhEFJScA3"];
            
            state.data = {
                username: user.displayName,
                level: Math.floor(Math.random() * 50),
                rank: Math.floor(Math.random() * 30),
                musicVolume: 100,
                gold: 1234,
                chestLastOpenedOn: firebase.firestore.Timestamp.fromMillis(0),
                bannerFilepath: "/Account/Banners/Sky.jpg",
                // Change these two and see if they're being set initially. if not set it in
                slimeType: "Normal",
                slimeSkin: 1,
                status: "ONLINE",
                friends,
            }
            // state.username = user.displayName
            // state.level = Math.floor(Math.random() * 50)
            // state.rank = Math.floor(Math.random() * 30)
            // state.musicVolume = 100
            // state.gold = 1234
            // state.chestLastOpenedOn = firebase.firestore.Timestamp.fromMillis(0)
            // state.bannerFilepath = "/Account/Banners/Sky.jpg"
            // state.slimeType = "Normal"
            // state.slimeSkin = 1
            // state.status = "ONLINE"
            // state.friends = friends
        },
        setUsername: (state, action) => {
            state.data.username = action.payload;
        },
        setLevel: (state, action) => {
            state.data.level = action.payload;
        }, 
        setRank: (state, action) => {
            state.data.rank = action.payload;
        },
        setMusicVolume: (state, action) => {
            state.data.musicVolume = action.payload;
        },
        setGold: (state, action) => {
            state.data.gold = action.payload;
        },
        setChestLastOpened: (state, action) => {
            state.data.chestLastOpenedOn = action.payload;
        },
        setBannerFilePath: (state, action) => {
            state.data.bannerFilepath = action.payload;
        },
        setSlimeType: (state, action) => {
            state.data.slimeType = action.payload;
        },
        setSlimeSkin: (state, action) => {
            state.data.slimeSkin = action.payload;
        },
        setStatus: (state, action) => {
            state.data.status = action.payload;
        },
        setFriends: (state, action) => {
            state.data.friends = action.payload;
        },
        setMessage: (state, action) => {
            state.data.message = action.payload;
        },
        setFriendRequests: (state, action) => {
            state.data.friendRequests = action.payload;
        }
    },
    // In the future, I think these thunks should directly update state using action.payload
    // Meaning that the state.user should be the raw firebase data here.
    // And the actual properties of the users ex: username, level, rank should be retrieved straight from the db, not hardcoded
    // This means that the pure reducer on the top wouldn't be needed.
    extraReducers: {

    }
  })
  
  // Action creators are generated for each case reducer function
  // export const { login, logout } = authSlice.actions
  export const {  } = authSlice.actions
  export default userSlice.reducer