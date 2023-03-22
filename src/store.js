import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slices/authSlice'

// Utilizing slice reducers: https://redux.js.org/usage/structuring-reducers/splitting-reducer-logic
export default configureStore({
    reducer: {
        auth: authReducer,
    },
  })