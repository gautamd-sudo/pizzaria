#!/usr/bin/env node
const mongoose = require('mongoose');
const { Types } = require('mongoose');
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzarally';

async function run() {
  await mongoose.connect(MONGO);
  console.log('Connected to', MONGO);

  const db = mongoose.connection.db;

  // Ensure categories
  const categoriesColl = db.collection('categories');
  const productsColl = db.collection('products');

  const existingCats = await categoriesColl.find({}).toArray();
  let pizzaCat, pastaCat, sidesCat;

  if (existingCats.length === 0) {
    const res = await categoriesColl.insertMany([
      { name: 'Pizzas', displayOrder: 0, isPublished: true },
      { name: 'Pasta', displayOrder: 1, isPublished: true },
      { name: 'Sides', displayOrder: 2, isPublished: true },
    ]);
    pizzaCat = res.insertedIds['0'];
    pastaCat = res.insertedIds['1'];
    sidesCat = res.insertedIds['2'];
    console.log('Inserted categories');
  } else {
    pizzaCat = existingCats.find(c => c.name === 'Pizzas')?._id || existingCats[0]._id;
    pastaCat = existingCats.find(c => c.name === 'Pasta')?._id || existingCats[1]?._id || existingCats[0]._id;
    sidesCat = existingCats.find(c => c.name === 'Sides')?._id || existingCats[2]?._id || existingCats[0]._id;
    console.log('Categories already exist, using existing ids');
  }

  const toObjectId = (id) => (id instanceof Types.ObjectId ? id : new Types.ObjectId(id));

  // Add some products if none exist
  const count = await productsColl.countDocuments({});
  if (count === 0) {
    const now = new Date();
    const products = [
      {
        name: 'Margherita',
        description: 'Classic Margherita with San Marzano tomatoes and fresh basil.',
        price: 9.5,
        categoryId: toObjectId(pizzaCat),
        imageUrl: '',
        tags: ['Vegetarian'],
        variants: [
          { variantId: 'small', name: 'Small', priceDelta: 0, isAvailable: true },
          { variantId: 'large', name: 'Large', priceDelta: 3.0, isAvailable: true },
        ],
        addonIds: [],
        prepTimeRange: '12-16 min',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Pepperoni',
        description: 'Spicy pepperoni with hand-stretched dough and mozzarella.',
        price: 11.0,
        categoryId: toObjectId(pizzaCat),
        imageUrl: '',
        tags: ['Spicy', 'Popular'],
        variants: [
          { variantId: 'regular', name: 'Regular', priceDelta: 0, isAvailable: true },
          { variantId: 'family', name: 'Family', priceDelta: 5.0, isAvailable: true },
        ],
        addonIds: [],
        prepTimeRange: '15-20 min',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'Creamy carbonara with guanciale and pecorino romano.',
        price: 12.5,
        categoryId: toObjectId(pastaCat),
        imageUrl: '',
        tags: ['Chef Special'],
        variants: [],
        addonIds: [],
        prepTimeRange: '10-14 min',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Garlic Bread',
        description: 'Toasted garlic bread with herb butter.',
        price: 3.5,
        categoryId: toObjectId(sidesCat),
        imageUrl: '',
        tags: [],
        variants: [],
        addonIds: [],
        prepTimeRange: '6-8 min',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await productsColl.insertMany(products);
    console.log('Inserted sample products');
  } else {
    console.log('Products already exist, skipping insertion');
  }

  await mongoose.disconnect();
  console.log('Done');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
