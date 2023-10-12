const bcrypt = require("bcrypt");
const auth = require("../auth");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


/*-------Register-------*/
module.exports.registerUser = (reqBody) => {
	let newUser = new User (
		{
			firstName: reqBody.firstName,
			lastName: reqBody.lastName,
			email: reqBody.email,
			password: bcrypt.hashSync(reqBody.password,7)
		}
	)

	return User.find({email: reqBody.email}).then(result => {
		if(result.length>0) {
			return {"emailAlreadyUsed": "The email address provided is already registered."}
		} else {
				return newUser.save().then((user,error) => {
					if (error) {
						return {"registerError": "Error in registering a new user."}
					} else {
						return {"registerSuccess": `User ${reqBody.firstName} ${reqBody.lastName} created.`}
					}
				}
			)
		}
	}
	)
}


/*-------Log In-------*/
module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if (result == null) {
			return {"notRegistered": "Email address is not yet registered."}
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password)

			if (isPasswordCorrect == true && result.isAdmin) {
				return {"adminAccessToken": auth.createAccessToken(result)}
			} else if (isPasswordCorrect == true && result.isAdmin == false) {
				return {"userAccessToken": auth.createAccessToken(result)}			
			} else {
				return {"incorrectPassword": "Password is incorrect."}
			} 
		}
	}
	)
}

/*-------View User Profile -------*/
module.exports.userProfile = (data) => {
	return User.findById(data.userId).then(result => {
		// result.password = "";
		return result;
	}
	)
};

/*-------Get All Users - ADMIN ONLY ------*/
module.exports.allProfile = () => {
	return User.find().then(result => {
		return result;
	}
	)
};


/*-------Set user as an admin - ADMIN ONLY ------*/
module.exports.setAsAdmin = (adminData) => {
	return User.findById(adminData.userId).then((result,error) => {
	if (adminData.isAdmin == true) {
		if (error) {
			return `There is no user with this Id ${adminData.userId}`
		} else {
			if(result.isAdmin == false) {
			result.isAdmin = true;

				return result.save().then((newAd,error) => {
						if (error) {
							return `There is an error in saving the update.
							The error is: ${error}`
						} else {
							return `User ${newAd.firstName} ${newAd.lastName} is now an Admin.`
						}
					}
				)
			} else {
				return `The user you input is already an Admin.`
			}				
		}
	} else {
		return `You must logged in as an Admin to access this command. `
		}
	}
	)
}


/*-------Set admin as a regular user - ADMIN ONLY ------*/
module.exports.deleteAdmin = (adminData) => {
	return User.findById(adminData.userId).then((result,error) => {
	if (adminData.isAdmin == true) {
		if (error) {
			return `There is no user with this Id ${adminData.userId}`
		} else {
			if(result.isAdmin == true) {
			result.isAdmin = false;

				return result.save().then((newAd,error) => {
						if (error) {
							return `There is an error in saving the update.
							The error is: ${error}`
						} else {
							return `Admin ${newAd.firstName} ${newAd.lastName} is now a regular user.`
						}
					}
				)
			} else {
				return `The user you input is already a regular user.`
			}				
		}
	} else {
		return `You must logged in as an Admin to access this command. `
		}
	}
	)
}


/*-------Add to Cart - Regular USER ONLY ------*/
module.exports.addToCart = (data) => {
	let sameProductCount = 0;
	let element = 0;

	return Product.findById(data.productId).then(product => {
		//console.log(product.price)
		return User.findById(data.userId).then(user => {
			//console.log(user.cart.length)
			for(i=0; i < user.cart.length; i++) {
				if(user.cart[i].productId !== data.productId) {
					continue
				} else {
					sameProductCount++
					element = i
				}
			}

			if(sameProductCount>0) {
				user.cart[element].quantity += data.quantity;
				user.cart[element].price = product.price * user.cart[element].quantity;
				//product.price *= user.cart[element].quantity++
				// console.log("THIS")
				// console.log(product.price *= user.cart[element].quantity++)
				// console.log(user.cart[element].quantity++)
				// console.log(user.cart[element].price)
				// console.log(user);

				return user.save().then((result, error) => {
						if(error) {
							return false
						} else {
							return {product: `Product already exists. Quantity Added!`}
						}
				}
				)
			} else {
				user.cart.push(
					{
							productId: data.productId,
							name: product.name, 
							description: product.description,
							imageURL: product.imageURL, 
							quantity: data.quantity, 
							price: product.price * data.quantity, 				
					}
				)

				return user.save().then((result,error) => {
					if(error) {
						return false
					} else {
						return {
							"productAdded": `${data.userId} added product ${data.productId} to cart`
						}
					}
				}
				)
			}
		}
		)			
	}
	)
}	


/*-------Get Total Amount Of Products - Regular USER ONLY ------*/
module.exports.totalAmount = (data) => {
	let arrayPrices = [];

	return User.findById(data.userId).then(user => {
		if (user.cart.length > 0) {
			user.cart.map(product => arrayPrices.push(product.price))
			const totalAmount = arrayPrices.reduce((q1, q2) => q1 + q2)
			return { 
				"totalAmount": `${totalAmount}`
			}
		} else {
			return false
		}
	})
}


/*-------View Products In Cart- Regular USER ONLY ------*/
module.exports.cart = (data) => {
	return User.findById(data.userId).then(result => {
		if (result.cart.length < 0) {
			return {
				"noCart": `You currently have no products in your cart`
			}
		} else { 
			return result.cart
		}
	}
	)
}


/*-------Update Cart Products - Regular USER ONLY ------*/
module.exports.updateCart = (data) => {
	return User.findById(data.userId).then(user => {
		for(i = 0; i < user.cart.length; i++) {
			if (user.cart[i].productId === data.productId) {

				user.cart[i].quantity = data.quantity

				return user.save().then((result, error) => {
					if (error) {
						return false  
					} else {
						return {
							"updated": `The ${data.productId} is now updated`
						}
					}
				}
				)	
			}
		} 

	}
	)
}


/*-------Remove Specific Cart Product - Regular USER ONLY ------*/
module.exports.removeFromCart = (data) => {
	return User.findById(data.userId).then(user => {
		for(i = 0; i < user.cart.length; i++) {
			if (user.cart[i].productId === data.productId) {
				user.cart.splice(i, 1)

				return user.save().then((result, error) => {
					if (error) {
						return false  
					} else {
						return {
							"productRemoved": `The product ${data.productId} removed from cart`
						}
					}
				}
				)	
			}
		} 
	}
	)
}


/*-------Remove All Product From Cart - Regular USER ONLY ------*/
module.exports.removeAllFromCart = (data) => {
	return User.findById(data.userId).then(user => {
		user.cart.splice(0, user.cart.length)
		return user.save().then((result, error) => {
			if (error) {
				return false  
			} else {
				return true
			}
		}
		)	
	}
	)
}


/*-------Checkout - Regular USER ONLY ------*/
module.exports.checkout = async (data) => {
	
	let productId = [];
	let quantityProductId = [];
	let unitPriceProductId = [];
	let totalAmount = 0;
			 	
	
	let isProductUpdated = false;

	let isUserUpdated = await User.findById(data.userId).then(user => {

		if (user.cart.length > 0) {

			//Containing product ids of carted products
			for (i = 0; i < user.cart.length; i++) {
				productId.push(user.cart[i].productId)
				quantityProductId.push(user.cart[i].quantity)
				unitPriceProductId.push(user.cart[i].price)

				totalAmount += user.cart[i].price
			}

			let order = {
				userId: data.userId,
				products: user.cart,
				totalAmount: totalAmount
			}

			// let newOrder = new Order (
			// 	{
			// 		userId: data.userId,
			// 		productId: data.productId,
			// 		products: user.cart,
			// 		totalAmount: totalAmount				

			// 	}
			// )		
			
			// return newOrder.save().then((user,error) => {
			// 	//console.log(newOrder.productId)
			// 	//console.log(`user.productID: ${user.productId}`)
			// 	const orderArray = User.findById(user.userId);
			// // 	console.log(`orderArray: ${orderArray}`)
				
			// // 	// if (error) {
			// // 	// 	return "Error in ordering."
			// // 	// } else {
			// // 	// 	return `Successfully Ordered`
			// // 	// }
			// })

			user.orders.push(order)

			user.cart = []

			return user.save().then((result, error) => {
				if (error) {
					return false
				} else {
					return true
				}
			})

		} else {
			return {alert: `Empty cart`}
		}

	})

	for (i = 0; i < productId.length; i++) {

		let productUpdate = await Product.findById(productId[i]).then(product => {

			let customer = {
				userId: data.userId,
				quantity: quantityProductId[i]
			}


			product.order.push(customer)
			product.stocks -= customer.quantity

			if (product.stocks === 0) {
				product.isActive = false
			}
			
			return product.save().then((result, error) => {
				if (error) {
					return false
				} else {
					return {product: `Product Updated!`}
				}
			})
		})

		isProductUpdated = productUpdate
	}

	if (isUserUpdated !== false && isProductUpdated !==false) {
		return true
	} else {
		return false
	}
}


/*-------View All Orders - Regular USER ONLY ------*/
module.exports.orders = (data) => {
	return User.findById(data.userId).then(result => {
		if (result.orders.length <= 0) {
			return false
		} else { 
			return result.orders
		}
	})
}



// /*-------View Pending Order - Regular USER ONLY ------*/
// module.exports.pendingOrder = (data) => {
// 	return User.findById(data.userId).then(result => {

// 		let pendingOrderArray = [];

// 		if (result.orders.length < 0) {
// 			return {"noPendingOrder": "You have no pending orders"}
// 		} else {
// 			for (i = 0; i < result.orders.length; i++) {
// 				if (result.orders[i].status !== "Delivered") {
// 					pendingOrderArray.push(result.orders[i])
// 				}
// 			}
// 		}

// 		if (pendingOrderArray.length > 0) {
// 			return pendingOrderArray
// 		} else {
// 			return {alert: `There are no active orders.`}
// 		}

// 	})
// }



// module.exports.orders = (data) => {
// 	return User.findById(data.userId).then(result => {
// 		if (result.orders.length < 0) {
// 			return {
// 				"NoOrders": `You dont' have any pending nor previous order`
// 			}
// 		} else { 
// 			return result
// 		}
// 		// console.log(result)
// 	}
// 	)
// }

// module.exports.orders = (data) => {
// 	return User.findById(data.userId).then(result => {
// 		if (result.orders.length < 0) {
// 			return {
// 				"noCart": `You currently have no products in your cart`
// 			}
// 		} else { 
// 			return result.orders
// 		}
// 	}
// 	)
// }

// module.exports.orders = () => {
// 	return User.find().then(result => {
// 		// if (result.orders.length <= 0) {
// 		// 	return false
// 		// } else { 
// 		// 	return result.orders
// 		// }
// 		for (i = 0; i < result.length; i++) {
// 			return (result[i].orders)  
// 		}

		
		
// 	}
// 	)
// }