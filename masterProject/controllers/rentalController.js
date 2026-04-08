import Movie from '../models/movie.js';
import Rental from '../models/rental.js';

export const rentMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId } = req.user;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: `Movie with id ${movieId} not found` });
        }

        const existingRental = await Rental.findOne({ user: userId, movie: movieId, status: "rented" });
        if (existingRental) {
            return res.status(400).json({ error: "You have already rented this movie" });
        }

        const rental = new Rental({
            user: userId,
            movie: movieId,
            rentalPrice: movie.price,
        });
        const result = await rental.save();
        res.status(201).json({ message: "Movie rented successfully", result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyRentals = async (req, res) => {
    try {
        const { userId } = req.user;
        const rentals = await Rental.find({ user: userId })
            .populate({ path: 'movie', select: 'title price' })
            .sort({ createdAt: -1 });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
