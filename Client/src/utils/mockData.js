// Template categories (Academic, Events, Business)
export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'academic', name: 'Education & Student' },
  { id: 'social', name: 'Events & Invite' },
  { id: 'business', name: 'Business & Contact' }
];

// Predesigned form templates with human-friendly descriptions and fields
export const FORM_TEMPLATES = [
  // Student & Education Category
  {
    id: 'tpl-student-feedback',
    title: 'Course Feedback Form',
    category: 'academic',
    description: 'Gather student reviews regarding course content, schedule, and instructor effectiveness.',
    fields: [
      { id: 'f-1', type: 'text', label: 'Course Name', placeholder: 'e.g. Intro to Computer Science', required: true, width: 'half' },
      { id: 'f-2', type: 'text', label: 'Instructor Name', placeholder: 'e.g. Dr. Jane Smith', required: true, width: 'half' },
      { id: 'f-3', type: 'select', label: 'Academic Semester', options: ['Fall 2026', 'Spring 2026', 'Summer 2026'], required: true, width: 'full' },
      { id: 'f-4', type: 'rating', label: 'Rate the instructor effectiveness', required: true, defaultValue: '5', width: 'full' },
      { id: 'f-5', type: 'textarea', label: 'What did you like best about this course?', placeholder: 'Share your thoughts...', required: false, width: 'full' },
      { id: 'f-6', type: 'textarea', label: 'Suggestions for improvement', placeholder: 'Anything that can be improved...', required: false, width: 'full' }
    ]
  },
  {
    id: 'tpl-student-reg',
    title: 'Student Club Registration',
    category: 'academic',
    description: 'Sign up sheet for joining university student organizations and clubs.',
    fields: [
      { id: 'f-1', type: 'text', label: 'Student Name', placeholder: 'Jane Doe', required: true, width: 'half' },
      { id: 'f-2', type: 'email', label: 'University Email Address', placeholder: 'student@university.edu', required: true, width: 'half' },
      { id: 'f-3', type: 'phone', label: 'Contact Phone Number', placeholder: '(555) 123-4567', required: false, width: 'half' },
      { id: 'f-4', type: 'number', label: 'Current Student Year', placeholder: '1, 2, 3 or 4', required: true, width: 'half' },
      { id: 'f-5', type: 'radio', label: 'Primary Interest', options: ['Robotics Club', 'Debate Society', 'Art & Design', 'Coding Guild'], required: true, width: 'full' },
      { id: 'f-6', type: 'checkbox', label: 'I commit to attending weekly meetings', required: true, width: 'full' }
    ]
  },

  // Events & Invite Category
  {
    id: 'tpl-party-invite',
    title: 'Birthday RSVP Form',
    category: 'social',
    description: 'RSVP link for celebrating birthdays and managing guest counts.',
    fields: [
      { id: 'f-1', type: 'text', label: 'Your Full Name', placeholder: 'Alex Johnson', required: true, width: 'full' },
      { id: 'f-2', type: 'radio', label: 'Will you attend?', options: ['Yes, absolutely!', 'No, I cannot make it', 'Undecided'], required: true, width: 'full' },
      { id: 'f-3', type: 'number', label: 'Number of Guests (including yourself)', placeholder: '1', required: true, defaultValue: '1', width: 'half' },
      { id: 'f-4', type: 'select', label: 'Dietary Choice', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free'], required: false, width: 'half' },
      { id: 'f-5', type: 'textarea', label: 'Leave a note for the host', placeholder: 'Wishes or comments...', required: false, width: 'full' }
    ]
  },

  // Business & Contact Category
  {
    id: 'tpl-contact-form',
    title: 'Contact Information Form',
    category: 'business',
    description: 'Receive inquiries, suggestions, and feedback from your website visitors.',
    fields: [
      { id: 'f-1', type: 'text', label: 'First Name', placeholder: 'Sarah', required: true, width: 'half' },
      { id: 'f-2', type: 'text', label: 'Last Name', placeholder: 'Connor', required: true, width: 'half' },
      { id: 'f-3', type: 'email', label: 'Email Address', placeholder: 'sarah@website.com', required: true, width: 'full' },
      { id: 'f-4', type: 'select', label: 'Reason for Inquiry', options: ['General Support', 'Sales & Pricing', 'Partnership', 'Other'], required: true, width: 'full' },
      { id: 'f-5', type: 'textarea', label: 'Detailed Message', placeholder: 'Tell us how we can help you...', required: true, width: 'full' }
    ]
  },
  {
    id: 'tpl-job-app',
    title: 'Job Application Form',
    category: 'business',
    description: 'Collect resume submissions and candidate details for open positions.',
    fields: [
      { id: 'f-1', type: 'text', label: 'Full Name', placeholder: 'Taylor Swift', required: true, width: 'half' },
      { id: 'f-2', type: 'email', label: 'Email Address', placeholder: 'taylor@talents.com', required: true, width: 'half' },
      { id: 'f-3', type: 'phone', label: 'Phone Number', placeholder: '(555) 000-1111', required: true, width: 'half' },
      { id: 'f-4', type: 'select', label: 'Position Applied For', options: ['Senior Dev', 'UI Designer', 'Product Manager'], required: true, width: 'half' },
      { id: 'f-5', type: 'file', label: 'Upload Resume (PDF/Doc)', required: true, width: 'full' },
      { id: 'f-6', type: 'textarea', label: 'Cover Letter / Intro Note', placeholder: 'Explain why you are a great fit...', required: false, width: 'full' }
    ]
  }
];

// Preseeded Forms list
export const INITIAL_FORMS = [
  {
    id: 'form-101',
    title: 'Job Application - Software Engineer',
    description: 'Intake form for applicants applying to the Software Engineer role.',
    status: 'published',
    createdAt: '2026-05-12T10:00:00Z',
    responsesCount: 24,
    fields: [
      { id: '1', type: 'text', label: 'Full Name', placeholder: 'Jane Doe', required: true, width: 'half' },
      { id: '2', type: 'email', label: 'Email Address', placeholder: 'jane@example.com', required: true, width: 'half' },
      { id: '3', type: 'phone', label: 'Phone Number', placeholder: '123-456-7890', required: false, width: 'half' },
      { id: '4', type: 'select', label: 'Years of Experience', options: ['1-3 years', '3-5 years', '5+ years'], required: true, width: 'half' },
      { id: '5', type: 'textarea', label: 'Cover Letter', placeholder: 'Tell us about your background...', required: false, width: 'full' }
    ]
  },
  {
    id: 'form-102',
    title: 'Customer Satisfaction Survey',
    description: 'Weekly check-in on support interactions and product value.',
    status: 'published',
    createdAt: '2026-06-01T14:30:00Z',
    responsesCount: 148,
    fields: [
      { id: '1', type: 'rating', label: 'How satisfied are you with our product?', required: true, defaultValue: '4', width: 'full' },
      { id: '2', type: 'select', label: 'Which feature do you use most?', options: ['Form Builder', 'AI Assistant', 'Analytics Dashboard', 'Export Module'], required: true, width: 'full' },
      { id: '3', type: 'checkbox', label: 'Would you recommend us to a colleague?', required: false, width: 'full' },
      { id: '4', type: 'textarea', label: 'Do you have additional feedback?', placeholder: 'Any suggestions...', required: false, width: 'full' }
    ]
  },
  {
    id: 'form-103',
    title: 'TechSummit 2026 Attendance RSVP',
    description: 'Sign-ups for attendees and VIP package selections.',
    status: 'published',
    createdAt: '2026-06-11T09:15:00Z',
    responsesCount: 0,
    fields: [
      { id: '1', type: 'text', label: 'Attendee Name', placeholder: 'Name', required: true, width: 'half' },
      { id: '2', type: 'email', label: 'Email', placeholder: 'Email', required: true, width: 'half' },
      { id: '3', type: 'radio', label: 'Ticket Class', options: ['General Admission', 'VIP Pass', 'Student Pass'], required: true, width: 'full' }
    ]
  }
];

// Mock Responses seed list
export const INITIAL_RESPONSES = [
  {
    id: 'resp-1',
    formId: 'form-101',
    submittedAt: '2026-06-12T12:00:00Z',
    answers: {
      'Full Name': 'Alice Wonderland',
      'Email Address': 'alice@wonder.com',
      'Phone Number': '555-019-2834',
      'Years of Experience': '3-5 years',
      'Cover Letter': 'Excited about the React + Node stack!'
    }
  },
  {
    id: 'resp-2',
    formId: 'form-101',
    submittedAt: '2026-06-13T09:12:00Z',
    answers: {
      'Full Name': 'Bob Builder',
      'Email Address': 'bob@construction.org',
      'Phone Number': '555-120-4491',
      'Years of Experience': '5+ years',
      'Cover Letter': 'Have been writing software since the floppy disk era.'
    }
  },
  {
    id: 'resp-4',
    formId: 'form-102',
    submittedAt: '2026-06-10T16:22:00Z',
    answers: {
      'How satisfied are you with our product?': '5',
      'Which feature do you use most?': 'Form Builder',
      'Would you recommend us to a colleague?': true,
      'Do you have additional feedback?': 'The drag and drop feels super responsive!'
    }
  },
  {
    id: 'resp-5',
    formId: 'form-102',
    submittedAt: '2026-06-11T11:05:00Z',
    answers: {
      'How satisfied are you with our product?': '3',
      'Which feature do you use most?': 'AI Assistant',
      'Would you recommend us to a colleague?': false,
      'Do you have additional feedback?': 'The AI assistant needs more form suggestions.'
    }
  }
];

// Weekly Trend stats
export const SUBMISSION_TRENDS_WEEK = [
  { day: 'Mon', submissions: 12 },
  { day: 'Tue', submissions: 19 },
  { day: 'Wed', submissions: 32 },
  { day: 'Thu', submissions: 27 },
  { day: 'Fri', submissions: 48 },
  { day: 'Sat', submissions: 15 },
  { day: 'Sun', submissions: 19 }
];

export const SUBMISSION_TRENDS_MONTH = [
  { date: 'June 01', responses: 12 },
  { date: 'June 03', responses: 19 },
  { date: 'June 05', responses: 31 },
  { date: 'June 07', responses: 24 },
  { date: 'June 09', responses: 38 },
  { date: 'June 11', responses: 29 },
  { date: 'June 13', responses: 45 }
];

export const RESPONSE_BY_DEVICE = [
  { name: 'Desktop', value: 104, color: '#4F46E5' }, // styled Indigo
  { name: 'Mobile', value: 58, color: '#64748B' },  // Slate
  { name: 'Tablet', value: 10, color: '#E2E8F0' }   // Border color
];

export const MOCK_EXPORT_HISTORY = [
  { id: 'exp-1', format: 'CSV', formTitle: 'Job Application - Software Engineer', records: 24, date: '2026-06-13 10:15', status: 'Completed' },
  { id: 'exp-2', format: 'Excel', formTitle: 'Customer Satisfaction Survey', records: 148, date: '2026-06-12 18:40', status: 'Completed' }
];
