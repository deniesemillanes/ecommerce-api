const bcrypt = require("bcrypt");
const auth = require("../auth");
const Product = require("../models/Product");
const User = require("../models/User");

/*-------Create New Product - ADMIN ONLY-------*/
module.exports.newProduct = (reqBody) => {
	return Product.findOne({name: reqBody.name}).then(result => {
			if(result != null) {
				return {
					"productAlreadyCreated":`The product you are adding is already in the database.
						Product Id is ${result.id}.`
				}
			} else {
				let newProduct = new Product (
				  	{
						name: reqBody.name,
					    author: reqBody.author,
					    publishedOn: reqBody.publishedOn,							
						description: reqBody.description,
						price: reqBody.price,
						stocks: reqBody.stocks,
						imageURL: reqBody.imageURL,
				  	}
				)
				return newProduct.save().then((product, error) => {
			 		if(error) {
			  			return {
			  				"creatingProductError": `There is an error in saving/creating a product 
			  					${error}.`
			  			}
			 		} else {
							return product	
			 		}
				}
				)
			}
	}
	)
}


/*-------Get All Products - ADMIN ONLY-------*/
module.exports.allProducts = () => {
	return Product.find().then(result => {
			return result
	}
	)
}


/*-------Get All Active Products-------*/
module.exports.getAllActiveProducts = () => {
	return Product.find({isActive: true}).then(result => {
		// return `There are a total of ${result.length} available product/products.

		// Product/products available is/are the following:
		// 	${result}`
		return result
	}
	)
}


/*-------Get Specific Product-------*/
module.exports.getProduct = (reqParams) => {
	return Product.findById(reqParams.productId).then(result => {
		return  result
	}
	)
}
 

/*-------Update Specific Product - ADMIN ONLY-------*/
module.exports.updateProduct = (updateData) => {
	return Product.findById(updateData.productId).then((result,error) => {
		if (updateData.isAdmin == true) {
			result.name = updateData.updatedProduct.name,
			result.author = updateData.updatedProduct.author,
			result.publishedOn = updateData.updatedProduct.publishedOn,				
			result.description= updateData.updatedProduct.description,
			result.price = updateData.updatedProduct.price,
			result.stocks = updateData.updatedProduct.stocks,
			result.imageURL = updateData.updatedProduct.imageURL

			return result.save().then((updatedProduct,error) => {
				if (error) {
					return `There is an error in saving the updated data in the database 
						${error}`
				} else {
					return `Successfully updated data for product ${updateData.productId} is:
						${updatedProduct}`
				}
			}
			) 
		} else {
			return "You must be logged in as an Admin to update this course."
		}
	}
	)
};


/*-------Archive Specific Product - ADMIN ONLY-------*/
module.exports.archiveProduct = (archiveData) => {
	return Product.findById(archiveData.productId).then(result => {
		console.log(result)
		if(result.isActive == true) {
			result.isActive = false 

		return result.save().then((archivedProduct, error) => {
				if (error) {
					return {
						"archiveError":`There is an error in archiving the data in the database 
						${error}`
					}
				} else {
					return {
						"archivedProduct":`Course Id ${archiveData.productId} named ${result.name} is now on product archives.`
					}
				}
			}
			)
		} else {
			return {
				"alreadyInArchives": "The product is currently inactive"
			}
		}
	}
	)
};


/*-------Unarchive Specific Product - ADMIN ONLY-------*/
module.exports.unarchiveProduct = (unarchiveData) => {
	return Product.findById(unarchiveData.productId).then(result => {
		if(result.isActive == false) {
			result.isActive = true 

		return result.save().then((unarchivedProduct, error) => {
					if (error) {
						return {"unarchiveError":`There is an error in unarchiving the data in the database 
							${error}`}
					} else {
						return {"unarchivedProduct":`Course Id ${unarchiveData.productId} named ${result.name} is now Active`}
					}
				}
			)
		} else {
			return {
				"alreadyActive": "The product is currently Active"
			}
		}
	}
	)
};







