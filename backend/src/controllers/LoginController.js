const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async store(req, res) {
        try {
            const {email, password} = req.body;
            if(!email || !password) {
                return res.status(200).json({message: 'Required fields missing'});
            }

            const user = await User.findOne({email});
            if(!user){
                return res.status(200).json({message: 'User not found'});
            }

            if(user && await bcrypt.compare(password, user.password)){
                const userResponse = {
                    _id:user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                }
                return jwt.sign({user: userResponse}, 'secret', (err, token)=>{
                    return res.json({
                        user: token,
                        user_id: userResponse._id
                    })
                })
            }else {
                return res.status(200).json({message: 'Credentials miss-matched!'});
            }
        }catch (error) {
            throw Error(`Error while authenticating the user ${error}`)
        }
    }
}