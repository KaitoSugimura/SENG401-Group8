import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slices/authSlice'
import userReducer from './Slices/userSlice'
import thunkMiddleware from 'redux-thunk';

// Utilizing slice reducers: https://redux.js.org/usage/structuring-reducers/splitting-reducer-logic
export default configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    },  
    middleware: (getDefaultMiddleware) =>
    [...getDefaultMiddleware({
      serializableCheck: {
          // Ignore these paths in the state
          ignoredActionPaths: ['payload'],
          ignoredPaths: ['auth']
      },
    }), thunkMiddleware]

  })