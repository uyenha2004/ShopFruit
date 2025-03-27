// seedData.js
const { faker } = require('@faker-js/faker');
const fs = require('fs');

const generateProducts = (num) => {
    const products = [];
    for (let i = 1; i <= num; i++) {
        products.push({
            id: i,
            name: faker.commerce.productName(),
            price: parseInt(faker.commerce.price(), 10),
            description: faker.commerce.productDescription(),
            imageUrl: faker.image.imageUrl(),
            category: faker.commerce.department(),
            inStock: faker.datatype.boolean(),
            isBestSeller: faker.datatype.boolean(),
            isOnSale: faker.datatype.boolean(),
            discountPrice: faker.datatype.boolean() ? parseInt(faker.commerce.price(), 10) : undefined
        });
    }
    return products;
};

const data = { products: generateProducts(100) };

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Dữ liệu giả đã được tạo!');
