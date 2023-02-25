/* eslint-disable radix */
const express = require('express');
const client = require('../database');

const router = express.Router();

// ! fix
// get all questions for a given product id
// http://localhost:3000/qa/questions/?productId=1&page=1&count=5
router.get('/questions', (req, res) => {
  const { productId, page, count } = req.query;
  client.query(
    'SELECT question_id, question_body, question_date, asker_name, question_helpfulness FROM questions WHERE product_id = $1 LIMIT $2 OFFSET $3',
    [productId, count, count * page],
  )
    .then((result) => {
      const finalData = {
        product_id: productId,
        page,
        count,
        results: result.rows,
      };
      res.send(finalData);
    })
    .catch((error) => {
      // console.log(error);
      res.send(error);
    });
});

// get answers for a given question
// http://localhost:3000/qa/questions/1/answers?page=0&count=5
router.get('/questions/:question_id/answers', (req, res) => {
  const questionId = req.params.question_id;
  const { page, count } = req.query;
  client.query(
    `SELECT ANSWERS.ID,
    ANSWER_BODY,
    ANSWER_DATE,
    ANSWERER_NAME,
    ANSWER_HELPFULNESS,
    JSON_AGG(ANSWERPHOTOS.URL) AS PHOTOS -- an aggregate of the urls, column named photos
    FROM ANSWERS
    LEFT JOIN ANSWERPHOTOS ON ANSWERPHOTOS.ANSWER_ID = ANSWERS.ID -- specify how to join the tables
    WHERE QUESTION_ID = $1 -- this will be the question the user queries
    GROUP BY ANSWERS.ID,
    ANSWER_BODY,
    ANSWER_DATE,
    ANSWERER_NAME,
    ANSWER_HELPFULNESS
    OFFSET $2 -- this will be the page number * # results per page
    LIMIT $3; -- this will be the total number of results allowed`,
    [questionId, page * count, count],
  )
    .then((result) => {
      const finalData = {
        question: questionId,
        page,
        count,
        results: result.rows,
      };
      res.send(finalData);
    })
    .catch((err) => {
      // console.log(err);
      res.send(err);
    });
});

// add a question
// http://localhost:3000/qa/questions/
/*
body: {"title": "ssss", "content": "testcontent", "summary": "testsummary",
 "status": "public", "image_id": "testid", "email" : "myemail", "name": "joe",
  "body": "this is a test question", "productId": "1"}
*/
router.post('/questions', (req, res) => {
  const {
    email, name, body, productId,
  } = req.body;
  client.query(
    `
  INSERT INTO questions (question_body, asker_email, product_id, asker_name)
  VALUES ($1, $2, $3, $4);`,
    [body, email, parseInt(productId), name],
  )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      // console.log(error);
      res.send(error);
    });
});

// ! need to fix this
// insert an answer for a question, then insert the answer photos
/*
{"title": "ssss", "content": "testcontent", "summary": "testsummary",
 "status": "public", "image_id": "testid", "email" : "myemail", "name": "joe",
  "body": "this is a test question", "photos": ["a", "b"]}
*/
router.post('/questions/:question_id/answers', (req, res) => {
  const {
    email, name, body, photos, // photos is an array
  } = req.body;
  const questionId = req.params.question_id;
  client.query(
    `
  INSERT INTO answers (question_id, answerer_name, answerer_email, answer_body)
  VALUES ($1, $2, $3, $4)
  RETURNING id;`,
    [questionId, name, email, body],
  )

    .then((result) => {
      const primaryKey = result.rows[0].id;
      // console.log(result);
      client.query(
        `
      INSERT INTO answer_photos (answer_id, url)
      VALUES ($1, $2)`,
        [primaryKey, photos],
      )
        .then((result2) => {
          // console.log(result2);
          res.send(result2);
        })
        .catch((error2) => {
          // console.log(error2);
          res.send(error2);
        });
    })
    .catch((error) => {
      // console.log(error);
      res.send(error);
    });
});

// mark a question as helpful
// http://localhost:3000/qa/questions/1/helpful
router.put('/questions/:question_id/helpful', (req, res) => {
  const questionId = req.params.question_id;
  client.query(
    `
  UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1`,
    [questionId],
  )
    .then((result) => {
      // console.log(result);
      res.send(result);
    }).catch((err) => {
      // console.log(err);
      res.send(err);
    });
});

// mark a question as reported
// http://localhost:3000/qa/questions/1/reported
router.put('/questions/:question_id/reported', (req, res) => {
  const questionId = req.params.question_id;
  client.query(
    `
    UPDATE questions SET reported = reported + 1 WHERE question_id = $1`,
    [questionId],
  )
    .then((result) => {
      res.send(result);
    }).catch((err) => {
      res.send(err);
    });
});

// mark an answer as helpful
// http://localhost:3000/qa/answers/1/helpful
router.put('/answers/:answer_id/helpful', (req, res) => {
  const answerId = req.params.answer_id;
  client.query(
    `
    UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1`,
    [answerId],
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// report an answer
// http://localhost:3000/qa/answers/1/reported
router.put('/answers/:answer_id/reported', (req, res) => {
  const answerId = req.params.answer_id;
  client.query(
    `
    UPDATE answers SET reported = reported + 1 WHERE id = $1`,
    [answerId],
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// mark an answer as reported

module.exports = router;
