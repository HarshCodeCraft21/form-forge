const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
      index: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    completionTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// recommended indexes
responseSchema.index({ formId: 1, submittedAt: -1 });

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
