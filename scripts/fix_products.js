import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_PATH = path.join(__dirname, '../public/products.json');

function mergeProducts() {
    console.log('Reading products.json...');
    const rawData = fs.readFileSync(PRODUCTS_PATH, 'utf8');
    let productsData;

    try {
        productsData = JSON.parse(rawData);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return;
    }

    const productMap = new Map();

    // Pass 1: Collect and Merge Data
    console.log('Pass 1: Collecting and merging product data...');
    for (const shop in productsData) {
        for (const category in productsData[shop]) {
            const items = productsData[shop][category];
            if (!Array.isArray(items)) continue;

            items.forEach(item => {
                const id = item.id;
                if (!id) return;

                if (!productMap.has(id)) {
                    productMap.set(id, { ...item }); // Clone to avoid reference issues
                } else {
                    const merged = productMap.get(id);

                    // Merge fields
                    for (const key in item) {
                        const existingValue = merged[key];
                        const newValue = item[key];

                        // If existing is null/undefined/empty string, take new value if present
                        if ((existingValue === null || existingValue === undefined || existingValue === '') &&
                            (newValue !== null && newValue !== undefined && newValue !== '')) {
                            merged[key] = newValue;
                        }
                        // If it's an array (like sizes), prefer the one that has length
                        else if (Array.isArray(newValue) && newValue.length > 0) {
                            if (!Array.isArray(existingValue) || existingValue.length === 0) {
                                merged[key] = newValue;
                            }
                        }
                        // For prices, if "salePrice" exists in one place, we keep it.
                        // The logic above (null/empty check) handles simple value replacement.
                    }
                }
            });
        }
    }

    // Pass 2: Update Data with Merged Records
    console.log('Pass 2: Updating products.json with merged data...');
    let updateCount = 0;

    for (const shop in productsData) {
        for (const category in productsData[shop]) {
            const items = productsData[shop][category];
            if (!Array.isArray(items)) continue;

            productsData[shop][category] = items.map(item => {
                if (item.id && productMap.has(item.id)) {
                    // Check if actual changes happen for stats (simplified check)
                    // returning the merged object
                    return productMap.get(item.id);
                }
                return item;
            });
        }
    }

    console.log('Writing updated products.json...');
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(productsData, null, 2));
    console.log('Done!');
}

mergeProducts();
