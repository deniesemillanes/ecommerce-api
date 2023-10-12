const mongoose = require("mongoose");
 

const productSchema = new mongoose.Schema (
	{
		name: {
			type: String,
			required: [true, "Book Title can't be empty."]			
		},
		author: {
			type: String,
			required: [true, "Author's Name can't be empty."]
		},
		publishedOn: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: [true, "Product Description can't be empty."]					
		},
		price: {
			type: Number,
			required: [true, "Product Price can't be empty."]					
		},
		stocks: {
			type: Number,
			required: [true, "Stock is required."]
		},
		imageURL: {
			type: String,
			required: [true, "Image URL is required."]
		},				
		isActive: {
			type: Boolean,
			default: true				
		},
		createdOn: {
			type: Date,
			default: new Date()	
		},
		order: [
			{
				userId: {
					type: String,
					required: [true, "Product Id can't be empty."]					
				},
				quantity: {
					type: Number	
				},
				purchasedOn: {
					type: Date,
					default: new Date()
				}				
			}
		]				
	}
)


module.exports = mongoose.model("Product", productSchema);