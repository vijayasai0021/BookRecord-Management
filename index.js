const express = require('express');
const {users} = require('./data/users.json');

const app = express();

const userRouter = require("./routes/users");
const booksRouter = require("./routes/books");


const port = 8081;

app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({
        message:'server is running good...',
    });
});

app.use("/users", userRouter);
app.use("/books", booksRouter);



/**
 * Route: /
 * Method: GET
 * Description: to display that whether the root exist or not
 * Access: none
 * Parameters: None
 */
app.get('*',(req,res)=>{
    res.status(404).json({
        message : "server is not available and not build"
    });

});

app.listen(port ,()=>{
    console.log(`server is at the port: ${port}`);
});
