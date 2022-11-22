import { get, ref } from "firebase/database";
import { database } from "../utils/firebase.js";

const brandsDB = ref(database, "brands");

const getBrands = () =>
  get(brandsDB).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      throw new Error("No data available");
    }
  });

const getPurchasesByOfferId = (offerId) => {
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

const getBrandByOfferID = async (offerId) => {
  const brands = await getBrands();
  const brand = brands.find((brand) => brand.offerId === offerId);
  if (!brand) {
    throw new Error("Brand Not Found");
  }
  return {
    key: brand.key,
    offerId: brand.offerId,
    pic: brand.pic,
    displayName: brand.displayName,
  };
};

const getBrandStatsByOfferID = async (offerId) => {
  const purchases = await getPurchasesByOfferId(offerId);
  const stats = purchases.reduce(
    (acc, curr) => {
      //influencers
      const newset = new Set(acc.influencersIDs);
      newset.add(curr.influencer);
      //salesPerInfluencer
      const newInfluencerSales = { ...acc.influencerSales };
      if (newInfluencerSales[curr.influencer]) {
        newInfluencerSales[curr.influencer].push(curr);
      } else {
        newInfluencerSales[curr.influencer] = [curr];
      }

      //salesPer country
      const newSalesPerCountry = { ...acc.salesPerCountry };
      if (curr.countryCode) {
        if (newSalesPerCountry[curr.countryCode]) {
          newSalesPerCountry[curr.countryCode] =
            newSalesPerCountry[curr.countryCode] + 1;
        } else {
          newSalesPerCountry[curr.countryCode] = 1;
        }
      }

      const newSalesPerProduct = { ...acc.salesPerProduct };
      if (newSalesPerProduct[curr.articleId]) {
        newSalesPerProduct[curr.articleId] =
          newSalesPerProduct[curr.articleId] + 1;
      } else {
        newSalesPerProduct[curr.articleId] = 1;
      }

      return {
        salesPerProduct: newSalesPerProduct,
        salesPerCountry: newSalesPerCountry,
        influencerSales: newInfluencerSales,
        influencersIDs: newset,
        sales: acc.sales + curr.amount,
      };
    },
    {
      sales: 0,
      influencersIDs: new Set(),
      influencerSales: {},
      salesPerCountry: {},
      salesPerProduct: {},
    }
  );

  const topFiveInfluencers = Object.entries(stats.influencerSales)
    .map(([influencerId, sales]) => {
      const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
      return { influencerId, totalSales, salesNumber: sales.length };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);
  const topTenProducts = Object.entries(stats.salesPerProduct)
    .map(([articleId, salesNumber]) => {
      return {
        articleId,
        salesNumber,
      };
    })
    .sort((a, b) => b.salesNumber - a.salesNumber)
    .slice(0, 10);
  //DONE
  return {
    topTenProducts: topTenProducts,
    topFiveInfluencers,
    salesPerCountry: stats.salesPerCountry,
    sales: stats.sales,
    salesNumber: purchases.length,
    influencer: stats.influencersIDs.size,
  };
};

const _getInfluencerById = (influencerId) => {
  const query = ref(database, `influencers/${influencerId}`);
  return get(query).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No data available");
    }
  });
};

const getInfluencerById = async (influencerId) => {
  const influencer = await _getInfluencerById(influencerId);
  return {
    banner: influencer.banner,
    createdAt: influencer.createdAt,
    influencerId: influencer.influencerId,
    name: influencer.name,
  };
};

const _getArticleById = (articleId) => {
  const query = ref(database, `articles/${articleId}`);
  return get(query).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No data available");
    }
  });
};
const getArticleById = async (articleId) => {
  const article = await _getArticleById(articleId);
  return {
    image: article.image,
    offerId: article.offerId,
    id: article.id,
    uid: article.uid,
  };
};

export default {
  getBrandByOfferID,
  getInfluencerById,
  getArticleById,
  getBrandStatsByOfferID,
};
