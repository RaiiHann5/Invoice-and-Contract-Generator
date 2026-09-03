import app from './config'

let storagePromise = null

// Lazily loads the firebase/storage SDK + initializes it, only the first
// time something actually needs to upload/read a file. This keeps
// @firebase/storage out of the app's initial JS payload.
export function getStorageInstance() {
  if (!storagePromise) {
    storagePromise = import('firebase/storage').then(({ getStorage }) => getStorage(app))
  }
  return storagePromise
}
