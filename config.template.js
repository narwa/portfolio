// Email configuration with environment variables
// For Gmail, you need to use an App Password if you have 2-factor authentication enabled
// Generate one at: https://myaccount.google.com/apppasswords
// Select 'Mail' as the app and 'Other' as the device

module.exports = {
    email: {
        user: process.env.EMAIL_USER || 'narwantomail@gmail.com',
        // This should be an App Password for Gmail, not your regular password
        pass: process.env.EMAIL_PASSWORD || ''
    }
};
