// ** UseJWT import to get config
// import useJwt from '@src/auth/jwt/useJwt'

// const config = useJwt.jwtConfig

// ** Handle User Login
export const handleLogin = data => {
  return dispatch => {
    dispatch({
      type: 'LOGIN',
      data,
      config: {},
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    })

    // ** Add to user, accessToken & refreshToken to localStorage
    localStorage.setItem('userData', JSON.stringify(data))
    localStorage.setItem('accessToken', JSON.stringify(data.accessToken))
    localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken))
  }
}

// ** Handle User Logout
export const handleLogout = () => {
  return dispatch => {
    dispatch({ type: 'LOGOUT', 'accessToken': null, 'refreshToken': null })

    // ** Remove user, accessToken & refreshToken from localStorage
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
