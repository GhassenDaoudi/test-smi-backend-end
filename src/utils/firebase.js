import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
const firebaseConfig = {
    databaseURL: "https://test-smi-a21cb-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };