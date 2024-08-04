const express = require('express');
const { books } = require('../data/books.json');
const { users } = require('../data/users.json');

const router = express.Router();


/**
 * Route: /books
 * Method: GET
 * Description: get all the boks info 
 * Access: Public
 * Parameters: None
 */
router.get('/',(req,res)=>{
    res.status(200).json({
        success:'true',
        message:"got all the info about the books",
        data:books,
    });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: get the specific book info
 * Access: Public
 * Parameters: Id
 */
router.get('/:id',(req,res)=>{
    const { id } = req.params;
    const book = books.find((each)=>each.id===id);
    if(!book){
         return res.status(404).json({
            success:'false',
            message:'the book id not found',
        });
    }
    return res.status(200).json({
        success:'true',
        message:'got specific book by id',
        data:book,
    });
});

/**
 * Route: /books/issued
 * Method: GET
 * Description: to get the user with issue book 
 * Access: Public
 * Parameters: None
 */

router.get('/issued/by-user',(req,res)=>{
    const userWithIssuedBook =  users.filter((each)=>{
        if(each.issuedBook) return each;
    })
    const issuedBooks = [];
    userWithIssuedBook.forEach((each) => {
        const book = books.find((book)=> book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
        
    });
    if(issuedBooks.length ===0){
        return res.status(404).json({
            success:'false',
            message:'user not Issued a Book Yet ',

        });
    }
    return res.status(200).json({
        success:'true',
        message:'users found who are Issued with a Books ',
        data:issuedBooks,
    });
});

/**
 * Route: /
 * Method: POST
 * Description: to create new book 
 * Access: Public
 * Parameters: None
 * data:id,name,author,genre,price,publisher
 */
router.post('/',(req,res)=>{
    const {data} = req.body;
    if(!data){
        return res.status(404).json({
            success:false,
            message:'No data to add a Book'
        })
    }

    const book = books.find((each)=>each.id==data.id);
    if(book){
        return res.status(404).json({
            success:false,
            message:'book with ID already Exist..!'
        })
    }
    const allbooks = {...books,data};
    return res.status(200).json({
        success:true,
        message:'a new book got added',
        data: allbooks,
    })
});

/**
 * Route: /upateBook/:{id}
 * Method: PUT
 * Description: to upddate a new book
 * Access: Public
 * Parameters: Id
 * data:id,name,author,genre,price,publisher
 */

router.put('/updateBook/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;
    
    if(!data){
        return res.status(404).json({
            success:false,
            message:'No data to add a Book'
        })
    }

    const book = books.find((each)=>each.id===id);
    if(!book){
        return res.status(400).json({
            success:false,
            message:"book with id doesn't exist..!!"
        });
    }

    const updateBookData = books.map((each)=>{
        if(each.id === id){
            return {...each,...data};
        }
        return each;
    });
    return res.status(200).json({
        success:true,
        message:'book data got updated..!!',
        data:updateBookData,
    });
});

module.exports = router;