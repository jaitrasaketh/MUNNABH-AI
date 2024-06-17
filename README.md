# MunnaBh-AI: An AI Healthcare Chatbot for Diagnosis

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
8. [License](#license)
9. [Contact](#contact)

## Introduction
MunnaBh-AI is an AI-driven healthcare chatbot designed to assist in diagnosing, treating, and providing medical information. This project leverages a custom-built Large Language Model (LLM) and integrates with various tools to offer a holistic healthcare solution.

## Features
- Google OAuth Login for secure user authentication.
- Integration with Google Fit using NoCode API to gather health data.
- Support for uploading X-rays and MRI scans for analysis.
- Diagnosis, treatment recommendations, and medical information delivery.

## Architecture
Briefly describe the architecture of MunnaBh-AI, including the main components and how they interact:
- **Frontend:** Developed using React.js
- **Backend:** Powered by FastAPI
- **AI Model:** Custom-built LLM using mistral AI with pincone vector database to create embeddings.
- **Integration:** Google OAuth, Google Fit API

## Installation
### Prerequisites
- Node.js
- Python
- Google Fit app (preferable)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/MunnaBh-AI.git
   cd MunnaBh-AI
2. Install dependencies:
   ```sh
    npm install
    pip install -r requirements.txt
3. Start the application:
   - uvicorn main:app --reload to start the backend.
   - npm start to start the frontend.

### Usage
1. Start the application.
2. Login using your Google Account.
3. Interact with the chatbot to input symptoms, upload medical images, and receive diagnoses and recommendations.

### License
This project is licensed under the terms of the [MIT License](LICENSE.md)

### Contributors
  - Sri Jaitra Saketh Goparaju  f20220183@hyderabad.bits-pilani.ac.in
  - Jeeru Harshith Reddy        f20220233@hyderabad.bits-pilani.ac.in
   

     
