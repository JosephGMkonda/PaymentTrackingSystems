import {UUID} from "sequelize"
import Users from "../models/Users.js"
import argon2 from "argon2"




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

    req.session.UserId = user.uuid;
    const uuid = user.uuid;
    const username = user.username;


    res.status(200).json({uuid, username})

}

