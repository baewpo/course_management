# **Course Management System**

This project is part of the **Software Development** course. It is a system for managing course registration, including features for adding and dropping courses, as well as approval and rejection processes for course requests.

## **Main Features**

- **Add Course**: Students can add courses they wish to enroll in during the current academic semester.
- **Drop Course**: Students can drop courses they no longer wish to take.
- **Approval and Rejection**: Professors or administrators can approve or reject students' requests to add or drop courses.

## **Technologies Used**

- **Frontend**: [React](https://reactjs.org/) with **JavaScript** and SCSS for building building a responsive and UI.
- **Backend**: [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for developing the API.
- **Database**: [PostgreSQL](https://www.postgresql.org/) for data storage.
- **Deployment**: Deployed on [Railway](https://render.com/) -> [Course Management System](https://courese-management-test.up.railway.app/create-request)

**Note**: This deployment link is temporary and may be removed in the future as the deployment is for testing purposes.

## **Login Details**

Here are the login credentials for the **Admin** and **Student** roles:

### **Admin**

- **Email**: `admin@example.com`
- **Password**: `adminpassword123`

### **Students**

- **Email**: `user@example.com`
- **Password**: `userpassword123`

- **Email**: `student.b@example.com`
- **Password**: `studentb123`

## **How to Run Locally the Project**

### **1. Run with Docker (using Docker Compose)**

Make sure you have Docker and Docker Compose installed if you plan to use the Docker method.

To run the project using Docker Compose, you can use the following command:

```bash
docker-compose up --build
```

This will:

- Build the Docker images.
- Start the containers for both the frontend and backend.

By default:

The frontend will be accessible at `http://localhost:4173`.

The backend will be accessible at `http://localhost:8080`.

### **2. Run Frontend & Backend Locally**

Make sure you have Node.js and npm installed if you prefer to run the project locally without Docker.

```bash
cd client
npm install
npm run serve
```
This will start the frontend server, and it will be available at `http://localhost:4173`.

```bash
cd server
npm install
node server.js
```
This will start the backend server, and it will be available at `http://localhost:8080`.

