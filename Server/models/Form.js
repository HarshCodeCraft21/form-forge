const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a form title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: [],
    },
    settings: {
      type: Object,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    shareId: {
      type: String,
      unique: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual status: Draft, Published, Expired
formSchema.virtual('status').get(function () {
  const now = new Date();
  if (this.expiresAt && this.expiresAt < now) {
    return 'Expired';
  }
  if (this.isPublished) {
    return 'Published';
  }
  return 'Draft';
});

// recommended indexes
formSchema.index({ createdBy: 1 });

const Form = mongoose.model('Form', formSchema);
module.exports = Form;
