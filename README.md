# Holbertonschool HBNB

A full-stack Airbnb-inspired clone built using Python, Flask, SQLAlchemy, JavaScript, HTML, and CSS.

The project implements a RESTful API backend with a dynamic frontend, allowing users to browse places, view detailed listings, authenticate, and submit reviews.

---

## Running the Project

### Prerequisites

Before running the project, ensure you have:

- Python 3 installed
- Postman installed (for API testing and initial database setup)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/samuelchen17/holbertonschool-hbnb.git
```

Navigate into the application directory:

```bash
cd app/
```

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the application:

```bash
python run.py
```

The application will initialise the database and start the Flask server.

Once running, access the website at:

```
http://localhost:8080
```

---

# Project Setup

The frontend requires initial data to be created before the website can be fully tested.

Due to the requirements of the project specification, some functionality is currently only available through the API and has not yet been exposed through the frontend.

The following features must currently be created through API requests:

- Creating owner accounts
- Creating reviewer accounts
- Creating amenities
- Creating place listings

---

## Initial Database Setup

The easiest way to initialise the required data is by using the provided Postman collection:

```
HBnB.postman_collection.json
```

Import the collection into Postman and run all requests under:

```
00 - Setup
```

These requests should be run first to populate the database with the required initial data.

---

## Creating Test Data

After completing the setup requests:

1. Create any additional amenities required.
2. Create place listings using the place creation endpoint.
3. Modify the request bodies in Postman to create your own test data.

Once places have been created, they will automatically appear on the website, you may need to refresh the page.

---

## Testing User Functionality

To test authentication and review functionality:

1. Create a reviewer or owner account through the API.
2. Use the created credentials to log in through the website.
3. Browse available places.
4. View place details.
5. Submit reviews as an authenticated user.

---

## Technologies Used

- Python
- Flask
- Flask-RESTX
- SQLAlchemy
- JavaScript
- HTML5
- CSS3
- JWT Authentication
- SQLite/PostgreSQL

---

## Features

- User authentication using JWT
- Dynamic place listings
- Place detail pages
- Client-side price filtering
- Review creation and display
- API-driven frontend communication
- User, place, review, and amenity management