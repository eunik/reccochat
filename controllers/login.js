const passport = require('../middlewares/authentication');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('login');
});

// curl -d "username=test&password=password" -X POST http://localhost:8000/login
router.post('/',(req, res, next) => {
	passport.authenticate('local',
	(err, user, info) => {
		if (err) { return next(err); }
		if (!user) { return res.json({success: 0, id: null}); }
		req.logIn(user, (err)=>{
			if (err) { return next(err); }
			res.json({success: 1, id: req.user.id});
		});
	})(req, res, next);
});

module.exports = router;
