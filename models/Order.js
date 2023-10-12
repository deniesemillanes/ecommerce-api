// const mongoose = require("mongoose");


// const orderSchema = new mongoose.Schema (
// 	{
// 		userId: {
// 			type: String,
// 			required: [true, "User Id is required to know whose order this belongs to."]
// 		},
// 		status: {
// 			type: String,
// 			default: "Purchased"
// 		},
// 		products: [
// 			{
// 				productId: {
// 					type: String,
// 					required: [true, "Product ID is required."]
// 				},			
// 				name: {
// 					type: String,
// 					required: [true, "Product Name is required."]
// 				},
// 				imageURL: {
// 					type: String,
// 					required: [true, "Image URL is required."]
// 				},						
// 				quantity: {
// 					type: Number,
// 					required: [true, "Please input quantity."]
// 				},
// 				price: {
// 					type: Number,
// 					required: [true, "Price is required."]
// 				}
// 			}
// 		],
// 		totalAmount: {
// 			type: Number,
// 		},
// 		purchasedOn: {
// 			type: Date,
// 			default: new Date()
// 		}
// 	}

// )


// module.exports = mongoose.model("Order", orderSchema);