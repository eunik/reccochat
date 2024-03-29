const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models').Users;

function passwordsMatch(passwordSubmitted, storedPassword) {
  return bcrypt.compareSync(passwordSubmitted, storedPassword);
}

passport.use(new LocalStrategy({
    usernameField: 'username',
  },
  (username, password, done) => {
    Users.findOne({
      where: { username },
    }).then((user) => {
      debugger;
      if (!user || passwordsMatch(password, user.password) === false) {
        console.log('\n\nerror match\n\n')
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      console.log('\n\ncorrect login!!\n\n')
      return done(null, user, {message: 'Successfully Logged In!' });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id).then((user) => {
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
});

passport.redirectIfLoggedIn = (route) =>
  (req, res, next) => (req.user ? res.redirect(route) : next());

passport.redirectIfNotLoggedIn = (route) =>
  (req, res, next) => (req.user ? next() : res.redirect(route));

module.exports = passport;
