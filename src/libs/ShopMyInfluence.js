import { get, ref } from "firebase/database";
import { database } from "../utils/firebase.js";

const brandsDB = ref(database, "brands");

export const getBrands = () =>
  get(brandsDB).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      throw new Error("No data available");
    }
  });

export const getPurchasesByOfferId = (offerId) => {
  return get(ref(database, `conversions/purchasesPerBrands/${offerId}`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      } else {
        throw new Error("No data available");
      }
    }
  );
};

export const getInfluencerById = (influencerId) => {
  const query = ref(database, `influencers/${influencerId}`);
  return get(query).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No data available");
    }
  });
};

export const getArticleById = (articleId) => {
  const query = ref(database, `articles/${articleId}`);
  return get(query).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No data available");
    }
  });
};
