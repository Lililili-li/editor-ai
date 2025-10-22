const result = (message = '', code = 200, data = null) => {
  return {
    message,
    code,
    data
  }
}

module.exports = {
  result
}
