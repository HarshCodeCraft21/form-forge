const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const FormSchema = new mongoose.Schema({
  title: String,
  slug: String,
  isPublished: Boolean,
  expiresAt: Date
}, { strict: false });

const Form = mongoose.model('Form', FormSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const slug = 'course-feedback-form-apdp';
    const form = await Form.findOne({ slug });
    
    if (form) {
      console.log('Form found:', {
        id: form._id,
        title: form.title,
        slug: form.slug,
        isPublished: form.isPublished,
        expiresAt: form.expiresAt,
        status: form.status
      });
    } else {
      console.log(`Form with slug "${slug}" not found in database.`);
      const allForms = await Form.find({}, 'title slug isPublished');
      console.log('All forms currently in database:', allForms);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();
