import Movie from "../models/movie.js";
import { validateUser } from "../utils/validate.js";

const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.log("error" , error);
    }
};
export { getAllMovies };

const createMovie = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const course = new Movie(req.body);
    const result = await course.save();
    res.json(result);
}
catch (error) {
    res.status(500).json({ message: error.message });
}
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(id,req.body, {new : true,});
        res.json(updatedMovie);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        await Movie.findByIdAndDelete(id);
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { createMovie, updateMovie, deleteMovie };


