import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { createConnection } from 'mysql';

const app = express();
// I created a CORS whitelist with the URL of the frontend



// Initialize various middleware for the Express app
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded request bodies
app.use(express.json()); //Parses JSON request bodies
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)
dotenv.config();


const port = process.env.PORT || 3000;
// I Started the Express app on port 3000 and log a message upon success
app.listen(port, () => {
  console.log('Express server is working');
  console.log('Server is exposed on port ' + port);
});

const corsOptions = {
  origin: process.env.URL_FRONTEND, // URL of RENDER frontend
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
};

app.options('*', cors(corsOptions)); // enabling CORS Pre-Flight for all routes for RENDER frontend

//Then i created a connection to a MySQL database
const db = createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'thesecretgarden',
});

// Connect to the MySQL database and log success or error
db.connect((err) => {
  if (err) {
    console.log('There was an error connecting to the database', err);
  } else {
    console.log('Database connection successful');
  }
});

// Handle HTTP POST requests to '/api/register'
app.post('/api/register', (req, res) => {
  // Extract data (name, email, password) from the request body
  const { name, email, password } = req.body;
  const queryUsers = 'SELECT * FROM Users WHERE email = ?'; // Check if the email already exists in the database
  db.query(queryUsers, [email], (err, results) => {
    if (err) {
      console.log('Error when trying to register:' + err);
      res.status(err.code).send('Server error');
    } else if (results.length > 0) {
      res.json({
        status: 1,
        message: 'This email already exists, please choose another one',
      });
    } else {
      // If the email is not in the database, insert the user's data
      const insert = 'INSERT INTO Users (name,email,password) VALUES (?,?,?)';
      db.query(insert, [name, email, password], (err) => {
        if (err) {
          console.log('Error while registering', +err);
          res.status(500).send('Server error');
        } else {
          res.json({
            status: 2,
            message: 'Registration successfully completed',
          });
        }
      });
    }
  });
});

// Handle HTTP POST requests to '/api/login'
app.post('/api/login', (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body
  const query = 'SELECT * FROM Users WHERE email = ? AND password = ?'; // Query the database to check if the provided credentials are valid

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.log('Query error' + err);
      res.status(500).send('Server error');
    } else if (results.length < 1) {
      res.status(401).send('Incorrect email or password');
    } else {
      // If valid, create a user object and send a success response
      let user = {
        id: results[0].id,
        email: results[0].email,
        name: results[0].name,
      };
      res.json({ message: 'Successful login', user });
    }
  });
});

// Handle HTTP POST requests to '/api/dashboard/items
app.post('/api/dashboard/items', (req, res) => {
  const { name, author, description, user_id } = req.body; // Extract data (name, author, description, user_id) from the request body

  const insertQuery = // Insert the data into the database
    'INSERT INTO Items (name, author, description, user_id) VALUES (?, ?, ?, ?)';

  db.query(
    insertQuery,
    [name, author, description, user_id],
    (err, response) => {
      if (err) {
        console.log('Error inserting data into the database:', err);
        res.status(500).json({ message: 'Server error' });
      } else {
        console.log('Data successfully inserted into the database.');
        res.json({
          message: 'Form data sent successfully',
          id: response.insertId,
        });
      }
    }
  );
});

// Handle HTTP PATCH requests to '/api/dashboard/items/:id'
app.patch('/api/dashboard/items/:id', (req, res) => {
  const { name, author, description, user_id } = req.body; // Extract data (name, author, description, user_id) from the request body
  const updateQuery = // Update the item in the database based on the provided item ID
    'UPDATE Items SET name = ?, author = ?, description = ?, user_id = ? WHERE id = ?';

  db.query(
    updateQuery,
    [name, author, description, user_id, req.params.id],
    (err) => {
      if (err) {
        console.log('Error when updating data in the database:', err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        console.log('Data successfully updated in the database.');
        res.json({ message: 'Form data successfully updated' });
      }
    }
  );
});

// Handle HTTP GET requests to '/setcookie'
app.get('/setcookie', (req, res) => {
  res.cookie('datas', 'mycookie', {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expires 7 days
    httpOnly: true,
    secure: true,
  });
  res.send('Cookie set successfully');
});

// Handle HTTP GET requests to '/getcookies'
app.get('/getcookies', (req, res) => {
  // Retrieve and send all cookies in the response
  const cookies = req.cookies;
  res.json(cookies);
});

// Handle HTTP GET requests to '/deletecookie'
app.get('/deletecookie', (req, res) => {
  res.clearCookie('datas'); // Clear the cookie named 'datas
  res.send('Cookie successfully deleted');
});

// Handle HTTP GET requests to '/api/dashboard/items/:userId'
app.get('/api/dashboard/items/:userId', (req, res) => {
  // Retrieve all items from the database based on the userId
  const query = 'SELECT * FROM Items where user_id = ?';

  db.query(query, req.params.userId, (err, results) => {
    if (err) {
      console.log('Error retrieving data from the database:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      console.log('Data successfully retrieved from the database.');
      res.json({ items: results });
    }
  });
});

// Handle HTTP DELETE requests to '/api/dashboard/items/:id'
app.delete('/api/dashboard/items/:id', (req, res) => {
  // Delete the item from the database based on the item ID
  const deleteQuery = 'DELETE FROM Items WHERE id = ?';

  db.query(deleteQuery, req.params.id, (err) => {
    if (err) {
      console.log('Error when deleting data from the database:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      console.log('Data successfully deleted from the database.');
      res.json({ message: 'Form data successfully deleted' });
    }
  });
});

// Handle HTTP GET requests to '/api/dashboard/items'
app.get('/api/dashboard/items', (req, res) => {
  // Retrieve items from the database based on the user's username stored in a cookie
  const username = req.cookies.username;
  const query = 'SELECT * FROM Items where user_id = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.log('Error retrieving data from the database:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      console.log('Data successfully retrieved from the database.');
      res.json({ items: results });
    }
  });
});
