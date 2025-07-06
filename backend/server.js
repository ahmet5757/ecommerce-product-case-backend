const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();


const PORT = process.env.PORT || 3001;

app.use(cors());

const products = require("./products.json");

// Altın fiyatını API'den çek
const getGoldPrice = async () => {
  try {
    const response = await axios.get("https://api.metals.live/v1/spot");
    const goldPrice = response.data[0].gold;
    return goldPrice;
  } catch (error) {
    console.error("Altın fiyatı alınamadı:", error.message);
    return 70;
  }
};

app.get("/products", async (req, res) => {
  const goldPrice = await getGoldPrice();

  const result = products.map((product) => {
    const price = (
      (product.popularityScore + 1) *
      product.weight *
      goldPrice
    ).toFixed(2);
    const popularityOutOfFive = (product.popularityScore * 5).toFixed(1);

    return {
      ...product,
      price,
      popularityOutOfFive,
    };
  });

  res.json(result);
});


app.listen(PORT, () => {
  console.log(`Backend çalışıyor → http://localhost:${PORT}`);
  console.log(`process.env.PORT: ${process.env.PORT}`);
});
