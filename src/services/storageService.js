// Real Firebase Storage uploads. Files are scoped under logos/{userId}/...
// matching the Storage security rules that restrict writes to their owner.
//
// firebase/storage (and its ~80KB of SDK code) is only pulled in the first
// time an upload actually happens, instead of on every page load.
import { getStorageInstance } from '../firebase/storage'

export async function uploadBusinessLogo(userId, file) {
  return uploadFile(`logos/${userId}/logo-${Date.now()}-${file.name}`, file)
}

export async function uploadQrisImage(userId, file) {
  return uploadFile(`logos/${userId}/qris-${Date.now()}-${file.name}`, file)
}

async function uploadFile(path, file) {
  const [{ ref, uploadBytes, getDownloadURL }, storage] = await Promise.all([
    import('firebase/storage'),
    getStorageInstance(),
  ])
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
