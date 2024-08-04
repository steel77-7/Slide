## Slide
Slide is a simple peer-to-peer file-sharing application built with Next.js for the frontend and Node.js with Socket.IO for real-time backend communication. This app allows users to easily share files directly with each other in a straightforward manner.

## Features
Basic File Sharing: Facilitates direct file transfers between peers.
Drag-and-Drop Upload: Easy file uploads with drag-and-drop support.
Real-Time Communication: Instant file transfer notifications using Socket.IO.
## Tech Stack
Frontend: Next.js (React-based framework)
Backend: Node.js with Socket.IO
Styling: Tailwind CSS
Getting Started
To get started with the Slide application on your local machine, follow these steps:

# Prerequisites
Node.js and npm (or yarn, pnpm, or bun) installed. You can download them from nodejs.org.
Installation
Clone the Repository

```bash

git clone https://github.com/yourusername/slide.git
```
Navigate to the Project Directory

```bash

cd slide
```
Install Dependencies

For the backend:

```bash

cd backend
npm install
For the frontend:
```
```bash

cd ../frontend
npm install
Running the Application
Start the Backend Server
```
In the backend directory, run:

```bash

npm start
```
Start the Frontend Application

In the frontend directory, run:

```bash

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 in your browser to view the app.

Building for Production
Build the Backend

In the backend directory:

```bash

npm run build
Build the Frontend
```
In the frontend directory:

```bash

npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```
Start the Production Server

After building, start the production server in the backend directory:

```bash

npm start
```
The production version will be available at http://localhost:3000.

## Learn More
To learn more about the technologies used:

Next.js Documentation - Explore Next.js features and API.
Node.js Documentation - Learn more about Node.js.
Socket.IO Documentation - Understand Socket.IO usage.
## Deploy on Vercel
For deploying your Next.js app, consider using Vercel, the platform created by the Next.js team.

Check out the Next.js deployment documentation for detailed deployment steps.
