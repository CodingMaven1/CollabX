const express = require('express');
var cors = require('cors');
const userRouter = require('./routers/user')
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(userRouter)

app.listen(port, () => {
    console.log("Server is running on " + port)
})