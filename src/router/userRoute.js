import express from "express";
import userController from "../controller/controller.js";
import upload from "../controller/upload.js";
const router = express.Router();

router.get('/users',userController.getUsers);
router.post('/register',upload.single('image'),userController.register);
router.post('/login',userController.login);
router.get('/verifyToken',userController.verifyToken);
router.post('/add-logo',upload.single('image'),userController.add_logo);
router.get('/get-logo',userController.get_logo);
router.put('/update-logo/:id',userController.update_logo);
router.delete('/delete-logo/:userId',userController.delete_logo);
router.get('/get-product',userController.getProducts);
// router.get('/get-product-search',userController.searchProduct);
router.get('/get-product/:id',userController.getParamProduct);
router.get('/get-main-product/:id',userController.getMainProduct);

router.post('/add-product', upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]), userController.addProduct);
router.put('/update-product/:id',upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),userController.updateProduct);
router.delete('/delete-product/:id',userController.deleteProduct);
router.get('/get-customer',userController.getCustomer);

router.post('/customer-add',upload.single('image'),userController.customer);
router.get('/get-feedback',userController.getFeedback);
router.post('/feedback-add',upload.single('image'),userController.feedbackAdd);


export default router;


