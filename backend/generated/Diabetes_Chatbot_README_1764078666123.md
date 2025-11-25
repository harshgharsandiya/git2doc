# Diabetes Chatbot
A full-stack health management system for diabetic patients featuring a RAG-based AI chatbot, OCR prescription scanner, and modules for glucose tracking, meals, medications, reminders, and PDF reports.

## Description
The Diabetes Chatbot is a comprehensive health management system designed to assist diabetic patients in managing their condition. The system includes a range of features, such as glucose tracking, meal planning, medication reminders, and prescription scanning, all of which are accessible through a user-friendly interface. The system also includes a RAG-based AI chatbot, which provides personalized support and guidance to patients.

## Tech Stack
* Frontend: Not specified in the provided files, but likely a JavaScript framework such as React or Angular
* Backend: Node.js with Express.js framework
* Database: Configured in backend/config/db.js, but the type is not specified
* OCR Prescription Scanner: Uses Tesseract OCR engine (inferred from the presence of the eng.traineddata file)
* AI Chatbot: RAG-based, but the specific implementation is not specified

## Installation
To install the Diabetes Chatbot, follow these steps:
1. Clone the repository to your local machine
2. Navigate to the backend folder and run `npm install` to install the required dependencies
3. Create a .env file in the backend folder and add your database connection details
4. Run `npm start` to start the server

## Usage
To use the Diabetes Chatbot, follow these steps:
1. Start the server by running `npm start` in the backend folder
2. Access the chatbot interface through a web browser or mobile app (not specified in the provided files)
3. Register or log in to the system to access the various features and modules

## Features
* Glucose tracking: allows patients to track their blood glucose levels
* Meal planning: provides patients with personalized meal plans and recipes
* Medication reminders: sends reminders to patients to take their medications
* Prescription scanning: uses OCR technology to scan and store prescription information
* RAG-based AI chatbot: provides personalized support and guidance to patients
* PDF reports: generates reports on patient data, such as glucose levels and medication adherence

## Folder Structure
The repository is organized into the following folders:
* backend: contains the server-side code, including routes, controllers, models, and database configuration
* backend/config: contains database configuration files
* backend/controllers: contains controller files for handling requests and interacting with the database
* backend/models: contains model files for defining the structure of the data
* backend/reports: contains generated PDF reports
* backend/routes: contains route files for defining the API endpoints

## License
The license for the Diabetes Chatbot is not specified in the provided files. It is recommended to add a license file to the repository to clarify the terms of use and distribution.