const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 4072;

 
const app = express();


const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");


mongoose.connect("mongodb+srv://admin:admin123@cluster0.pjjaa.mongodb.net/!3rdCapstone?retryWrites=true&w=majority", 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);
let db = mongoose.connection;
db.on("error", () => console.error.bind(console,"Database Connection Error"));
db.once("open", () => console.log("Successfully Connected To The Database"));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/users", userRoutes);
app.use("/products", productRoutes);


app.use(express.static( "public" ) );
app.set("view engine", "ejs");

app.get("/", (req,res) => {
		res.render("index") 
	}
)



app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${process.env.PORT || port}`)
	}
)