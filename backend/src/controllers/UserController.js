const User = require('../models/User');
const bcrypt = require('bcrypt');


module.exports = {

    /** METHOD FOR CREATING A USER STARTS */
    async createUser(req, res) { 
        try {
            // Get the following fields from the body
            const {firstName, lastName, password, email} = req.body;

            //Check if user exists
            const existentUser = await User.findOne({email});

            //If user doesnt exist
            if(!existentUser){
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await User.create({
                    firstName,
                    lastName,
                    password: hashedPassword,
                    email
                });
                //Either return this
                return res.json({
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
            }

            //OR Return this
            return res.status(400).json({
                message: 'User already exist. Do you want to login instead?'
            })

        }catch(error) {
            throw Error(`Error while registering new user: ${error}`);
        }
    },
     /** METHOD FOR CREATING A USER ENDS */



     /** METHOD FOR FETCHING A USER BY ID STARTS */
    async getUserById(req, res){
        
        const {userId} = req.params;

        try{
            const user = await User.findById(userId);
            return res.json(user);
        }catch (error) {
            return res.status(400).json({
                message: 'User ID does not exist, do you want to register instead?'
            })
        }
    }
     /** METHOD FOR FETCHING A USER BY ID ENDS */
}