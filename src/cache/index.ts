import WebStorageCache from 'web-storage-cache'

const wsCache = new WebStorageCache({
    storage: 'sessionStorage'
})

export default wsCache
