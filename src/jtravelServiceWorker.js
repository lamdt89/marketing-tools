self.addEventListener('message', function(e) {
    let data = e.data;
    console.log('service_worker', data)
    fetch(data).catch(err => throw err)
}, false);
