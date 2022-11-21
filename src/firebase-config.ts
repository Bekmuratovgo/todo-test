import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCXaNS6lr_2jBmys1R6RbLgKG-XLRURIaY",
    authDomain: "todo-react-a910f.firebaseapp.com",
    projectId: "todo-react-a910f",
    storageBucket: "todo-react-a910f.appspot.com",
    messagingSenderId: "43519939160",
    appId: "1:43519939160:web:2c46e9e600452f17f9302d",
    measurementId: "G-SEYCF1M1QW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)