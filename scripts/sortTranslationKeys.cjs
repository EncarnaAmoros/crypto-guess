const fs = require("fs");
const path = require("path");

function sortObjectKeys(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item));
  }

  const sortedKeys = Object.keys(obj).sort();
  const result = {};

  for (const key of sortedKeys) {
    result[key] = sortObjectKeys(obj[key]);
  }

  return result;
}

function sortAndSaveJsonFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const jsonContent = fs.readFileSync(absolutePath, "utf-8");
    const parsed = JSON.parse(jsonContent);
    const sorted = sortObjectKeys(parsed);
    const sortedJson = JSON.stringify(sorted, null, 2);
    fs.writeFileSync(absolutePath, sortedJson + "\n", "utf-8");
    console.log(`Successfully sorted and saved: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    process.exit(1);
  }
}

function main() {
  const translationsDir = path.resolve(__dirname, "../src/locales");
  const filesToSort = [
    path.join(translationsDir, "en.json"),
    path.join(translationsDir, "es.json"),
  ];

  console.log("Sorting translation files...");
  filesToSort.forEach(sortAndSaveJsonFile);
  console.log("All translation files have been sorted successfully!");
}

main();
