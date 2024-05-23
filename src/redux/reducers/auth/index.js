// **  Initial State
const data = window.localStorage.getItem('data')
const initialState = {
  userData: data ? JSON.parse(data): {}
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.data,
        userData: { ...action.data},
        accessToken: action.data.accessToken,
        refreshToken: action.data.refreshToken
      }
    case 'LOGOUT':
      const obj = { ...action }
      delete obj.type
      return { ...state, userData: {}, ...obj }
    default:
      return state
  }
}

export default authReducer
