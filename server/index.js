/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
const cors = require('cors');
//const client = require('./database');

const app = express();

// ----- Middleware ----- //

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// ----- Routes ----- //

// app.get('/products', (req, res) => {
//   axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/products', {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//   })
//     .then(({ data }) => {
//       res.status(200);
//       res.send(data);
//       res.end();
//     })
//     .catch(() => res.send('Failed to get products'));
// });

// app.get('/products/:product_id/styles', (req, res) => {
//   const { product_id } = req.params;
//   console.log('Request received for styles at product', product_id);

//   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/products/${product_id}/styles`, {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//     params: {
//       product_id,
//       page: 1,
//       count: 100,
//     },
//   })
//     .then(({ data }) => {
//       res.status(200);
//       res.send(data);
//       res.end();
//     })
//     .catch(() => res.send('Failed to get styles'));
// });

// app.post('/cart', (req, res) => {
//   console.log('getting cart post request');
//   console.log(`"${req.body.body}"`);
//   axios({
//     method: 'post',
//     url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/cart',
//     headers: { Authorization: process.env.AUTH_SECRET },
//     data: {
//       sku_id: 1,
//     },
//   })
//     .then(() => {
//       res.sendStatus(201);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // This is for all products GET
// // replicate the HR API syntax
// // ----------- Added Routes
// const baseUrl = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe';
// const headers = { Authorization: process.env.AUTH_SECRET };
// app.get('/products/:id/?*', (req, res) => {
//   console.log(`GET request received from ${req.originalUrl}`);

//   const url = path.join(baseUrl, req.originalUrl);
//   axios.get(url, { headers })
//     .then(({ data }) => res.json(data))
//     .catch(console.log);
// });
// // -------------------------

// app.get('/reviews', (req, res) => {
//   console.log('GET request received from /reviews');
//   const { sort, product_id, count } = req.query;

//   axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/', {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//     params: {
//       product_id, // no review product is 37339
//       sort,
//       count, // figure out how to do max count
//     },
//   })
//     .then(({ data }) => {
//       res.status(200);
//       res.json(data);
//       res.end();
//     })
//     .catch(() => res.send('Error occurred when getting reviews from /reviews'));
// });

// app.post('/reviews', (req, res) => {
//   console.log('POST request received from /reviews');
//   const { data } = req.body;

//   axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/', data, {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//   }).then(() => {
//     console.log('Successful post!');
//     res.end();
//   }).catch(() => {
//     console.log('Error posting review to API endpoint');
//     res.end();
//   });
// });

// app.get('/reviews/meta', (req, res) => {
//   console.log('GET request received from /reviews/meta');
//   const { product_id } = req.query;

//   axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/meta', {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//     params: {
//       product_id,
//     },
//   })
//     .then(({ data }) => {
//       res.status(200);
//       res.json(data);
//     })
//     .catch(() => res.send('Error occurred when getting reviews from /reviews/meta'));
// });

// app.put('/reviews/:review_id/helpful', (req, res) => {
//   console.log('PUT request received from /reviews/:review_id/helpful');
//   const { review_id } = req.params;
//   // console.log(review_id);

//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/${review_id}/helpful`, null, {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//   })
//     .then(() => {
//       console.log('Helpful vote successfully counted');
//       res.status(200);
//       res.end();
//     })
//     .catch((err) => {
//       // console.log(err);
//       console.log('Error occured with PUT request');
//       res.end();
//     });
// });

// app.put('/reviews/:review_id/report', (req, res) => {
//   console.log('PUT request received from /reviews/:review_id/report');
//   const { review_id } = req.params;
//   // console.log(review_id);

//   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/${review_id}/report`, null, {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//   })
//     .then(() => {
//       console.log('Review successfully reported and taken off');
//       res.status(200);
//       res.end();
//     })
//     .catch(() => {
//       console.log('Error occured with PUT request for reporting post');
//       res.end();
//     });
// });

// // ---------- Q and A routes ---------- //

// // ! fix
// // get all questions for a given product id
// // http://localhost:3000/qa/questions/?productId=1&page=1&count=5
// // app.get('/questions', (req, res) => {
// //   const { productId, page, count } = req.query;
// //   client.query(
// //     'SELECT question_id, question_body, question_date, asker_name, question_helpfulness FROM questions WHERE product_id = $1 LIMIT $2 OFFSET $3',
// //     [productId, count, count * page],
// //   )
// //     .then((result) => {
// //       const finalData = {
// //         product_id: productId,
// //         page,
// //         count,
// //         results: result.rows,
// //       };
// //       res.send(finalData);
// //     })
// //     .catch((error) => {
// //       // console.log(error);
// //       res.send(error);
// //     });
// // });

// // ? old get questions for a product route

// app.get('/questions', (req, res) => {
//   axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions', {
//     headers: {
//       Authorization: process.env.AUTH_SECRET,
//     },
//     params: {
//       product_id: req.query.id,
//       count: 100,
//     },
//   })
//     .then(({ data }) => {
//       console.log('Got Questions List');
//       res.status(200);
//       res.json(data);
//       res.end();
//     })
//     .catch(() => res.send('Error occurred when getting questions from /qa/questions'));
// });
// // * working add a question to a product route
// // add a question
// // http://localhost:3000/qa/questions/
// /*
// body: {"title": "ssss", "content": "testcontent", "summary": "testsummary",
//  "status": "public", "image_id": "testid", "email" : "myemail", "name": "joe",
//   "body": "this is a test question", "productId": "1"}
// */
// app.post('/questions', (req, res) => {
//   const {
//     email, name, body, product_id,
//   } = req.body;
//   client.query(
//     `
//   INSERT INTO questions (question_body, asker_email, product_id, asker_name)
//   VALUES ($1, $2, $3, $4);`,
//     // eslint-disable-next-line radix
//     [body, email, parseInt(product_id), name],
//   )
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((error) => {
//       // console.log(error);
//       res.send(error);
//     });
// });

// // ? old add a question for a product

// // app.post('/questions', (req, res) => {
// //   console.log(`"${req.body.body}"`);
// //   axios({
// //     method: 'post',
// //     url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions',
// //     headers: { Authorization: process.env.AUTH_SECRET },
// //     data: {
// //       body: req.body.body,
// //       name: req.body.name,
// //       email: req.body.email,
// //       product_id: Number(req.body.product_id),
// //     },
// //   })
// //     .then(() => {
// //       res.sendStatus(201);
// //     })
// //     .catch((err) => {
// //       console.log(err);
// //     });
// // });

// // * working route to get ansers for a question
// // get answers for a given question
// // http://localhost:3000/qa/questions/1/answers?page=0&count=5
// app.get('/answers', (req, res) => {
//   console.log('answersdb route hit');
//   const { question_id } = req.query;
//   client.query(
//     `SELECT ANSWERS.ID,
//     ANSWER_BODY,
//     ANSWER_DATE,
//     ANSWERER_NAME,
//     ANSWER_HELPFULNESS,
//     JSON_AGG(ANSWERPHOTOS.URL) AS PHOTOS -- an aggregate of the urls, column named photos
//     FROM ANSWERS
//     LEFT JOIN ANSWERPHOTOS ON ANSWERPHOTOS.ANSWER_ID = ANSWERS.ID -- specify how to join the tables
//     WHERE QUESTION_ID = $1 -- this will be the question the user queries
//     GROUP BY ANSWERS.ID,
//     ANSWER_BODY,
//     ANSWER_DATE,
//     ANSWERER_NAME,
//     ANSWER_HELPFULNESS
//     OFFSET $2 -- this will be the page number * # results per page
//     LIMIT $3; -- this will be the total number of results allowed`,
//     [question_id, 0, 100],
//   )
//     .then((result) => {
//       for (const obj of result.rows) {
//         obj.answer_id = obj.id;
//         obj.body = obj.answer_body;
//         obj.date = '2023-02-17T00:00:00.000Z';
//         obj.helpfulness = obj.answer_helpfulness;
//         delete obj.id;
//         delete obj.answer_body;
//         delete obj.answer_date;
//         delete obj.answer_helpfulness;
//         obj.photos = [];
//       }
//       const finalData = {
//         question: question_id,
//         page: 1,
//         count: '100',
//         results: result.rows,
//       };
//       res.send(finalData);
//     })
//     .catch((err) => {
//       // console.log(err);
//       res.send(err);
//     });
// });
// // ? old get answers for a question, no longer needed, db route works, but ideally change column names and date format
// // app.get('/answers2', (req, res) => {
// //   console.log('answers route hit');
// //   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/${req.query.question_id}/answers`, {
// //     headers: {
// //       Authorization: process.env.AUTH_SECRET,
// //     },
// //     params: {
// //       count: 100,
// //     },
// //   })
// //     .then(({ data }) => {
// //       res.status(200);
// //       console.log(data);
// //       res.json(data);
// //     })
// //     .catch(() => res.send('Error occurred when getting questions from /qa/questions/answers'));
// // });

// // * working insert an answer for a question, then insert the answer photos
// /*
// {"title": "ssss", "content": "testcontent", "summary": "testsummary",
//  "status": "public", "image_id": "testid", "email" : "myemail", "name": "joe",
//   "body": "this is a test question", "photos": ["a", "b"]}
// */
// app.post('/answers', (req, res) => {
//   const {
//     body, name, email, photo, question_id,
//   } = req.body;
//   client.query(
//     `
//   INSERT INTO answers (question_id, answerer_name, answerer_email, answer_body)
//   VALUES ($1, $2, $3, $4)
//   RETURNING id;`,
//     [question_id, name, email, body],
//   )
//     .then((result) => {
//       const primaryKey = result.rows[0].id;
//       console.log(primaryKey);
//       console.log(typeof primaryKey);
//       // console.log(result);
//       client.query(
//         `
//       INSERT INTO answerphotos (answer_id, url)
//       VALUES ($1, $2)`,
//         [primaryKey, photo],
//       )
//         .then((result2) => {
//           // console.log(result2);
//           res.send(result2);
//         })
//         .catch((error2) => {
//           // console.log(error2);
//           res.send(error2);
//         });
//     })
//     .catch((error) => {
//       // console.log(error);
//       res.send(error);
//     });
// });

// // ? old add an answer for a question

// // app.post('/answers2', (req, res) => {
// //   console.log(req.body);
// //   axios({
// //     method: 'post',
// //     url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/${req.body.question_id}/answers`,
// //     headers: { Authorization: process.env.AUTH_SECRET },
// //     data: {
// //       body: req.body.body,
// //       name: req.body.name,
// //       email: req.body.email,
// //       photo: req.body.photo,
// //     },
// //   })
// //     .then(() => {
// //       res.sendStatus(201);
// //     })
// //     .catch((err) => {
// //       console.log(err);
// //     });
// // });

// // * working mark a question or answer as helpful

// app.post('/helpful', (req, res) => {
//   const { type, id } = req.query; // type is either answers or questions
//   if (type === 'questions') {
//     client.query(
//       `
//     UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1`,
//       [id],
//     )
//       .then((result) => {
//         console.log(result);
//         res.send(result);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       });
//   } else if (type === 'answers') {
//     client.query(
//       `
//       UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1`,
//       [id],
//     ).then((result) => {
//       console.log(result);
//       res.send(result);
//     })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       });
//   }
// });

// // ? old mark a question or answer as helpful
// // app.post('/helpful', (req, res) => {
// //   // req.query.type is either answers or questions
// //   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/${req.query.type}/${req.query.id}/helpful`, null, {
// //     headers: {
// //       Authorization: process.env.AUTH_SECRET,
// //     },
// //   })
// //     .then(() => {
// //       console.log('done');
// //       res.status(200);
// //     })
// //     .catch(() => res.send('Error occurred when updating helpfulness'));
// // });

// // * working report a question route
// app.post('/report', (req, res) => {
//   const { answerId } = req.body;
//   client.query(
//     'UPDATE answers SET reported = reported + 1 WHERE id = $1',
//     [answerId],
//   )
//     .then((result) => {
//       console.log(result);
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send(err);
//     });
// });
// // ? old report an answer
// // app.post('/report2', (req, res) => {
// //   console.log(req.body);
// //   axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/answers/${req.body.answerId}/report`, null, {
// //     headers: {
// //       Authorization: process.env.AUTH_SECRET,
// //     },
// //   })
// //     .then(() => {
// //       console.log('REPORTED');
// //       res.status(204);
// //     })
// //     .catch((e) => {
// //       console.log(e);
// //       res.send('Error occurred when reporting');
// //     });
// // });

app.listen(3000, async () => {
  console.log('Listening at http://localhost:3000');
  await client.connect();
  console.log('database connected');
});
