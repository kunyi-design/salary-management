import axios from './axios'

class ClassEmployee {
  constructor(apiEndpoint = '/employees') {
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
  async put(url, inputs) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.apiEndpoint + url, inputs)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async get(url, code) {
    let path = this.apiEndpoint
    if (url) path = this.apiEndpoint + url
    if (code) path = this.apiEndpoint + '/' + code
    return new Promise((resolve, reject) => {
      axios
        .get(path)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async delete(inputs) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + '/delete', inputs)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new ClassEmployee()
