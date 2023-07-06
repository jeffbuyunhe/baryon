# Baryon

## Description

Baryon is a virtual learning management platform with an emphasis on peer-to-peer collaborative learning. The application allows the course instructors to provide resources by maintaining a class feed, post assignments and mark assignments. To promote collaboration the teaching team has access to an analytics dashboard allowing the team to plan future assignments based on feedback from students.

Overall our goal is to provide a solid single platform to enhance the classroom experience through collaboration.

## The Team

The development of this project was done by:

- Saad Makrod
- Man Hei Ho
- Feilong Qiu
- Jian Li
- Jeff He
- Joseph Zhao
- MD Wasim Zaman

## Installation and Setup

This guide will assume that you already have an understanding of Git. Berfore running the application you will need to install Node.js and create a .env file. At the time of development the Node.js version being used is v16.15.0.

Node.js can be downloaded [here](https://nodejs.org/en/download/). A good guide for the installation on Windows can be found [here](https://phoenixnap.com/kb/install-node-js-npm-on-windows), and a good guide for the Mac installation can be found [here](https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/).

Now pull the repository to the desired directory. Navigate to the <code>./baryon/backend</code> folder and create a <code>.env</code> file at the root of the folder. Inside the <code>.env</code> file you will need to define the following:

<pre>
MONGODB_URI='ENTER URL HERE'
PORT=3001
</pre>

The PORT variable defines the port that the server will run. Here we will use port 3001. The MONGODB_URI variable indicates the database that you will use. The application is designed to use a MongoDB database on [MongoDB Atlas](https://www.mongodb.com/atlas/database). A guide to set up a MongoDB databse can be found [here](https://fullstackopen.com/en/part3/saving_data_to_mongo_db).

Once the database is set up you can now install the application dependencies. Navigate to the <code>./baryon/backend</code> and run the following command to install the dependencies: <code>npm install</code>, if any errors occur run the command <code>npm install --force</code>. Similarly, navigate to the <code>./baryon/frontend</code> and run the following command to install the dependencies: <code>npm install</code>, if any errors occur run the command <code>npm install --force</code>.

 Now you are ready to run the application. Navigate to the <code>./baryon/backend</code> and run the following command to start the server <code>npm start</code>. If you would like to run the development server run the command: <code>npm run dev</code>. To start the frontend, navigate to the <code>./baryon/frontend</code> folder and run the command <code>npm start</code>.

The server will run on port 3001 and the frontend will run on port 3000.

## Project Structure

This project was developed with the MERN stack. The structure of the <code>baryon</code> folder is indicated below.

### Backend Structure
The project structure is straight-forward. Below is a description of the directory:

- <strong>controllers</strong>: Controllers are called by routers and have the logic for the response, they controllers use services which contain the actual logic for generating the response.
- <strong>models</strong>: This folder contains all the schemas used in the project.
- <strong>routers</strong>: This file will contain all routers.
- <strong>services</strong>: Services contain the logic for generating a response.
- <strong>tests</strong>: This file contains all the tests for the application.
- <strong>utils</strong>: This folder contains several utility files which contain constants and functions related to middleware, API endpoints, error configuration, environment configuraation, and logging tools.
- <strong>app.js</strong>: This file is responsible for setting up the server by connecting to the database, setting up middleware, and initializing the routes.
- <strong>index.js</strong>: This is the entry point of the server.

### Frontend Structure
The project structure is straight-forward. The src folder contains all of the project code, and the public folder contains index.html and a few static files such as images.

Below is a description of the src directory:

- <strong>components</strong>: In React you render JavaScript components for users to see. This folder contains all the components that will be rendered
- <strong>reducers</strong>: In Redux architecture when an action is dipatched reducers are called to manipulate the application state. All the reducers are located in this folder
- <strong>services</strong>: To communicate with the Express Server the frontend needs a way to send and recieve requests. This folder contains all the services which are used to communicate with the server. In the folder there is a file called <code>service.js</code> which contains a class used to issue generic GET, PUT, POST, DELETE operations
- <strong>App.js</strong>: This is the main component with the React Router. The React Router is in charge of rendering components based on the url the user is on
- <strong>index.js</strong>: The index.js folder wraps App.js with the router and the store (used in redux)
- <strong>store.js</strong>: Manages the store for redux, the store contains the state of the application
