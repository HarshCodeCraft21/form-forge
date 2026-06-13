const express = require('express');
const { getPublicForm, submitPublicResponse } = require('../controllers/publicFormController');

const router = express.Router();

// Public routes (no auth middleware)
router.get('/forms/:slugOrId', getPublicForm);
router.post('/forms/:slugOrId/submit', submitPublicResponse);

module.exports = router;
