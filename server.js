const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { parse } = require('querystring');

// Try to load config file, but use environment variables as fallback
let config;
try {
    config = require('./config');
} catch (error) {
    console.log('Config file not found, using environment variables');
    config = {
        email: {
            user: process.env.EMAIL_USER || 'narwantomail@gmail.com',
            pass: process.env.EMAIL_PASSWORD || ''
        }
    };
}

const PORT = process.env.PORT || 3000;

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: config.email.user,
        pass: config.email.pass
    },
    debug: true // Show debug output
});

// Verify the connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP server connection error:', error);
    } else {
        console.log('SMTP server connection successful');
    }
});

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
};

// Function to collect request data
const collectRequestData = (request, callback) => {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    const FORM_JSON = 'application/json';
    
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    } else if (request.headers['content-type'] && request.headers['content-type'].includes(FORM_JSON)) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(JSON.parse(body));
        });
    } else {
        callback({});
    }
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle form submission
    if (req.method === 'POST' && req.url === '/send-email') {
        collectRequestData(req, (formData) => {
            // Send email
            const mailOptions = {
                from: `"Portfolio Website" <${config.email.user}>`, // Use your Gmail as sender
                replyTo: formData.email, // Set reply-to as the visitor's email
                to: config.email.user, // Your email
                subject: `Portfolio Contact: ${formData.subject}`,
                text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
                html: `
                    <h3>New message from your portfolio website</h3>
                    <p><strong>Name:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Subject:</strong> ${formData.subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${formData.message.replace(/\n/g, '<br>')}</p>
                `
            };

            console.log('Attempting to send email with options:', {
                from: mailOptions.from,
                to: mailOptions.to,
                subject: mailOptions.subject
            });
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Failed to send email', 
                        error: error.message 
                    }));
                } else {
                    console.log('Email sent:', info.response);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Email sent successfully' }));
                }
            });
        });
        return;
    }

    // Handle the root URL
    let filePath = req.url === '/' 
        ? path.join(__dirname, 'index.html')
        : path.join(__dirname, req.url);

    // Get the file extension
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1>');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Press Ctrl+C to stop the server`);
});
