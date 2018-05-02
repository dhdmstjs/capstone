import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `http://206.189.79.86:8081`
  })
}
