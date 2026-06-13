const mongoose = require('mongoose');

/**
 * Express middleware to validate that the ':id' route parameter is a valid MongoDB ObjectId.
 * Returns a 400 Bad Request instead of throwing a CastError.
 */
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }
  next();
};

module.exports = { validateId };
