const Form = require('../models/Form');
const Response = require('../models/Response');

// @desc    Retrieve published form by slug or shareId
// @route   GET /api/public/forms/:slugOrId
// @access  Public (No Auth)
const getPublicForm = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    // Check slug OR shareId (handles alternative short URL and slug formats)
    const form = await Form.findOne({
      $or: [{ slug: slugOrId }, { shareId: slugOrId }],
    });

    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Expiry check
    if (form.expiresAt && form.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This form is no longer accepting responses.',
      });
    }

    // Must be published check
    if (!form.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This form is in draft mode and not accepting public responses yet.',
      });
    }

    // Security: Only return data required for rendering forms, do not leak user/internal ids
    res.json({
      title: form.title,
      description: form.description,
      fields: form.fields,
      settings: form.settings,
    });
  } catch (error) {
    console.error('Error in getPublicForm:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit form response anonymously
// @route   POST /api/public/forms/:slugOrId/submit
// @access  Public (No Auth)
const submitPublicResponse = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const { answers, completionTime } = req.body;

    const form = await Form.findOne({
      $or: [{ slug: slugOrId }, { shareId: slugOrId }],
    });

    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Expiry check
    if (form.expiresAt && form.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This form is no longer accepting responses.',
      });
    }

    // Must be published check
    if (!form.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This form is not active.',
      });
    }

    // Required fields validation
    const formFields = form.fields || [];
    const submittedAnswers = answers || {};

    for (const field of formFields) {
      if (field.required) {
        const val = submittedAnswers[field.id];
        if (
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0)
        ) {
          return res.status(400).json({
            success: false,
            message: `Required field "${field.label || 'Field'}" must be completed.`,
          });
        }
      }
    }

    // Collect response details
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const userAgent = req.headers['user-agent'] || '';

    // Save submission response
    const newResponse = await Response.create({
      formId: form._id,
      answers: submittedAnswers,
      submittedAt: new Date(),
      ipAddress,
      userAgent,
      completionTime: completionTime || 0,
    });

    // Increment form response counter
    form.responseCount = (form.responseCount || 0) + 1;
    await form.save();

    res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      data: {
        responseId: newResponse._id,
        submittedAt: newResponse.submittedAt,
      },
    });
  } catch (error) {
    console.error('Error in submitPublicResponse:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicForm,
  submitPublicResponse,
};
