const express = require("express");
const router = express.Router();
const auth = require("../auth");
const userController = require("../controllers/userControllers");

router.get("/register", (req,res) => {
	res.render("register")
}
)


/*-------Register-------*/
router.post("/register", (req,res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
	}
);


router.get("/login", (req,res) => {
		res.render("login")
	}
)


/*-------Log In-------*/
router.post("/login", (req,res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
	}
);

router.get("/login/success", (req,res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
	}
);


/*-------View User Profile -------*/
router.get("/details", auth.verifyToken, (req, res) => {
	const userData = auth.decodeToken(req.headers.authorization);
	console.log(userData);

	userController.userProfile({userId: userData.id}).then(resultFromController => res.send(resultFromController));
}
);


/*-------Get All Users - ADMIN ONLY ------*/
router.get("/all", auth.verifyToken, (req, res) => {
	const userData = auth.decodeToken(req.headers.authorization);
	console.log(userData);
	if (userData.isAdmin == true) {
		userController.allProfile({userId: userData.id}).then(resultFromController => res.send(resultFromController));
	} else {
		res.send ("You must be an Admin to be able to see all users");
	}
}
);


router.get("/setAsAdmin", (req,res) => {
		res.render("createAdmin")
	}
)


/*-------Set user as an admin - ADMIN ONLY ------*/
router.put("/:userId/setAsAdmin", auth.verifyToken, (req,res) => {
	const adminData = {
		userId: req.params.userId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,	
	}

	userController.setAsAdmin(adminData).then(resultFromController => res.send(resultFromController));
}
)


/*-------Set admin as a regular user - ADMIN ONLY ------*/
router.put("/:userId/deleteAdmin", auth.verifyToken, (req,res) => {
	const adminData = {
		userId: req.params.userId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,	
	}

	userController.deleteAdmin(adminData).then(resultFromController => res.send(resultFromController));
}
)


/*-------Add to Cart - Regular USER ONLY ------*/
router.post("/:productId/cart", auth.verifyToken, (req,res) => {
	const data = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id,	
		quantity: req.body.quantity
	}

	if (data.isAdmin == false) { 
		userController.addToCart(data).then(resultFromController => res.send(resultFromController));
	} else {
		res.send ("You must be a regular user to use the add to cart functionality");
	}
}
);


/*-------Get Total Amount Of Products - Regular USER ONLY ------*/
router.get("/total", auth.verifyToken, (req, res) => {
	const data = {
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id,	
	}

	if (data.isAdmin == false) { 
			userController.totalAmount(data).then(resultFromController => res.send(resultFromController))
	} else {
		res.send ("You must be a regular user to use the add to cart functionality");
	}				
}
)

/*-------View Products In Cart- Regular USER ONLY ------*/
router.get("/cart", auth.verifyToken, (req, res) => {
	const data = {
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id	
	}

	if (data.isAdmin == false) {
		userController.cart(data).then(resultFromController => res.send(resultFromController))
	} else {
		res.send ("You must be a regular user to use the add to cart functionality");
	}
}
)


/*-------Update Cart Products - Regular USER ONLY ------*/
router.put('/:productId/cart', auth.verifyToken, (req, res) => {
	const data = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id,	
		quantity: req.body.quantity
	}

	if (data.isAdmin == false) {
		userController.updateCart(data).then(resultFromController => res.send(resultFromController))
	} else {
		res.send ("You must be a regular user to use the add to cart functionality");
	}
}
)


/*-------Remove Specific Cart Product - Regular USER ONLY ------*/
router.delete('/:productId/cart', auth.verifyToken, (req, res) => {
	const data = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id,	
		quantity: req.body.quantity
	}

	if (data.isAdmin == false) {
		userController.removeFromCart(data).then(resultFromController => res.send(resultFromController))
	} else {
		res.send ("You must be a regular user to use the add to cart functionality");
	}
}
)


/*-------Remove All Product From Cart - Regular USER ONLY ------*/
router.delete('/cart', auth.verifyToken, (req, res) => {
	const data = {
		productId: req.params.productId,
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id,	
		quantity: req.body.quantity
	}

	if (data.isAdmin == false) {
			userController.removeAllFromCart(data).then(resultFromController => res.send(resultFromController))
	} else {
		res.send ("You must be a regular user to use the add to cart functionality");
	}
}
)


/*-------Checkout - Regular USER ONLY ------*/
router.post('/checkout', auth.verifyToken, (req, res) => {
	const data = {
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id
	}

	if (data.isAdmin == false) {
		userController.checkout(data).then(resultFromController => res.send(resultFromController))
	} else {
		res.send ("You must be a regular user to use the order functionality");
	}
}
)


/*-------View User Orders - Regular USER ONLY ------*/
router.get("/orders", auth.verifyToken, (req,res) => {
	const data = {
		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
		userId: auth.decodeToken(req.headers.authorization).id,
	}

	userController.orders(data).then(resultFromController => res.send(resultFromController));
}
)


// /*-------View All User Orders - ADMIN ONLY ------*/
// router.get("/orders/all", auth.verifyToken, (req,res) => {
// 	const data = {
// 		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
// 	}

// 	userController.allOrders(data).then(resultFromController => res.send(resultFromController));
// }
// )


// /*-------View Pending Order - Regular USER ONLY ------*/
// router.get('/orders/pending', auth.verifyToken, (req, res) => {
// 	const data = {
// 		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
// 		userId: auth.decodeToken(req.headers.authorization).id
// 	}

// 	if (data.isAdmin == false) {
// 		userController.pendingOrder(data).then(resultFromController => res.send(resultFromController))
// 	} else {
// 		res.send ("You must be a regular user to use the order functionality");
// 	}
// }
// )


/*-------View All Previous Order - Regular USER ONLY ------*/
// router.get('/orders', auth.verifyToken, (req, res) => {
// 	const data = {
// 		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
// 		userId: auth.decodeToken(req.headers.authorization).id
// 	}

// 	if (data.isAdmin == false) {
// 		userController.orders(data).then(resultFromController => res.send(resultFromController))
// 	} else {
// 		res.send ("You must be a regular user to use the order functionality");
// 	}
// }
// )

// router.get('/orders', auth.verifyToken, (req, res) => {
// 	const data = {
// 		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
// 		userId: auth.decodeToken(req.headers.authorization).id
// 	}

// 	userController.orders(data).then(resultFromController => res.send(resultFromController))
// })


// router.get("/orders", auth.verifyToken, (req, res) => {
// 	const data = {
// 		isAdmin: auth.decodeToken(req.headers.authorization).isAdmin,
// 		userId: auth.decodeToken(req.headers.authorization).id	
// 	}

// 	if (data.isAdmin == false) {
// 		userController.orders(data).then(resultFromController => res.send(resultFromController))
// 	} else {
// 		res.send ("You must be a regular user to use the add to cart functionality");
// 	} 
// }
// )
module.exports = router;
