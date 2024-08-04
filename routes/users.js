const express = require('express');
const { users } = require('../data/users.json');
 
const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: to get all users
 * Access: public
 * Parameters: None
 */

router.get('/',(req,res)=>{
    res.status(200).json({
        success:'true',
        data: users,
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: to get specfic user by their id
 * Access: public
 * Parameters: id
 */
router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const  user = users.find((each)=> each.id===id);
    if(!user){
        return res.status(404).json({
            success:'false',
            message:'User not found'
        });
    }
    return res.status(200).json({
        success:"true",
        message:'User found',
        data:user,
    });

});


/**
 * Route: /users
 * Method: POST
 * Description: to create a new user by post method
 * Access: public
 * Parameters: none
 */

router.post("/",(req,res)=>{
    const {id, name, surname, email, subscriptionType, subscriptionDate } = req.body;
    const user = users.find((each)=>each.id===id);
    if(user){
        return res.status(404).json({
            success:'false',
            message:"User with ID already Exist",
        });
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate,
    });
    return res.status(200).json({
        success:"true",
        message:"user added",
        data:users,
    });
        
    
});

/**
 * Route: /users
 * Method: PUT
 * Description: to update the user details based on their ID
 * Access: public
 * Parameters: Id
 */

router.put('/:id',(req,res) => {
    const { id } = req.params;
    const {data} = req.body;

    const user  = users.find((each)=> each.id===id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user doesn't exist",
        });
    }
    const updateUserData = users.map((each)=>{
        if(each.id===id){
            return{
                ...each,
                ...data
            }
        }
        return each;
    });
    return res.status(200).json({
        success:"true",
        message:'user updated successfully ',
        data: updateUserData,
    });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their id
 * Access: Public
 * Parameters: ID
 */
router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id===id);
    if(!user){
        res.status(404).json({
            success:false,
            message:"user doesn't Exist",
        });
    }
    const index = users.indexOf(user);
    users.splice(index,1);

    return res.status(200).json({
        success:"true",
        message:"specific user got deleted ",
        data:users,
    });
});

/**
 * Route: /subscription-details/:id
 * Method: GET
 * Description: Get user subscription details
        >> Date of Subscription
        >> Valid till
        >> Is there any fine
 * Access: Public
 * Parameters: ID
 */

router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User With The ID Didnt Exist",
    });
  }

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  // Jan 1 1970 UTC
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  // console.log("returnDate ", returnDate);
  //   console.log("currentDate ", currentDate);
  //     console.log("subscriptionDate ", subscriptionDate);
  //       console.log("subscriptionExpiration ", subscriptionExpiration);

  const dt = {
    ...user,
    isSubscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 100
          : 50
        : 0,
  };
  return res.status(200).json({
    success: true,
    message: "Subscription detail for the user is: ",
    data:dt,
  });
});




module.exports = router;