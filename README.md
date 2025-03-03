# Narwanto's Portfolio Website

A responsive personal portfolio website showcasing skills, experience, and projects.

## Features

- Responsive design that works on all devices
- Modern and clean UI
- Smooth scrolling navigation
- Skills visualization
- Timeline for experience and education
- Contact form
- Social media links
- Docker support for easy deployment

## Structure

- `index.html` - Main HTML file
- `css/style.css` - Stylesheet
- `js/main.js` - JavaScript for interactivity
- `img/` - Directory for images
- `Curriculum Vitae And Resume Narwanto Classic.pdf` - Downloadable CV
- `server.js` - Simple Node.js server
- `Dockerfile` - Docker configuration for containerization
- `docker-compose.yml` - Docker Compose configuration

## Running Locally

### Without Docker

1. Install Node.js if you haven't already
2. Clone this repository
3. Navigate to the project directory
4. Run the following commands:

```bash
npm install
npm start
```

5. Open your browser and go to `http://localhost:3000`

### With Docker

#### Using Docker Compose (Recommended)

1. Install Docker and Docker Compose if you haven't already
2. Clone this repository
3. Navigate to the project directory
4. Run the following command:

```bash
docker-compose up
```

5. Open your browser and go to `http://localhost:3000`

#### Using Docker Directly

1. Install Docker if you haven't already
2. Clone this repository
3. Navigate to the project directory
4. Build the Docker image:

```bash
docker build -t narwanto-portfolio .
```

5. Run the Docker container:

```bash
docker run -p 3000:3000 narwanto-portfolio
```

6. Open your browser and go to `http://localhost:3000`

## Customization

### Personal Information

Update the following sections in `index.html`:

1. Header: Update the name in the logo and navigation
2. Hero section: Update name, title, and call-to-action buttons
3. About section: Update personal information and description
4. Experience section: Update work history
5. Education section: Update educational background
6. Skills section: Update skills and proficiency levels
7. Contact section: Update contact information
8. Footer: Update copyright information and social media links

### Styling

Customize the look and feel by modifying the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    /* Other variables */
}
```

### Images

Replace the placeholder images in the `img/` directory with your own:

- `hero-bg.jpg` - Background image for the hero section

## Deployment

### Traditional Hosting

This website can be deployed to any web hosting service. Simply upload all files to your hosting provider.

### Docker Deployment

You can deploy this Docker container to any cloud service that supports Docker containers:

1. Build the Docker image
2. Push the image to a container registry (Docker Hub, AWS ECR, Google Container Registry, etc.)
3. Deploy the container to your preferred cloud service (AWS, Google Cloud, Azure, etc.)

## License

This project is open-source and available for personal use.

## Credits

- Font Awesome for icons
- Google Fonts for typography
- Created by Narwanto
