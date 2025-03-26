import {UUID} from "sequelize"
import Users from "../models/Users.js"
import argon2 from "argon2"
import jwt from 'jsonwebtoken';





export const registerUser = async (req, res) => {
    const {username, password} = req.body;

    const hashPassword = await argon2.hash(password);

    try {
        await Users.create({
            username: username,
            password: hashPassword
        })
        res.status(200).json({msg: "successFully Registered"})
    } catch (error) {

        res.status(400).json({msg: "Registration failed"})
        
    }
}

export const Login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            username: req.body.username
        }
    })

    if(!user){
        return res.status(404).json({msg: "user not found"})
    }

    const match = await argon2.verify(user.password , req.body.password)
    if(!match){
        return res.status(404).json({msg: "wrong password"})
    }

    const token = jwt.sign(
        { userId: user.uuid },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.cookie('session_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, 
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'strict'
      });

      

        res.json({ 
      user: { 
        uuid: user.uuid, 
        username: user.username 
      }
    });

}



export const checkAuth = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    
    const userData = {
      uuid: req.user.uuid,
      username: req.user.username,
      
    };

    res.status(200).json({ user: userData });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
