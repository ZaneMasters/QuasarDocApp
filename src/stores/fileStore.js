import { defineStore } from 'pinia';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { getAuth } from 'firebase/auth';

export const useFileStore = defineStore('fileStore', {
  state: () => ({
    files: [],
  }),
  actions: {
    async fetchFiles() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        this.files = [];
        return;
      }

      const q = query(collection(db, 'files'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      this.files = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async addFile(fileData) {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user)
      if (!user) {
        throw new Error('User not authenticated');
      }

      const fileRef = storageRef(storage, `files/${fileData.file.name}`);
      await uploadBytesResumable(fileRef, fileData.file);
      const fileUrl = await getDownloadURL(fileRef);

      const newFileData = {
        documentId: fileData.documentId,
        name: fileData.name,
        surname: fileData.surname,
        fileName: fileData.fileName,
        pageCount: fileData.pageCount,
        fileUrl,
        generatedId: fileData.generatedId,
        userId: user.uid, 
      };

      await addDoc(collection(db, 'files'), newFileData);
      await this.fetchFiles();
    },
    async updateFile(id, updatedData) {
      const fileRef = doc(db, 'files', id);
      await updateDoc(fileRef, updatedData);
      await this.fetchFiles();
    },
    async deleteFile(id) {
      const fileDoc = doc(db, 'files', id);
      const fileSnapshot = await getDoc(fileDoc);
      const fileData = fileSnapshot.data();

      const fileRef = storageRef(storage, fileData.fileUrl);
      await deleteObject(fileRef);

      await deleteDoc(fileDoc);
      await this.fetchFiles();
    },
  },
});


