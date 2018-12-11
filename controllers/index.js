const router = require('express').Router();

router.use('/', require('./home'));
router.use('/chat', require('./chat'));
router.use('/login', require('./login'));
router.use('/match', require('./match'));
router.use('/signup', require('./signup'));
router.use('/friend', require('./friend'));
router.use('/profile', require('./profile'));
router.use('/interest', require('./interest'));

module.exports = router;
