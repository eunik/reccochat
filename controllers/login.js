const passport = require('../middlewares/authentication');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('login');
});

// curl -X POST http://localhost:8000/login -b cookie-file.txt -H 'Content-Type: application/json' -d '{"email":"test@test.com", "password":"password"}'
// curl -d "email=test@test.com&password=password" -X POST http://localhost:8000/login
router.post('/', (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })(req, res);
});

module.exports = router;
