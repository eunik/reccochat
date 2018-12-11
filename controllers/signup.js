const router = require('express').Router();
const models = require('../models');
const Users = models.Users;

router.get('/', (req, res) => {
  res.render('signup')
});

// curl -d "username=te1t&email=test@test.com&password=password" -X POST http://localhost:8000/signup
router.post('/', (req, res) => {
  Users.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }).then((user) => {
    req.login(user, () =>
      res.json({success:1, id:user.id})
    );
  }).catch(() => {
    res.json({success:0, id:null});
  });
});

module.exports = router;
