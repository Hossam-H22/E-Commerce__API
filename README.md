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



<a id="API_Endpoints"></a>

## API Endpoints
* **Authentication**
  * `POST /auth/login`: Login user.
  * `POST /auth/signup`: Register new user.
  * `POST /auth/loginWithGmail`: Login user with Google.
  * `PATCH /auth/forgetPassword`: Send code to email to reset password.
  * `PATCH /auth/resetPassword`: Reset forgetting password with new.
* **User**
  * `GET /user/all`: Retrieve a list of users.
  * `GET /user`: Retrieve details of a specific user.
  * `PATCH /user/updatePassword`: Update password of the user.
* **Product**
  * `GET /product`: Retrieve a list of products.
  * `GET /product/:id`: Retrieve details of a specific product.
  * `POST /product`: Create a new product (Seller only).
  * `PUT /product/:id`: Update product details (Seller only).
  * `PATCH /product/:id/wishlist`: Add product to wishlist (User only).
  * `PATCH /product/:id/wishlist/remove`: Remove product from wishlist (User only).
  * `POST /product/:id/review`: Add review for the product (User only).
  * `PUT /product/:id/review`: Update review of the product (User only).
* **Category**
  * `GET /category`: Retrieve a list of categories.
  * `GET /category/:id`: Retrieve details of a specific category.
  * `POST /category`: Create a new category (Admin only).
  * `PUT /category/:id`: Update category details (Admin only).
* **Subcategory**
  * `GET /subcategory`: Retrieve a list of subcategories.
  * `GET /subcategory/:id`: Retrieve details of a specific subcategory.
  * `POST /subcategory`: Create a new subcategory (Admin only).
  * `PUT /subcategory/:id`: Update subcategory details (Admin only).
* **Brand**
  * `GET /brand`: Retrieve a list of brands.
  * `GET /brand/:id`: Retrieve details of a specific brand.
  * `POST /brand`: Create a new brand (Admin only).
  * `PUT /brand/:id`: Update brand details (Admin only).
* **Coupon**
  * `GET /coupon`: Retrieve a list of coupons.
  * `GET /coupon/:id`: Retrieve details of a specific coupon.
  * `POST /coupon`: Create a new coupon (Admin only).
  * `PUT /coupon/:id`: Update brand details (Admin only).
* **Order**
  * `GET /order`: Retrieve a list of orders (User only).
  * `POST /order`: Create a new order (User only).
  * `PATCH /order/:id`: Cancel order (User only).
  * `PATCH /order/:id/update`: Update order details to change status (Admin only).
* **Cart**
  * `GET /cart`: Retrieve a list of products in the cart (User only).
  * `POST /cart`: Add products to the cart (User only).
  * `PATCH /cart/:id/clear`: Clear cart (User only).
  * `PATCH /cart/:id/remove`: Remove some products from the cart(User only).

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
Cloudinary integration allows for easy and efficient management of media files associated with categories, brands, products, ..etc. Images and other media can be uploaded and linked to their records.



<br>



<a id="Feedback_Contributing"></a>

## Feedback and Contributing
I'm excited to hear your <u><a href="https://forms.gle/o82Qt7jX1iJkqmRr5" target="_blank">feedback</a></u> and discuss potential collaborations and if you'd like to contribute, please fork the repository, make your changes, and submit a pull request.



<br>



<a id="License"></a>

## License
This project is licensed under the [MIT license](LICENSE).



