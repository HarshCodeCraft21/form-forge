const express = require('express');
const { getResponses, deleteResponse } = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validateMiddleware');

const router = express.Router();

// All responses routes are protected by JWT authentication
router.use(protect);

router.get('/', getResponses);
router.delete('/:id', validateId, deleteResponse);

module.exports = router;
