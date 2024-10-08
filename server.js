const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

// Create a database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Test the database connection
db.execute('SELECT 1')
  .then(result => {
    console.log('Database connection successful!')
    // db.end(); // Close the connection (not needed, we'll keep the connection open)
  })
  .catch(error => {
    console.error('Error connecting to database:', error)
    // db.end(); // Close the connection (not needed, we'll keep the connection open)
  })
  .finally(() => {
    // listen to the server
    const PORT = 3000
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`)
    })

    // Question 1: Retrieve all patients
    app.get('/patients', async (req, res) => {
      try {
        const patients = await db.execute('SELECT patient_id, first_name, last_name, date_of_birth FROM patients');
        res.json(patients[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving patients' });
      }
    });

    // Question  2: Retrieve all providers
    app.get('/providers', async (req, res) => {
      try {
        const providers = await db.execute('SELECT first_name, last_name, provider_specialty FROM providers');
        res.json(providers[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving providers' });
      }
    });

    // Question 3 : Filter patients by First Name
    app.get('/patients/:firstName', async (req, res) => {
      const firstName = req.params.firstName;
      try {
        const patients = await db.execute(`SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?`, [firstName]);
        res.json(patients[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving patients by first name' });
      }
    });

    // Question 4: Retrieve all providers by their specialty
    app.get('/providers/:specialty', async (req, res) => {
      const specialty = req.params.specialty;
      try {
        const providers = await db.execute(`SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?`, [specialty]);
        res.json(providers[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving providers by specialty' });
      }
    });
  })