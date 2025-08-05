# Production Email Setup Guide

## Required Credentials for Gmail

To enable production email functionality, you need to provide the following credentials:

### 1. Gmail Account Setup

**Email Address:** `usha.j@yaaralabs.ai`
**Password:** [You need to provide the Gmail app password]

### 2. How to Get Gmail App Password

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/
   - Click on "Security"
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" from the dropdown
   - Click "Generate"
   - Copy the 16-character password

### 3. Environment Variables Required

Create a `.env` file in the `backend` folder with these variables:

```env
# Database
MONGODB_URI=mongodb://usha:ushausha@35.209.234.43:27017/admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Email Configuration (PRODUCTION)
EMAIL_USER=usha.j@yaaralabs.ai
EMAIL_PASSWORD=YOUR_GMAIL_APP_PASSWORD_HERE
EMAIL_FROM=usha.j@yaaralabs.ai

# Environment
NODE_ENV=production
```

## What You Need to Provide

**Please provide the following:**

1. **Gmail App Password** for `usha.j@yaaralabs.ai`
   - This is a 16-character password generated from Google Account settings
   - It's different from your regular Gmail password

2. **JWT Secret** (if you want to change it)
   - Can be any secure random string

## Email Functionality

### Acceptance Emails
- **Trigger:** When admin approves an application
- **Subject:** "AmiAble Application Accepted - Welcome!"
- **Content:** Congratulations message with login instructions

### Rejection Emails
- **Trigger:** When admin rejects an application
- **Subject:** "AmiAble Application Status - Update"
- **Content:** Professional rejection message with next steps

## Testing the Email System

1. **Set up the credentials** in `.env` file
2. **Start the server:** `node server.js`
3. **Register a new user** application
4. **Login as admin** and approve/reject applications
5. **Check console** for email status messages
6. **Check recipient email** for the actual emails

## Alternative Email Services

If you prefer not to use Gmail, we can configure:

### SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Mailgun
```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_domain.com
```

## Security Notes

- Never commit the `.env` file to version control
- The Gmail app password is more secure than regular password
- Emails are sent asynchronously to avoid blocking the application
- Email failures don't prevent application approval/rejection

## Troubleshooting

### Common Issues:
1. **"Invalid credentials"** - Check if app password is correct
2. **"Less secure app access"** - Use app password instead
3. **"Connection timeout"** - Check internet connection
4. **"Rate limit exceeded"** - Gmail has daily sending limits

### Debug Commands:
```bash
# Check if email config is loaded
node -e "console.log(process.env.EMAIL_USER)"

# Test email connection
node -e "const { createTransporter } = require('./config/email'); createTransporter().verify().then(console.log).catch(console.error)"
``` 