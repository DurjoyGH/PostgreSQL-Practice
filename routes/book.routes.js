const router = require('express').Router();
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const controller = require('../controllers/book.controller');

router.get('/all', controller.getAll);
router.post('/add-book', auth, requireAdmin, controller.addBook);
router.delete('/delete-book/:id', auth, requireAdmin, controller.deleteBook);
router.put('/update-book/:id', auth, requireAdmin, controller.updateBook);

module.exports = router;