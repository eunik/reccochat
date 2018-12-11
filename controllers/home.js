const router = require('express').Router();

// curl 'http://localhost:8000/'
router.get('/', (req, res) => {
  res.send('API up and running : ' + new Date())
});

module.exports = router;
