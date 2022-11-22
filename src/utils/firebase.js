import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import config from "../config/index.js";
const firebaseConfig = {
  databaseURL: config.database.url,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
