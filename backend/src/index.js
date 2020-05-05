const express = require('express');
var cors = require('cors');
const userRouter = require('./routers/user')
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter)

app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(port, () => {
    console.log("Server is running on " + port)
})