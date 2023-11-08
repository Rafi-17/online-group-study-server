const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());


app.get('/', (req, res) => {
    res.send('Online group study is running')
})

app.listen(port, () => {
    console.log(`Online group study Server is running on port ${port}`)
})