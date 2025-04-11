import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const newUser = new User({
      name,
      email,
      password, 
      role,
      
    });

    

    await newUser.save();
    if(newUser){
      res.status(200).json({
        message: "User created successfully",
        name:newUser.name,
        email:newUser.email,
        role:newUser.role,
      
        
      })
    }

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user || !user.matchPassword(password)) {
      
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful!",
          user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
          },
          token:generateToken(user._id)});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const id=req.user._id
    console.log(id)

    const user = await User.findById(id).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching user profile." });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching all users." });
  }
};
