const router = require('express').Router();
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const controller = require('../controllers/book.controller');

router.post('/add-book', auth, requireAdmin, controller.addBook);
router.get('/all', controller.getAll);

module.exports = router;