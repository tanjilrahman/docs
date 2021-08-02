import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDgJF-iV6ieH5Wu6a9YEqetxjKXYStWc18',
  authDomain: 'docs-ebec3.firebaseapp.com',
  projectId: 'docs-ebec3',
  storageBucket: 'docs-ebec3.appspot.com',
  messagingSenderId: '561914106452',
  appId: '1:561914106452:web:26f33e0fbe48ce132e53c1',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };
