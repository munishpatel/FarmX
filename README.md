# FarmR.ai

FarmR.ai is a full-stack application designed to manage farm-related activities. "Plant once, harvest always: Farm smarter, using our AI that sees, speaks, and understands and that grows with your farm."
This project includes a backend built with Node.js and Express, and a frontend built with React Native using Expo.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure
```
FarmX/
├── backend/                # Backend code
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # Frontend code
│   ├── app/                # Expo app directory
│   │   ├── (tabs)/         # Tab-based navigation
│   │   └── screens/        # Screens for the app
│   ├── assets/             # Static assets (images, fonts, etc.)
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```
---

## Features

### Backend
- User authentication (login and signup) using MongoDB.
- RESTful API endpoints for authentication.
- MongoDB integration for data storage.

### Frontend
- React Native app with Expo for cross-platform compatibility.
- Navigation using `expo-router` and React Navigation.
- Login and Signup screens with styled buttons and a logo.

---

## Installation

### Prerequisites
- Node.js and npm installed on your system.
- MongoDB installed and running locally.
- Expo CLI installed globally (`npm install -g expo-cli`).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/munishpatel/FarmX.git
   cd FarmX
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
---

## Usage

### Start the Backend
1. Navigate to the `backend` directory and start the server:
   ```bash
   npm start
   ```
2. The backend will run on `http://localhost:5001`.

### Start the Frontend
1. Navigate to the `frontend` directory and start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```
2. Use the Expo Go app or an emulator to view the app.

---

## Technologies Used
### Backend
- Node.js
- Express.js
- MongoDB

### Frontend
- React.js
- React Native Navigation

---

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-name).
3. Commit your changes (git commit -m "Add feature").
4. Push to the branch (git push origin feature-name).
5. Open a pull request.
   
---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

   
