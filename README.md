# URL Shortener

A complete URL shortening service with a RESTful API and modern web interface, built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **Create short URLs** from long URLs
- **Redirect functionality** - clicking short URLs redirects to original URLs
- **URL statistics** - track how many times each URL has been accessed
- **Update and delete** existing short URLs
- **Modern web interface** with responsive design
- **Real-time statistics** updates

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory and add your MongoDB URI:
   ```env
   MONGO_URI=mongodb://localhost:27017/urlshortener
   PORT=3000
   ```
   
   **Note:** If you're using MongoDB Atlas, use your connection string:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
   PORT=3000
   ```
3. Start the server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Frontend

The application includes a modern, responsive web interface located at `http://localhost:3000` that provides:

- **URL Input Form** - Enter long URLs to shorten
- **Short URL Display** - Shows the generated short URL with clickable link
- **Statistics Panel** - Displays access count and creation date
- **Action Buttons** - Copy URL, refresh stats, and delete URL
- **Error Handling** - User-friendly error messages
- **Mobile Responsive** - Works on all device sizes

## API Endpoints

### Create Short URL
- **POST** `/shorten`
- **Body:**
  ```json
  { "url": "https://www.example.com/some/long/url" }
  ```
- **Response:**
  ```json
  {
    "_id": "...",
    "url": "https://www.example.com/some/long/url",
    "shortCode": "abc123",
    "createdAt": "...",
    "updatedAt": "...",
    "accessCount": 0
  }
  ```

### Retrieve Original URL
- **GET** `/shorten/:shortCode`
- **Response:**
  ```json
  {
    "_id": "...",
    "url": "https://www.example.com/some/long/url",
    "shortCode": "abc123",
    "createdAt": "...",
    "updatedAt": "...",
    "accessCount": 1
  }
  ```

### Update Short URL
- **PUT** `/shorten/:shortCode`
- **Body:**
  ```json
  { "url": "https://www.example.com/some/updated/url" }
  ```
- **Response:**
  ```json
  {
    "_id": "...",
    "url": "https://www.example.com/some/updated/url",
    "shortCode": "abc123",
    "createdAt": "...",
    "updatedAt": "...",
    "accessCount": 1
  }
  ```

### Delete Short URL
- **DELETE** `/shorten/:shortCode`
- **Response:** 204 No Content

### Get URL Statistics
- **GET** `/shorten/:shortCode/stats`
- **Response:**
  ```json
  {
    "_id": "...",
    "url": "https://www.example.com/some/long/url",
    "shortCode": "abc123",
    "createdAt": "...",
    "updatedAt": "...",
    "accessCount": 10
  }
  ```