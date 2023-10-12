const mongoose = require("mongoose");


const userSchema = new mongoose.Schema (
	{
		firstName: {
			type: String,
			required: [true, "First Name can't be empty."]
		},
		lastName: {
			type: String,
			required: [true, "Last Name can't be empty."]			
		},
		email: {
			type: String,
			required: [true, "Email can't be empty."]			
		},
		password: {
			type: String,
			required: [true, "Password can't be empty."]			
		},
		isActive: {
			type: Boolean,
			default: true			
		},		
		isAdmin: {
			type: Boolean,
			default: false			
		},
		createdOn: {
			type: Date,
			default: new Date()
		},
		cart: [
			{
				productId: {
					type: String,
					required: [true, "Product Id can't be empty."]					
				},
				name: {
					type: String,
					required: [true, "Product Name is required."]
				},
				description: {
					type: String,
					required: [true, "Description is required."]
				},
				imageURL: {
					type: String,
					required: [true, "Image URL is required."]
				},								
				quantity: {
					type: Number	
				},
				price: {
					type: Number,
					required: [true, "Price is required."]
				}								
			}
		],
		orders: [
			{
				userId: {
					type: String,
					required: [true, "User id is required."]
				},				
				purchasedOn: {
					type: Date,
					default: new Date()
				},
				status: {
					type: String,
					default: "Purchased"
				},
				products: [
					{
						productId: {
							type: String,
							required: [true, "Product ID is required."]
						},			
						name: {
							type: String,
							required: [true, "Product Name is required."]
						},
						description: {
							type: String,
							required: [true, "Description is required."]
						},						
						imageURL: {
							type: String,
							required: [true, "Image URL is required."]
						},						
						quantity: {
							type: Number,
							required: [true, "Please input quantity."]
						},
						price: {
							type: Number,
							required: [true, "Price is required."]
						}
					}
				],
				totalAmount: {
					type: Number,
					required: [true, "Please compute total Price"]
				}
			}
		]
	}
)


module.exports = mongoose.model("User", userSchema);