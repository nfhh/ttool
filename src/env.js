let baseURL
let APIURL
switch (process.env.NODE_ENV) {
  case 'development':
    baseURL = 'http://10.18.13.153:8181'
    APIURL = 'http://toolx.test/api/'
    break
  case 'production':
    baseURL = location.origin
    APIURL = 'http://tool.terra-master.com/api/'
    break
  default:
    break
}

export default {
  baseURL,
  APIURL
}
