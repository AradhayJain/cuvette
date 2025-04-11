import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"


// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token
    // Get token from header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(verified.id).select("-password")
        next()
    } catch (error) {
        res.status(401)
        throw new Error("Not authorized, token failed")
    }
})
export default protect


