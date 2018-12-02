const router = require('express').Router();
const models = require('../models');
const Users = models.Users;

router.get('/', (req, res) => {
  res.render('signup')
});

// curl -d "username=test&email=test@test.com&password=password" -X POST http://localhost:8000/signup
router.post('/', (req, res) => {
  Users.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }).then((user) => {
    req.login(user, () =>
      res.redirect('/profile')
    );
  }).catch(() => {
    res.render('signup');
  });
});

module.exports = router;
