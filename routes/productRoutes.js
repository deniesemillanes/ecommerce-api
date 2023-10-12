const express = require("express");
const router = express.Router();
const auth = require("../auth");
const productController = require("../controllers/productControllers");


/*-------Create New Product - ADMIN ONLY-------*/
router.post("/", auth.verifyToken, (req,res) => {
	const userData = auth.decodeToken(req.headers.authorization);

 	if (userData.isAdmin == true) {
	 	productController.newProduct(req.body).then(resultFromController => res.send(resultFromController));
	 } else {
	 	res.send ("You must be an Admin to be able to add a product.");
	 }
}
);


/*-------Get All Products - ADMIN ONLY-------*/
router.get("/all", auth.verifyToken, (req,res) => {
	const userData = auth.decodeToken(req.headers.authorization);

 	if (userData.isAdmin == true) {
		productController.allProducts().then(resultFromController => res.send(resultFromController));
	} else {
	 	res.send ("You must be an Admin to be able to get all products.");
	 }
}	
); 



/*-------Get All Active Products-------*/
router.get("/", (req,res) => {
		productController.getAllActiveProducts().then(resultFromController => res.send(resultFromController));
	}	
); 


/*-------Get Specific Product-------*/
router.get("/:productId", (req,res) => {
		//console.log(req.params)
		productController.getProduct(req.params).then(resultFromController => res.send(resultFromController));
	}
);


/*-------Update Specific Product - ADMIN ONLY-------*/
router.put("/:productId", auth.verifyToken, (req,res) => {
	const updateData = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		updatedProduct: req.body
	}

	productController.updateProduct(updateData).then(resultFromController => res.send(resultFromController));
}
);


/*-------Archive Specific Product - ADMIN ONLY-------*/
router.put("/:productId/archive", auth.verifyToken, (req,res) => {
	const archiveData = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,	
	}

	if (archiveData.isAdmin == true) {
		productController.archiveProduct(archiveData).then(resultFromController => res.send(resultFromController));
	} else {
	 	res.send ("You must be an Admin to be able to archive a product.");
	 }
}
);


/*-------Unarchive Specific Product - ADMIN ONLY-------*/
router.put("/:productId/unarchive", auth.verifyToken, (req,res) => {
	const unarchiveData = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,	
	}

	if (unarchiveData.isAdmin == true) {
		productController.unarchiveProduct(unarchiveData).then(resultFromController => res.send(resultFromController));
	} else {
	 	res.send ("You must be an Admin to be able to unarchive a product.");
	 }
}
);







module.exports = router;