# E-Commerce__API

Welcome to the E-Commerce API project! This project serves as the backend for an e-commerce platform that caters to both users and sellers. Built using Node.js, Express, MongoDB, Joi, Bcrypt.js, and Cloudinary, this API provides a secure and efficient way to manage e-commerce operations such as product listing, shopping cart management, order processing, user authentication, and media uploading.



<br>



## Table of Contents

- [ Introduction. ](#Introduction)
- [ Features. ](#Features)
- [ Technologies Used & Dependencies. ](#Technologies_Used)
- [ Project Structure. ](#Project_Structure)
- [ Getting Started. ](#Getting_Started)
- [ API Endpoints. ](#API_Endpoints)
- [ Available Base Links. ](#Available_Base_Links)
- [ Authentication and Security. ](#Authentication)
- [ Validation. ](#Validation)
- [ Media Upload. ](#Media_Upload)
- [ Feedback and Contributing. ](#Feedback_Contributing)
- [ License. ](#License)



<br>



<a id="Introduction"></a>

## Introduction
The E-Commerce API project aims to provide a robust backend for e-commerce applications, enabling users to browse and purchase products while allowing sellers to manage their product listings. This API is built with scalability, security, and ease of use in mind.



<br>



<a id="Features"></a>

## Features

- **User and Seller Authentication:** Secure user and seller registration and login using encrypted passwords and JWT tokens.
- **Product Management:** CRUD operations for managing products, including creation, retrieval, updating, and deletion.
- **Shopping Cart:** Enable users to add and manage items in their shopping carts before checkout.
- **Order Processing:** Handle the process of placing orders, tracking order history, and managing order status.
- **Media Upload:** Utilize Cloudinary to securely upload and manage product images and other media.
- **Validation:** Input validation and data sanitization using Joi to ensure data integrity.
- **Security:** Password hashing using Bcrypt.js to safeguard user and seller credentials.



<br>



<a id="Technologies_Used"></a>

## Technologies Used & Dependencies
- **Node.js:** A server-side JavaScript runtime used to build fast and scalable network applications.
- **Express:** A minimal and flexible Node.js web application framework that simplifies API development.
- **MongoDB:** A NoSQL database used for efficient and flexible data storage.
- **Joi:** A validation library for JavaScript that helps ensure the integrity of data.
- **Bcrypt.js:** A library for hashing and salting passwords to enhance security.
- **Cloudinary:** A cloud-based media management platform for uploading, storing, and delivering images and other media.
For a complete list of dependencies, please refer to the `package.json` file.



<br>



<a id="Getting_Started"></a>

## Getting Started

To get started with the Fresh Cart frontend project, follow these steps:

1. <strong>Clone the Repository:</strong> Clone this repository to your local machine using the following command:
```bash
  git clone https://github.com/Dragon-H22/E-Commerce__API.git
```

2. <strong>Install Dependencies:</strong> Navigate to the project directory and install the required dependencies using your preferred package manager:
```bash
  cd E-Commerce__API
  npm install
```

3. <strong>Configure environment variables:</strong> Add variables for database connection, Cloudinary API keys, JWT secret, and token signature.

4. <strong>Run the Application:</strong> Start the development server to run the application locally:
```bash
  npm run dev
```

5. <strong>Access the Application:</strong> Open your web browser and visit `http://localhost:5000` to use it as a base link.



<br>



<a id="Project_Structure"></a>

## Project Structure
The project structure follows a modular pattern to enhance maintainability and readability:

* `DB/`
    * `Models/`: Defines MongoDB schemas.
    * `connection.js`: Connect to MongoDB.
* `src/`
    * `middleware/`: Middleware functions for authentication, error handling, etc.
    * `modules/`: Defines API routes and connects them to controllers to perform their business logic.
    * `utils/`: Utility functions for various tasks.
    * `app.js`: Main Express application setup.



<br>



<!--  000000000000000000000000000000000000000000000000000000000000000000000000000000000000  -->
<!--  000000000000000000000000000000000000000000000000000000000000000000000000000000000000  -->
<!--  000000000000000000000000000000000000000000000000000000000000000000000000000000000000  -->
<a id="API_Endpoints"></a>

## API Endpoints
* `GET /products`: Retrieve a list of products.
* `GET /products/:id`: Retrieve details of a specific product.
* `POST /products`: Create a new product (Seller only).
* `PUT /products/:id`: Update product details (Seller only).
* `DELETE /products/:id`: Delete a product (Seller only).
Detailed API documentation can be found<a href="" target="_blank"> here</a>.



<br>



<a id="Available_Base_Links"></a>

## Available Base Links
- https://e-commerce-api-dragon-h22.vercel.app/
- https://e-commerce-api-git-master-dragon-h22.vercel.app/
- https://e-commerce-api-tau.vercel.app/

> Note:  Bearer key = DragonH22__ 



<br>



<a id="Authentication"></a>

## Authentication and Security
User, seller, and admin authorization are implemented using JWT (JSON Web Tokens) and their authentication is implemented using Bcryptjs for password hashing. Users, sellers, and admins can register, log in, and receive tokens to access protected routes.



<br>



<a id="Validation"></a>

## Validation
Input validation and data sanitization are performed using Joi, ensuring that data entering and leaving the API meet defined criteria, enhancing overall security and data integrity.



<br>



<a id="Media_Upload"></a>

## Media Upload
Cloudinary integration allows for easy and efficient management of media files associated with categories, products, ..etc. Images and other media can be uploaded and linked to their records.



<br>



<a id="Feedback_Contributing"></a>

## Feedback and Contributing
I'm excited to hear your <u><a href="https://forms.gle/o82Qt7jX1iJkqmRr5" target="_blank">feedback</a></u> and discuss potential collaborations and if you'd like to contribute, please fork the repository, make your changes, and submit a pull request.



<br>



<a id="License"></a>

## License
This project is licensed under the MIT License.



