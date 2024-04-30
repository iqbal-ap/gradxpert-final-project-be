const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'Success',
    code: 200,
    message: 'Successfully connect to app'
  })
});

module.exports = router;