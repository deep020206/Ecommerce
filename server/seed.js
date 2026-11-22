const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const dns = require("dns");
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean));
}

const mongoose = require("mongoose");
const Item = require("./models/itemsModel");
const items = require("./itemsCollection");

const seed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Item.deleteMany({});
  const normalizedItems = items.map((item) => ({
    ...item,
    detail: item.detail || item.description || item.name
  }));
  await Item.insertMany(normalizedItems);
  console.log(`Seeded ${items.length} items`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Database seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
