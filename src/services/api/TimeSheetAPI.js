import axios from './axios'

class ClassTimeSheet {
  constructor(apiEndpoint = '/attendance') {
    this.apiEndpoint = apiEndpoint
  }

  async post(url, inputs) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + url, inputs)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async get(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint + url)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new ClassTimeSheet()
