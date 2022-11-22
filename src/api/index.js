import * as ShopMyInfluence from "../libs/ShopMyInfluence.js";

const getBrandByOfferID = async (offerId) => {
  const brands = await ShopMyInfluence.getBrands();
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
const getInfluencerById = async (influencerId) => {
  const influencer = await ShopMyInfluence.getInfluencerById(influencerId);
  return {
    banner: influencer.banner,
    createdAt: influencer.createdAt,
    influencerId: influencer.influencerId,
    name: influencer.name,
  };
};

const getArticleById = async (articleId) => {
  const article = await ShopMyInfluence.getArticleById(articleId);
  return {
    image: article.image,
    offerId: article.offerId,
    id: article.id,
    uid: article.uid,
  };
};

const getBrandStatsByOfferID = async (offerId) => {
  const purchases = await ShopMyInfluence.getPurchasesByOfferId(offerId);
  const stats = purchases.reduce(
    (acc, curr) => {
      const newset = new Set(acc.influencersIDs);
      newset.add(curr.influencer);

      const newInfluencerSales = { ...acc.influencerSales };
      if (newInfluencerSales[curr.influencer]) {
        newInfluencerSales[curr.influencer].push(curr);
      } else {
        newInfluencerSales[curr.influencer] = [curr];
      }

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
export default {
  getBrandByOfferID,
  getInfluencerById,
  getArticleById,
  getBrandStatsByOfferID,
};
