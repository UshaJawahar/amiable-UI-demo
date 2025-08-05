# Email Setup Guide

## For Development/Testing

The email system is configured to use Ethereal Email for development/testing when `EMAIL_PASSWORD` is not set. This allows you to test email functionality without setting up real email credentials.

## For Production (Gmail)

To use Gmail for sending emails, follow these steps:

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to Google Account > Security > App passwords
- Generate a new app password for "Mail"
- Use this password in your `.env` file

### 3. Environment Variables
Add these to your `.env` file:

```env
EMAIL_USER=usha.j@yaaralabs.ai
EMAIL_PASSWORD=your-gmail-app-password-here
EMAIL_FROM=usha.j@yaaralabs.ai
NODE_ENV=production
```

### 4. Alternative Email Services

You can also use other email services by modifying `backend/config/email.js`:

#### SendGrid
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

#### Mailgun
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

## Testing Email Functionality

1. Start the server
2. Register a new user application
3. Login as admin and reject the application
4. Check the console for email status messages

For development, you'll see a preview URL in the console that you can use to view the email. 