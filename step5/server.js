import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import colors from 'colors';
import conectToMongoDB from "./config/db.js";
import movieRoute from "./routes/movieRoute.js";
import genreRoute from "./routes/genreRoute.js";
import authRoutes from "./routes/authRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";

conectToMongoDB();
const app = express();
app.use(express.json());
app.use(express.static("frontend"));
app.use("/api/movies", movieRoute);
app.use("/api/genres", genreRoute);
app.use("/api/rentals", rentalRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoute);
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(colors.green(`Server is running on port ${PORT}`));
});


