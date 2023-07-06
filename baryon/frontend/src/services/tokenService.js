// sets token
const setToken = new_token => {
    window.localStorage.setItem('AuthToken', new_token)
}

// gets token
const getToken = () => {
    const token = window.localStorage.getItem('AuthToken')
    return token ? `Bearer ${token}` : null
}

// gets authorization header
const getAuthHeader = () => {
    const auth = {headers: {}}
    const token = getToken()
    if (token !== null) auth.headers.Authorization = token
    return auth
}

const tokenService = { setToken, getToken, getAuthHeader }

export default tokenService