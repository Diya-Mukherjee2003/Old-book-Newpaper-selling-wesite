import express from "express";
import { addProduct,updateProduct,deleteProduct, getAllProduct,getProductbyID,getMyProduct, searchProducts} from "../Mvc-controller/ProductController.js";
import { isAuthenticated } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
const Router = express.Router();

Router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Our_old_newspaper_selling_website'
    })
})

Router.post('/add', isAuthenticated, upload.single("image"), addProduct)
Router.put('/:id', isAuthenticated, updateProduct)
Router.delete('/:id', isAuthenticated, deleteProduct)
Router.get('/allproducts', getAllProduct)
Router.get('/search', searchProducts)

// Put specific routes BEFORE dynamic routes
Router.get('/myproduct', isAuthenticated, getMyProduct)  // Move this up
Router.get('/:id', isAuthenticated, getProductbyID)     // Keep this last


export default Router;