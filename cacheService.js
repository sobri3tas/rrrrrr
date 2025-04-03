const fs = require("fs").promises;
const path = require("path");

const CACHE_FILE = path.join(__dirname, "cache.json");
const CACHE_DURATION = 60 * 1000;

async function getCachedData() {
  try {
    const fileContent = await fs.readFile(CACHE_FILE, "utf8");
    const { timestamp, data } = JSON.parse(fileContent);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  } catch (err) {
    
  }
  return null;
}

async function setCachedData(data) {
  const cache = {
    timestamp: Date.now(),
    data: data
  };
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache));
}

module.exports = { getCachedData, setCachedData };