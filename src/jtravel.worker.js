self.addEventListener(
  'message',
  function (e) {
    const data = e.data
    console.log('service_worker', data)
    data.call(data.eventName, data.data)
  },
  false
)
