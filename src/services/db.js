import { openDB } from 'idb'

const DB_NAME = 'ink-and-soul'
const DB_VERSION = 1

let dbPromise

function getDB() {
    if(!dbPromise){
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if(!db.objectStoreNames.contains('writings')) {
                    const writingStore = db.createObjectStore('writings' , {
                        keyPath: 'id',
                    })

                    writingStore.createIndex('updatedAt', 'updatedAt')
                }

                if (!db.objectStoreNames.contains('books')){
                    db.createObjectStore('books', {
                        keyPath: 'id',
                    })
                }

                if (!db.objectStoreNames.contains('quotes')){
                    db.createObjectStore('quotes', {
                        keyPath: 'id',
                    })
                }
            },

        }).catch((error) => {
            dbPromise = undefined
            throw error
        })
    }

    return dbPromise
}



async function addRecord(storeName, record) {
  const db = await getDB()
  return db.add(storeName, record)
}

async function getRecord(storeName, id) {
  const db = await getDB()
  return db.get(storeName, id)
}

async function getAllRecords(storeName) {
  const db = await getDB()
  return db.getAll(storeName)
}

async function updateRecord(storeName, record) {
  const db = await getDB()
  return db.put(storeName, record)
}

async function deleteRecord(storeName, id) {
  const db = await getDB()
  return db.delete(storeName, id)
}

export {
  getDB,
  addRecord,
  getRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
}

