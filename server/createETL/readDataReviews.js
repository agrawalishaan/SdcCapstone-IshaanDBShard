/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../database');

async function reviewsETL() {
  try {
    console.log('about to drop reviews tables');
    await db
      .query('DROP TABLE IF EXISTS test, products, reviews, photos, characteristics;')
      .then(() => {
        console.log('tables dropped, about to create reviews table');
        db.query(`
          CREATE TABLE IF NOT EXISTS reviews (
            product_id INT NOT NULL,
            id SERIAL PRIMARY KEY NOT NULL,
            rating INT NOT NULL,
            summary VARCHAR NOT NULL,
            body VARCHAR NOT NULL,
            date VARCHAR NOT NULL,
            recommend VARCHAR,
            reviewer_name VARCHAR NOT NULL,
            reviewer_email VARCHAR NOT NULL,
            reported VARCHAR,
            response VARCHAR,
            helpfulness INT
          );`);
      })
      .then(() => {
        console.log('reviews table created, about to copy data into it');
        return db
          .query(`
                COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
                  FROM '${path.join(__dirname, '../../../../../../private/tmp/data/reviews.csv')}'
                  DELIMITER ','
                  CSV HEADER
          `);
      })
      .then((res) => {
        console.log('data inserted into reviews table, see result:');
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
}

async function photosETL() {
  try {
    console.log('about to drop existening photos table');
    await db
      .query('DROP TABLE IF EXISTS photos;')
      .then(() => {
        console.log('photos table dropped successfully, about to create new photos table');
        db
          .query(`
          CREATE TABLE IF NOT EXISTS photos (
            id SERIAL PRIMARY KEY NOT NULL,
            review_id INT REFERENCES reviews(id),
            url VARCHAR NOT NULL
          );`);
      })
      .then(() => {
        console.log('photos table created, about to copy data into it');
        return db
          .query(`
            COPY photos(id, review_id, url)
              FROM '${path.join(__dirname, '../../../../../../private/tmp/data/reviews_photos.csv')}'
              DELIMITER ','
              CSV HEADER
          `);
      }).then((res) => {
        console.log('data inserted into photos table, see result:');
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
}

async function charsETL() {
  try {
    console.log('about to drop characteristics table');
    await db
      .query('DROP TABLE IF EXISTS characteristics;')
      .then(() => {
        console.log('characteristics table dropped, about to create new characteristics table');
        db
          .query(`
          CREATE TABLE IF NOT EXISTS characteristics (
            id SERIAL PRIMARY KEY NOT NULL,
            product_id INT NOT NULL,
            name VARCHAR NOT NULL
          );`);
      })
      .then(() => {
        console.log('characteristics table made, about to copy in data');
        return db
          .query(`
            COPY characteristics(id, product_id, name)
              FROM '${path.join(__dirname, '../../../../../../private/tmp/data/characteristics.csv')}'
              DELIMITER ','
              CSV HEADER
        `)
          .then((res) => {
            console.log('data copied into characteristics table');
            console.log(res);
          });
      });
  } catch (e) {
    console.log(e);
  }
}

async function charsReviewsETL() {
  try {
    console.log('about to drop existing characteristic reviews table');
    await db
      .query('DROP TABLE IF EXISTS characteristic_reviews;')
      .then(() => {
        console.log('table dropped successfully, about to re-create table');
        db
          .query(`
            CREATE TABLE IF NOT EXISTS characteristic_reviews (
              id SERIAL PRIMARY KEY NOT NULL,
              characteristic_id INT REFERENCES characteristics(id),
              review_id INT REFERENCES reviews(id),
              value INT NOT NULL
            );`);
      })
      .then(() => {
        console.log('table recreated, about to copy data in');
        return db
          .query(`
            COPY characteristic_reviews(id, characteristic_id, review_id, value)
              FROM '${path.join(__dirname, '../../../../../../private/tmp/data/characteristic_reviews.csv')}'
              DELIMITER ','
              CSV HEADER
          `);
      })
      .then((res) => {
        console.log('data copied in');
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
}

async function buildRecommendTable() {
  try {
    console.log('about to drop existing recommended table');
    await db
      .query('DROP TABLE IF EXISTS recommended;')
      .then(() => {
        console.log('existing recommended table dropped, about to create new recommended table');
        return db
          .query(`
          SELECT product_id, id, recommend, count
          INTO recommended
          FROM (
            SELECT
              product_id,
              id,
              recommend,
              count(recommend) as count
              FROM reviews GROUP BY product_id, id, recommend
          ) as s;`);
      })
      .then((res) => {
        console.log('recommended table populated');
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
}

async function buildCharacteristicsCountTable() {
  console.log('about to drop existening characteristics_count table');
  await db
    .query('DROP TABLE IF EXISTS characteristics_count;')
    .then(() => {
      console.log('table dropped, about to create the characteristics count table');
      return db
        .query(`
      SELECT product_id, name, characteristic_id, review_id, value
      INTO characteristics_count
      FROM (
        SELECT * FROM characteristics c
        LEFT JOIN characteristic_reviews cr
        ON c.id = cr.characteristic_id
      ) as s;`);
    })
    .then((res) => console.log(res));
}

async function addProductIndex() {
  console.log('about to add product indices');
  await db
    .query('CREATE INDEX product_index ON reviews (product_id);')
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
  console.log('finished');
}

async function addProductIndexChars() {
  console.log('about to create indices on rec_product_index');
  await db
    .query('CREATE INDEX rec_product_index ON recommended (product_id);')
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
  console.log('finished, about to create indices on ch_product_index');
  await db
    .query('CREATE INDEX ch_product_index ON characteristics_count (product_id);')
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
}

async function addReviewsIndexToPhotos() {
  console.log('about to add indices to photos_reviews_index');
  await db
    .query('CREATE INDEX photos_reviews_index ON photos (review_id);')
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
  console.log('finished');
}

async function dropCharAndRecommendTables() {
  console.log('dropping tables');
  await db
    .query('DROP TABLE IF EXISTS characteristic_reviews, characteristics, recommended_count;')
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
  console.log('dropped');
}

db.connect().then(async () => {
  console.log('connected to database, about to run various ETLs');
  try {
    // await reviewsETL();
    // await photosETL();
    // await charsETL();
    // await charsReviewsETL();
    // await buildRecommendTable();
    // await buildCharacteristicsCountTable();
    // await addProductIndex();
    // await addProductIndexChars();
    // await addReviewsIndexToPhotos();
    // await dropCharAndRecommendTables();
  } catch (error) {
    console.log(error);
  }
  await db.end();
  console.log('database ended');
});
