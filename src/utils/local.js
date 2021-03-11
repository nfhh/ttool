export function getLocalAccessToken () {
  try {
    return localStorage.access_token
  } catch (e) {
    return null
  }
}

export function setLocalAccessToken (token) {
  localStorage.access_token = `Bearer ${token}`
}

export function removeLocalAccessToken () {
  localStorage.removeItem('access_token')
}

export function getLocalUserInfo () {
  try {
    return JSON.parse(localStorage.user_info)
  } catch (e) {
    return {}
  }
}

export function setLocalUserInfo (user) {
  localStorage.user_info = JSON.stringify(user)
}

export function removeLocalUserInfo () {
  localStorage.removeItem('user_info')
}
