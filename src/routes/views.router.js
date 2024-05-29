import { Router } from "express";
const router = Router();

import { __dirname } from "../path.js";
import ProductManager from "../managers/product.manager.js";

const productManager = new ProductManager(`${__dirname}/db/products.json`);
 
const homeRouter = router.get('/home', async (req, res)=>{
    try {
        const products = await productManager.getProducts();

        
        //! res.render('home', products) // ASI NO SE ENVIO SIEMPRE PONER PARENTESIS
        res.render('home', {products})
    } catch (error) {

        console.log('EEERRRRROOOOORRR', error)
        res.status(404).render('error',{error} )
    }
})

 const homeRouter2 = router.get('/realtimeproducts', async (req, res)=>{
    try {
        const products = await productManager.getProducts();

    
        //! res.render('home', products) // ASI NO SE ENVIO SIEMPRE PONER PARENTESIS
        res.render('realtimeproducts', {products})
    } catch (error) {
        console.log('EEERRRRROOOOORRR', error)
        res.status(404).render('error',{error} )
    }
})

export default router