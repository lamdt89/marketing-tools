let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

if (!indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const DB = {db: false};
const db_name = 'ProofData';

const db_req = indexedDB.open(db_name, 2);
db_req.onupgradeneeded = function (ev) {
    let db = ev.target.result;
    db.createObjectStore('short_code', {keyPath: "name"});
};
db_req.onsuccess = function (ev) {
    DB.db = ev.target.result;
};

DB.save = function (_name, item) {
    let transaction = DB.db.transaction([_name], "readwrite");
    let store = transaction.objectStore(_name);
    return new Promise((resolve, reject) => {
        let rq = store.put(item);
        rq.onsuccess = function (ev) {
            resolve();
        }
        rq.onerror = function (ev) {
            reject("Can't save proof data of " + item.name + " to indexedDB!")
        }
    })
}

DB.get = function (_name, key) {
    let transaction = DB.db.transaction([_name], "readwrite");
    let store = transaction.objectStore(_name);
    return new Promise((resolve, reject) => {
        const rq = store.get(key);
        rq.onsuccess = function (ev) {
            resolve(rq.result);
        }
        rq.onerror = function (ev) {
            reject("Can't get data of " + key + " from indexedDB!");
        }
    })
}

