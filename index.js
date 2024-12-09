import express from "express";
import userRoute from "./src/router/userRoute.js";
import cors from "cors"
import sequelize from "./src/models/index.js";
import { json } from "sequelize";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:'*'}));
app.use('/users',userRoute);
// app.use('/uploads', express.static('uploads'));
app.use(express.static('images'));


// app.get('/',(req,res)=>{
//     res.json(User)
// })
// Sync models (create tables if they don't exist)
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 8007
app.listen(PORT,()=>{
    console.log('server running port '+PORT);
})