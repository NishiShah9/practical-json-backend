const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const JsonPatchController = require('./controller/jsonPatch.controller')

require('./db/dbConnection')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

dotenv.config();


//json patch route

app.post('/applyPatch',JsonPatchController.applyPatch);
app.post('/updatePatch',JsonPatchController.updatePatch)


app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})