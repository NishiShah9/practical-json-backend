const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Successfully connected to database`);
    }
})