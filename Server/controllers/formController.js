const Form = require('../models/Form');
const Response = require('../models/Response');
const QRCode = require('qrcode');

// Helper to sanitize title to URL slug
const slugify = (text) => {
  return (text || 'form')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Helper to generate a unique slug (excluding the current form if updating)
const generateUniqueSlug = async (title, excludeFormId = null) => {
  const baseSlug = slugify(title || 'untitled-form');
  let slug = baseSlug;
  
  const query = { slug };
  if (excludeFormId) {
    query._id = { $ne: excludeFormId };
  }
  
  let exists = await Form.findOne(query);
  let counter = 1;
  while (exists) {
    const rand = Math.random().toString(36).substring(2, 6);
    slug = `${baseSlug}-${rand}`;
    
    const loopQuery = { slug };
    if (excludeFormId) {
      loopQuery._id = { $ne: excludeFormId };
    }
    exists = await Form.findOne(loopQuery);
    counter++;
    if (counter > 20) break;
  }
  return slug;
};

// Helper to generate a unique shareId (6 characters uppercase alphanumeric)
const generateUniqueShareId = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shareId = '';
  let exists = true;
  let counter = 0;
  while (exists) {
    shareId = '';
    for (let i = 0; i < 6; i++) {
      shareId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    exists = await Form.findOne({ shareId });
    counter++;
    if (counter > 20) break;
  }
  return shareId;
};

// @desc    Create a new form draft
// @route   POST /api/forms
// @access  Private
const createForm = async (req, res) => {
  try {
    const { title, description, fields, settings, expiresAt } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const slug = await generateUniqueSlug(title);
    const shareId = await generateUniqueShareId();

    const form = await Form.create({
      title,
      description: description || '',
      fields: fields || [],
      settings: settings || {},
      createdBy: req.user._id,
      slug,
      shareId,
      expiresAt: expiresAt || null,
      isPublished: false,
    });

    res.status(201).json(form);
  } catch (error) {
    console.error('Error in createForm:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all forms of current user
// @route   GET /api/forms
// @access  Private
const getForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Error in getForms:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get form details by ID
// @route   GET /api/forms/:id
// @access  Private
const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this form' });
    }

    res.json(form);
  } catch (error) {
    console.error('Error in getFormById:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update form details
// @route   PUT /api/forms/:id
// @access  Private
const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this form' });
    }

    const { title, description, fields, settings, expiresAt, slug } = req.body;

    if (title) {
      form.title = title;
      // Optionally update slug if not published yet
      if (!form.isPublished) {
        form.slug = await generateUniqueSlug(title, form._id);
      }
    }
    if (slug !== undefined) form.slug = slug;
    if (description !== undefined) form.description = description;
    if (fields !== undefined) form.fields = fields;
    if (settings !== undefined) form.settings = settings;
    if (expiresAt !== undefined) form.expiresAt = expiresAt || null;

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    console.error('Error in updateForm:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete form and its responses
// @route   DELETE /api/forms/:id
// @access  Private
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this form' });
    }

    await Form.findByIdAndDelete(req.params.id);
    await Response.deleteMany({ formId: req.params.id });

    res.json({ message: 'Form and all associated responses deleted successfully' });
  } catch (error) {
    console.error('Error in deleteForm:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish form
// @route   PATCH /api/forms/:id/publish
// @access  Private
const publishForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to publish this form' });
    }

    // Ensure slug and shareId exist
    if (!form.slug) {
      form.slug = await generateUniqueSlug(form.title, form._id);
    }
    if (!form.shareId) {
      form.shareId = await generateUniqueShareId();
    }

    // If expiresAt is passed in body, set/update it
    if (req.body.expiresAt !== undefined) {
      form.expiresAt = req.body.expiresAt || null;
    }

    form.isPublished = true;
    form.publishedAt = form.publishedAt || new Date();

    await form.save();

    res.json({
      success: true,
      message: 'Form published successfully',
      data: {
        slug: form.slug,
        shareUrl: `/f/${form.slug}`,
      },
    });
  } catch (error) {
    console.error('Error in publishForm:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unpublish form
// @route   PATCH /api/forms/:id/unpublish
// @access  Private
const unpublishForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to unpublish this form' });
    }

    form.isPublished = false;
    await form.save();

    res.json({
      success: true,
      message: 'Form unpublished successfully',
    });
  } catch (error) {
    console.error('Error in unpublishForm:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get share details for Share Screen
// @route   GET /api/forms/:id/share
// @access  Private
const shareFormInfo = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access share settings' });
    }

    res.json({
      formId: form._id,
      title: form.title,
      slug: form.slug || '',
      shareUrl: form.slug ? `/f/${form.slug}` : '',
      isPublished: form.isPublished,
      publishedAt: form.publishedAt || null,
      responseCount: form.responseCount || 0,
    });
  } catch (error) {
    console.error('Error in shareFormInfo:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate QR Code for form public URL
// @route   GET /api/forms/:id/qrcode
// @access  Private
const generateQRCode = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Verify ownership
    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to generate QR Code' });
    }

    if (!form.isPublished || !form.slug) {
      return res.status(400).json({ message: 'Form must be published before generating a QR code' });
    }

    // Construct the direct public URL (can use request host/origin if available)
    const origin = req.headers.origin || req.headers.referer || 'https://your-domain.com';
    // Clean any trailing slash from origin
    const baseOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const publicUrl = `${baseOrigin}/f/${form.slug}`;

    if (req.query.format === 'png') {
      const buffer = await QRCode.toBuffer(publicUrl, { type: 'png', width: 250 });
      res.type('png');
      return res.send(buffer);
    } else {
      const qrDataUrl = await QRCode.toDataURL(publicUrl, { width: 250 });
      return res.json({ success: true, qrCode: qrDataUrl });
    }
  } catch (error) {
    console.error('Error in generateQRCode:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all responses for user's forms
// @route   GET /api/responses
// @access  Private
const getResponses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all forms created by this user
    const forms = await Form.find({ createdBy: userId });
    const formIds = forms.map(f => f._id);

    const filter = { formId: { $in: formIds } };
    if (req.query.formId) {
      filter.formId = req.query.formId;
    }

    const responses = await Response.find(filter).sort({ submittedAt: -1 });
    
    // Map ID-keyed answers to label-keyed answers dynamically to match client UI schema
    const formsMap = {};
    forms.forEach(f => {
      formsMap[f._id.toString()] = f;
    });

    const mappedResponses = responses.map(resp => {
      const form = formsMap[resp.formId.toString()];
      const answersByLabel = {};
      if (form && form.fields) {
        form.fields.forEach(field => {
          if (field.type === 'divider') return;
          const val = resp.answers[field.id];
          if (val !== undefined) {
            answersByLabel[field.label || field.id] = val;
          }
        });
      }
      return {
        id: resp._id,
        formId: resp.formId.toString(),
        answers: answersByLabel,
        submittedAt: resp.submittedAt,
        ipAddress: resp.ipAddress,
        userAgent: resp.userAgent,
        completionTime: resp.completionTime
      };
    });

    res.json(mappedResponses);
  } catch (error) {
    console.error('Error in getResponses:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a specific response
// @route   DELETE /api/responses/:id
// @access  Private
const deleteResponse = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Verify form owner
    const form = await Form.findById(response.formId);
    if (!form || form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this response' });
    }

    await Response.findByIdAndDelete(req.params.id);

    // Decrement form responseCount
    if (form.responseCount > 0) {
      form.responseCount -= 1;
      await form.save();
    }

    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error in deleteResponse:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  publishForm,
  unpublishForm,
  shareFormInfo,
  generateQRCode,
  getResponses,
  deleteResponse,
};
