import { Router } from "express";
const router = Router();

import { __dirname } from "../path.js";
import path from 'path';

import ProductManager from "../managers/product.manager.js";
// const productManager = new ProductManager(`${__dirname}/db/products.json`);
const productManager = new ProductManager(path.join(__dirname, 'db', 'products.json'));

import {productValidator} from '../middlewares/productValidator.js'
import { socketServer } from "../server.js";

router.get('/', async(req, res) => {
    try {
        const { limit } = req.query;
        console.log(limit);
        const products = await productManager.getProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});

router.get("/:idProd", async (req, res) => {
    try {
      const { idProd } = req.params;
      const product = await productManager.getProductById(idProd);
      if (!product) res.status(404).json({ msg: "product not found" });
      else res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });


router.post('/', productValidator, async (req, res)=>{
    try {
        console.log(req.body);
        const product = req.body;

        const newProduct = await productManager.createProduct(product)


        //TODO  emite el socket server
        const products = await productManager.getProducts()
        socketServer.emit('updateProducts', products)
        //TODO  end

     
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put("/:idProd", async (req, res) => {
    try {
      const { idProd } = req.params;
      const prodUpd = await productManager.updateProduct(req.body, idProd);
      if (!prodUpd) res.status(404).json({ msg: "Error updating prod" });

          //TODO  emite el socket server
          const products = await productManager.getProducts()
          socketServer.emit('updateProducts', products)
          //TODO  end
         
      res.status(200).json(prodUpd);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });

router.delete("/:idProd", async (req, res) => {
    try {
      const { idProd } = req.params;
      const delProd = await productManager.deleteProduct(idProd);
      if(!delProd) res.status(404).json({ msg: "Error delete product" });
      else {
         //TODO  emite el socket server
         const products = await productManager.getProducts()
         socketServer.emit('updateProducts', products)
         //TODO  end
        
        res.status(200).json({
        msg : `product id: ${idProd} deleted successfully`,
        
      })}
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });

router.delete('/', async(req, res)=>{
    try {
        await productManager.deleteFile();

       

        res.send('products deleted successfully')
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

export default router;










