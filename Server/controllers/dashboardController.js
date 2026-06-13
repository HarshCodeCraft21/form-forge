const Form = require('../models/Form');
const Response = require('../models/Response');

// @desc    Get dashboard analytics and submission metrics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all forms owned by the logged-in user
    const forms = await Form.find({ createdBy: userId });

    const now = new Date();
    let draftCount = 0;
    let publishedCount = 0;
    let expiredCount = 0;
    let totalResponses = 0;
    const formIds = [];
    let mostActiveForm = null;

    forms.forEach((form) => {
      totalResponses += form.responseCount || 0;
      formIds.push(form._id);

      // Determine status matches Virtual status logic
      if (form.expiresAt && form.expiresAt < now) {
        expiredCount++;
      } else if (form.isPublished) {
        publishedCount++;
      } else {
        draftCount++;
      }

      // Track most active form
      if (form.responseCount > 0) {
        if (!mostActiveForm || form.responseCount > mostActiveForm.responseCount) {
          mostActiveForm = {
            id: form._id,
            title: form.title,
            responseCount: form.responseCount,
            slug: form.slug,
          };
        }
      }
    });

    // Calculate submission growth: group responses by date
    let submissionGrowth = [];
    if (formIds.length > 0) {
      const responses = await Response.find({ formId: { $in: formIds } }).sort({ submittedAt: 1 });

      const growthMap = {};
      responses.forEach((resp) => {
        const dateStr = resp.submittedAt.toISOString().split('T')[0]; // YYYY-MM-DD
        growthMap[dateStr] = (growthMap[dateStr] || 0) + 1;
      });

      submissionGrowth = Object.keys(growthMap)
        .map((date) => ({
          date,
          count: growthMap[date],
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    res.json({
      draftForms: draftCount,
      publishedForms: publishedCount,
      expiredForms: expiredCount,
      totalResponses,
      submissionGrowth,
      mostActiveForm,
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
