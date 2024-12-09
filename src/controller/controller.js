import User from "../models/userModel.js"
import userLogo from "../models/userLogo.js"
import product from "../models/product.js"
import customerOrder from "../models/customerOrder.js"
import feedback from "../models/feedback.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import path from "path"
import { where } from "sequelize";
import { profile } from "console"
const JWT_SECRET = process.env.JWT_SECRET || 'BKRI&$^#J449%hrURKM*^$'

const getUsers =async(req,res)=>{
    try{
        const users = await User.findAll();
        res.status(201).json(users);
    }catch(err){
        res.status(400).json({error : err.message})
    }
}
const register = async (req, res ,next) => {
    // Check if the image file was uploaded
    if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded!',
        });
    }

    // Store the file path from Multer
    // const imageUrl = req.file.filename;

    try {
        const { username, email, password } = req.body;

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and store imageUrl with it
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profile : req.file ? req.file.filename : null, // Save the file path to the database
        });

        res.status(201).json({ 
            success: true,
            message: 'User registered successfully', 
            user: newUser,
        });
        next();
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'User not registered successfully', 
            error: err.message,
        });
    }
};


// Login function
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token with user profile
        const token = jwt.sign(
            { id: user.id, username: user.username},
            JWT_SECRET,
            // { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: 'Login successfuly',
            profile: { id: user.id, username: user.username,profile : user.profile }, // Send only necessary profile info
            token: token
        });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
const verifyToken = async (req, res) => {
    const authHeaders = req.headers.authorization;
    
    // Check if authorization header is present
    if (!authHeaders) {
        return res.status(403).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract the token from the header
    const token = authHeaders.split(" ")[1];    

    try {
        // Verify the token using JWT_SECRET
        jwt.verify(token, JWT_SECRET, async (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: 'Forbidden: Invalid token' });
            }

            // Token is valid, now check if the user still exists in the database
            const user = await User.findByPk(decoded.id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Token is valid, and the user exists
            return res.status(200).json({ 
                id: user.id, 
                username: user.username,   
                password : user.password,
                profile : user.profile, 
                message: 'Token verified successfully' 
            });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error verifying token', error: err.message });
    }
};

const get_logo = async(req,res) =>{
    try{
        const getLogo = await userLogo.findAll();
        res.status(200).json({getLogo, message :'get Logo sucessfuly'});
    }catch(err){
        res.status(400).json({error : err.message});
    }
}

// add logo Website
const add_logo = async(req,res) =>{
    try{
        const {status,thumbnail} = req.body;
        const logo_add = await userLogo.create({status,thumbnail :req.file? req.file.filename : null});
        res.status(200).json({logo_add,message : 'Add Logo Success'});
    }catch(err){
        res.status(400).json({error : err.message});
    }
}
// update logo website
const update_logo = async(req,res)=>{
    try {
        const user = await userLogo.findByPk(req.params.id);
        if (user) {
          await user.update(req.body);
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

// delete logo website

const delete_logo = async(req,res)=>{
    try {
        const { userId } = req.params;
    
        // Find the user
        const user = await userLogo.findByPk(userId);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Delete the user (and optionally their posts)
        await user.destroy(); // This will delete the user and their posts if cascade is set
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
// get Products All
const getProducts = async(req,res) =>{
    try{
      const limit = parseInt(req.query.limit) || 6;
        const products = await product.findAll({
          order: [['id', 'DESC']],
          limit:limit
        });
        res.status(200).json({
            message : 'Get Products Success',
            data : products
        })
    }catch(err){
        console.log(err);
    }
}
// search product
// const searchProduct = async(req,res) =>{
//     const query = req.query.query?.toLowerCase() || "";
//     const filteredProducts = product.filter((product) =>
//       product.proName.toLowerCase().includes(query)
//     );
//     res.json(filteredProducts);
// }
// get main product detail
const getMainProduct = async (req,res) =>{
    try{
      const productId = parseInt(req.params.id);
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" }); // Return an error if ID is not provided
      }
      const productData = await product.findOne({
        where : {id : productId},
      });
      res.status(200).json({
          message : 'Get main Products Success',
          data : productData
      })
    }catch(err){
      console.log('error get main product',err);
    }
} 

const addProduct = async (req, res) => {
    try {
      const { proName, title, description, category } = req.body;
  
      // Extract filenames from uploaded files
      const banner = req.files.banner ? req.files.banner[0].filename : null;
      const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].filename : null;
  
      // Save product to the database
      const productInsert = await product.create({
        proName,
        title,
        category,
        description,
        banner,
        thumbnail,
      });
  
      res.status(200).json({
        data: productInsert,
        message: "Product added successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Error adding product" });
    }
  };
// Update Product
const updateProduct = async (req, res) => {
    try {
      // Find the product by ID
      const updateProductItem = await product.findByPk(req.params.id);
  
      if (!updateProductItem) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Check for uploaded files
      const banner = req.files?.banner ? req.files.banner[0].filename : updateProductItem.banner;
      const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : updateProductItem.thumbnail;
  
      // Update product details
      const updatedData = {
        proName: req.body.proName || updateProductItem.proName,
        title: req.body.title || updateProductItem.title,
        category: req.body.category || updateProductItem.category,
        description: req.body.description || updateProductItem.productType,
        banner,
        thumbnail,
      };
  
      await updateProductItem.update(updatedData);
  
      res.json({
        message: "Update Product Success",
        data: updateProductItem,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
const deleteProduct = async(req,res)=>{
    try {
        const { id } = req.params;
    
        // Find the user
        const deletePro = await product.findByPk(id);
    
        if (!deletePro) {
          return res.status(404).json({ error: 'Product Delete not Success' });
        }
    
        // Delete the user (and optionally their posts)
        await deletePro.destroy(); // This will delete the user and their posts if cascade is set
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
const getParamProduct = async (req,res) =>{
   try{
    const { id } = req.params;
     const getParam = await product.findByPk(id);
     res.status(200).json({data : getParam , message :'getParam Product Success'})
    
   }catch(err){
    console.log(err.message)
   }
}

// Get Product Customer Users
const getCustomer = async (req,res) =>{
     try{
          const getProductCustomer = await customerOrder.findAll({
             order : [['id','DESC']]
          });
          res.status(200).json({message : 'get Product Customer Success',data : getProductCustomer});
     }catch(err){
       console.log("Can't Get Product Customer Users",err);
     }
}
// Add Order Customer Users
const customer = async(req,res) =>{
  
    try{
        const {name,productOrder,phone,address} = req.body
        const addCustomer = await customerOrder.create({
          name,productOrder,phone,address,
          thumbnail:req.file? req.file.filename : null
        })
        res.status(200).json({
           message :'Customer Add Product Success',
           data : addCustomer,
        })
    }catch(err){
      console.log('message Error'+err);
    }
}
// get feedback 

const getFeedback = async (req,res)=>{
  try{
      const getFeedbackAll = await feedback.findAll();
      res.status(200).json({message : 'get feedback Success',data : getFeedbackAll});
  }catch(err){
    console.log(`Error feedback ${err}`);
  }
}

const feedbackAdd = async (req,res) =>{
    try{
      const {name,email,address,description} = req.body
      const  postFeedback = await feedback.create({
        name,
        email,
        address,
        description,
        thumbnail :req.file? req.file.filename : null
      })
      res.status(200).json({data : postFeedback, message :'feedback Success'});
    }catch(err){
        console.log('feedback Error',err);
    }
}
export default {
    getUsers,
    register,
    login,
    verifyToken,
    add_logo,
    get_logo,
    delete_logo,
    update_logo,
    getProducts,
    // searchProduct,
    getMainProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getParamProduct,
    getCustomer,
    customer,
    getFeedback,
    feedbackAdd,
}