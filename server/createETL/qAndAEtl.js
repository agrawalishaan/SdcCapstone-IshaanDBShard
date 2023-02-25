const path = require('path');
const client = require('../database');

async function answerPhotosEtl() {
  client
    .query(`CREATE TABLE IF NOT EXISTS answerPhotos (
  id serial PRIMARY KEY,
  answer_id integer REFERENCES answers(id),
  url varchar(255)
)`)
    .then(() => {
      // console.log(path.join(__dirname, '../../../../../../private/tmp'));
      client
        .query(`
      COPY answerPhotos(id, answer_id, url)
        FROM '${path.join(__dirname, '../../../../../../private/tmp/data/answers_photos.csv')}'
        DELIMITER ','
        CSV HEADER
    `)
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
        .finally(() => client.end());
    })
    .catch((e) => console.log(e));
}

async function answersEtl() {
  client
    .query(`CREATE TABLE IF NOT EXISTS answers (
  id serial PRIMARY KEY,
  question_id integer REFERENCES questions(question_id),
  answer_body text,
  answer_date varchar(255),
  answerer_name varchar(255),
  answerer_email varchar(255),
  reported integer,
  answer_helpfulness integer
)`)
    .then(() => {
      client
        .query(`
      COPY answers(id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness)
        FROM '${path.join(__dirname, '../../../../../../private/tmp/data/answers.csv')}'
        DELIMITER ','
        CSV HEADER
    `)
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
        .finally(() => client.end());
    })
    .catch((e) => console.log(e));
}

async function questionsEtl() {
  client
    .query(`CREATE TABLE IF NOT EXISTS questions (
  question_id serial PRIMARY KEY,
  product_id integer,
  question_body text,
  question_date varchar(255),
  asker_name varchar(255),
  asker_email varchar(255),
  question_helpfulness integer,
  reported integer)`)
    .then(() => {
      client
        .query(`
      COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported)
        FROM '${path.join(__dirname, '../../../../../../private/tmp/data/questions.csv')}'
        DELIMITER ','
        CSV HEADER
    `)
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
        .finally(() => client.end());
    })
    .catch((e) => console.log(e));
}

async function generateQAndAEtl() {
  // await questionsEtl();
  // console.log('questions table finished');
  // await answersEtl();
  // console.log('answers table finished');
  await answerPhotosEtl();
  console.log('answer photos table finished');
}

client.connect().then(async () => {
  await generateQAndAEtl();
});

module.exports = generateQAndAEtl;
