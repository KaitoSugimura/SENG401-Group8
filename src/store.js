import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './Slices/authSlice'
import userReducer from './Slices/userSlice'
import thunkMiddleware from 'redux-thunk';

// Grouping all reducers we've created
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
})

// Utilizing slice reducers: https://redux.js.org/usage/structuring-reducers/splitting-reducer-logic
export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    [...getDefaultMiddleware({
      serializableCheck: {
          // Ignore these paths in the state
          ignoredActionPaths: ['payload'],
          ignoredPaths: ['auth', 'user']
      },
    }), thunkMiddleware]

  })
} 