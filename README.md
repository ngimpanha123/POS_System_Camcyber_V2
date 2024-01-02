# One Stop File Service
Welcome to the Simple API File Service! This service allows you to upload and manage files with basic authentication for added security.
## How to Run the app
To run the API File Service on your local machine, follow these steps:
1. **Clone the Repository:**
```bash
git clone git@gitlab.camcyber.com:pos/v2/file-v3.git
```
2. **Navigate to the Project Directory:**
```bash
cd file-v3
```
3. **Install Dependencies:**
```bash
$ npm install
```
4. **Start the Server:**
```bash
# development watch mode
npm run start:dev
# production deployment
npm run start
```
## Database Connection Options
This file service allowed you to connect three database:
### MySQL Connection:
1. Create the `.env` file in the root directory
```bash
DB_CONNECTION   = 'mysql'
DB_PORT         = 'your_db_port'
DB_HOST         = 'your_db_localhost'
DB_DATABASE     = 'your_db_name'
DB_USERNAME     = 'your_db_root'
DB_PASSWORD     = 'your_db_password'
```
### Postgres Connection:
1. Create the `.env` file in the root directory
```bash
DB_CONNECTION   = 'postgres'
DB_PORT         = 'your_db_port'
DB_HOST         = 'your_db_localhost'
DB_DATABASE     = 'your_db_name'
DB_USERNAME     = 'your_db_root'
DB_PASSWORD     = 'your_db_password'
```
### Oracle Connection:
1. Create the `.env` file in the root directory
2. Uncomment the connection oracle in `src/configs/database.config.ts` and comment out the MySQL and Postgres connections.
```bash
DB_TNS          = 'your_db_service_name or sid'
DB_CONNECTION   = 'postgres'
DB_PORT         = 'your_db_port'
DB_HOST         = 'your_db_localhost'
DB_DATABASE     = 'your_db_name'
DB_USERNAME     = 'your_db_root'
DB_PASSWORD     = 'your_db_password'
```

## Migrate && Seeds
### Migrate
**Drop all tables && recreate table again**
```bash
npm run migrate
```
### Seeds
**Drop all tables && recreate table again && insert data to the database**
```bash
npm run seeder
```

## All Routes For File Update 

In addition to the basic functionality, the One Stop File Service API provides several routes for specific file operations. Here are some of the key routes:

### Read a File

- **URL**: `/upload/file/:filename`
- **HTTP Method**: GET
- **Description**: Retrieve the contents of a specific file.
- **Authentication**: None required

### Upload a Single File

- **URL**: `/api/file/upload-single`
- **HTTP Method**: POST
- **Description**: Upload a single file to the server.
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `file` (file): The file to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Upload Multiple Files

- **URL**: `/api/file/upload-multiple`
- **HTTP Method**: POST
- **Description**: Upload multiple files to the server.
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `files` (files): The files to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Upload an Image (Base64)

- **URL**: `/api/file/upload-base64`
- **HTTP Method**: POST
- **Description**: Upload an image in base64 format.
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `image` (strng): The image must be base64 image strign to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Convert PDF to Image (First Page)

- **URL**: `/api/file/pdf-to-image`
- **HTTP Method**: POST
- **Description**: Convert a specific PDF to an image (first page only).
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `file` (file): The file to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Convert Multiple PDFs to Images (First Page)

- **URL**: `/api/file/pdfs-to-image`
- **HTTP Method**: POST
- **Description**: Convert multiple PDFs to images (first page only).
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `files` (files): The files to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Convert Office to PDF

- **URL**: `/api/file/office-to-pdf`
- **HTTP Method**: POST
- **Description**: Upload an office document and convert it to a PDF.
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `file` (file): The file to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Convert Multiple Offices to PDFs

- **URL**: `/api/file/offices-to-pdf`
- **HTTP Method**: POST
- **Description**: Upload multiple office documents and convert them to PDFs.
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `files` (files): The files to be uploaded.
- `folder` (string): The destination folder where the file should be stored.

### Convert Office to PDF to Image (First Page)

- **URL**: `/api/file/office-to-pdf-image`
- **HTTP Method**: POST
- **Description**: Convert an office document to a PDF and then to an image (first page only).
- **Authentication**: Basic Auth (Username and Password required)

**Request Fields (form-data):**

- `key` (string): A unique key or identifier for the file.
- `file` (file): The file to be uploaded.
- `folder` (string): The destination folder where the file should be stored.


## Authentication Login (Use for Web Integrate)
### Route

- **URL**: `/api/auth/login`
- **HTTP Method**: POST
- **Description**: Authenticate a user with their phone and password to obtain an access token.
- **Authentication**: None required

**Request Fields (JSON):**

- `phone` (string): The user's phone number.
- `password` (string): The user's password.

**Response (JSON):**

The response to the authentication login request includes the following fields:

- `statusCode` (number): The status code of the response, with a value of 200 indicating a successful response.
- `data` (object): An object containing the authentication information.
  - `access_token` (string): The access token for the authenticated user.
  - `expires_in` (number): The duration in seconds for which the access token is valid.
  - `user` (object): User information.

**Example Success Response (JSON):**

```json
{
    "statusCode": 200,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiWWltIEtsb2siLCJwaG9uZSI6IjA5Nzc3Nzk2ODgiLCJhdmF0YXIiOiJhcGkvZmlsZS9zZXJ2ZS9hYTIwZWJjYi04YjM5LTQ3ZjMtYjUzNi1iNzVlYWFkOTFiMDUiLCJ0eXBlIjoiRGV2ZWxvcGVyIiwiY3JlYXRlZF9hdCI6IjIwMjMtMTAtMTdUMDc6Mzg6NDkuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIzLTEwLTE3VDA3OjM4OjQ5LjAwMFoifSwiaWF0IjoxNjk3NTk4NTE5LCJleHAiOjE2OTc2ODQ5MTl9.0HRYcpl41ENWbWjzzIL40BgMCx_QW5Qy3Z5QFQJdHg0",
        "token_type": "bearer",
        "expires_in": "24h",
        "user": {
            "id": 1,
            "name": "Yim Klok",
            "phone": "0977779688",
            "avatar": "api/file/serve/aa20ebcb-8b39-47f3-b536-b75eaad91b05",
            "type": "Developer",
            "created_at": "2023-10-17T07:38:49.000Z",
            "updated_at": "2023-10-17T07:38:49.000Z"
        }
    }
}
```

# Authorization Users

## About Project

### List Projects

#### Route

- **URL**: `/api/project`
- **HTTP Method**: GET
- **Description**: Retrieve a list of all projects.
- **Authentication**: Requires JWT authorization.

#### Response

[...]
### View Project

#### Route

- **URL**: `/api/project/:id`
- **HTTP Method**: GET
- **Description**: Retrieve details of a specific project by providing its ID in the URL.
- **Authentication**: Requires JWT authorization.

#### Response

[...]
### Create Project

#### Route

- **URL**: `/api/project`
- **HTTP Method**: POST
- **Description**: Create a new project by providing the necessary project details in the request.
- **Authentication**: Requires JWT authorization.

#### Request Fields (JSON or form-data):

[...]
### Update Project

#### Route

- **URL**: `/api/project/:id`
- **HTTP Method**: PUT
- **Description**: Update the details of an existing project by providing its ID in the URL and the updated project details in the request.
- **Authentication**: Requires JWT authorization.

#### Request Fields (JSON or form-data):

[...]
### Delete Project

#### Route

- **URL**: `/api/project/:id`
- **HTTP Method**: DELETE
- **Description**: Delete a specific project by providing its ID in the URL.
- **Authentication**: Requires JWT authorization.

#### Response

[...]


## License

ExpressJS with [YIM KLOK](https://t.me/yim_klok).
