const express = require('express');
const {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  publishForm,
  unpublishForm,
  shareFormInfo,
  generateQRCode,
} = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validateMiddleware');

const router = express.Router();

// All routes here are protected by JWT authentication
router.use(protect);

router.route('/')
  .post(createForm)
  .get(getForms);

router.route('/:id')
  .get(validateId, getFormById)
  .put(validateId, updateForm)
  .delete(validateId, deleteForm);

router.patch('/:id/publish', validateId, publishForm);
router.patch('/:id/unpublish', validateId, unpublishForm);
router.get('/:id/share', validateId, shareFormInfo);
router.get('/:id/qrcode', validateId, generateQRCode);

module.exports = router;
