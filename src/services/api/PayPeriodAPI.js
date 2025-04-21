import axios from './axios'

class ClassPayPeriod {
  constructor(apiEndpoint = '/pay-period') {
    this.apiEndpoint = apiEndpoint
  }

  async post(inputs) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint, inputs)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }

  async put(url, inputs) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.apiEndpoint + url, inputs)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async get(url = '') {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint + url)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async delete(code) {
    return new Promise((resolve, reject) => {
      axios
        .delete(this.apiEndpoint + '/' + code)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new ClassPayPeriod()
