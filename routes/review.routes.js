const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/review.controller');

router.post('/add-review/:bookId', auth, controller.addReview);
router.get('/all/:bookId', controller.getAll);

module.exports = router;