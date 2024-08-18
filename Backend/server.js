const express = require('express');
const mongoose = require('mongoose');
//const dbConnectionString = require('../Database/db');
const dbConnectionString = process.env.MONGO_URI; // Use environment variable
//const dbConnectionString = 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/myDB2'
const usersRoutes = require('./routes/userAPI');
//const usersRoutes = require('./routes/User');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB using the connection string from db.js
mongoose.connect(dbConnectionString)
.then(() => {
    console.log('Connected to MongoDB');
   

    // Serve static files from the Angular app
    //app.use(express.static(path.join(__dirname, 'frontend', 'dist', 'User-app')));

    app.use('/api', usersRoutes);

     // All other routes should redirect to the Angular app
    /*app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'User-app', 'index.html'));
      });*/
 

        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});