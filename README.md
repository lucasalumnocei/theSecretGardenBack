# Secret Garden Backend
## Description
This is the backend for the Secret Garden final project. It is a RESTful API built with Node.js, Express, and MySQL. It is deployed on RENDER and can be requested at https://the-secret-garden-backend.onrender.com/. 

The frontend is also deployed and can be accessed at https://the-secret-garden.onrender.com/. 
The frontend repo can be found at https://github.com/lucasalumnocei/secretGardenFront.

## Installation
- To install the backend, clone the repo and run `yarn` to install the dependencies. 
- Then, run `yarn start` to start the server.
- The server will be running on port 3000. { on render, the server was running on 10000, so I changed the configuration on the env variables.}

## Usage
- The API can be accessed at https://the-secret-garden-backend.onrender.com/.
- The API has the following endpoints:
    - POST /api/register - Registers a new user. Requires a body with the following fields: username, password, email, and name.
    - POST /api/login - Logs in a user. Requires a body with the following fields: username and password.
    - GET /api/dashboard/items:userId - Gets all the items associated with the sent user Id.
    - POST /api/dashboard/items - Creates a new item. Requires a body with the following fields: name, description, author and user_id.
    - PATCH /api/dashboard/items/:itemId - Updates an item. Requires a body with the following fields: name, description, author and user_id.
    - DELETE /api/dashboard/items/:itemId - Deletes an item.