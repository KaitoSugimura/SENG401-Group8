import reducer, { setLoginStatus, setLogoutStatus, setUID } from '../Slices/authSlice'

test('should return the initial state', () => {
  expect(reducer(undefined, { type: undefined })).toEqual(
    { isLoggedIn: false, uid: null }
  )
})

test('should set loginStatus to true', () => {
  expect(reducer(undefined, setLoginStatus())).toEqual(
    { isLoggedIn: true, uid: null }
  )
})

test('should set loginStatus to false', () => {
  expect(reducer(undefined, setLogoutStatus())).toEqual(
    { isLoggedIn: false, uid: null }
  )
})

test('should set UID to 1111111', () => {
  expect(reducer(undefined, setUID("1111111"))).toEqual(
    { isLoggedIn: false, uid: "1111111" }
  )
})