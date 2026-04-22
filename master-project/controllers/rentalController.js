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
            .populate({ path: 'movie', select: 'title price description' })
            .sort({ createdAt: -1 });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRental = async (req, res) => {
    try {
        const { rentalId } = req.params;
        const { userId } = req.user;
        const { status, dueDate } = req.body;

        const rental = await Rental.findOne({ _id: rentalId, user: userId });
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }

        if (status === 'returned' && rental.status === 'rented') {
            rental.status = 'returned';
            rental.dateReturned = new Date();
            await rental.save();
            res.status(200).json({ message: "Movie returned successfully", rental });
        } else if (dueDate && rental.status === 'rented') {
            rental.dueDate = new Date(dueDate);
            await rental.save();
            res.status(200).json({ message: "Rental due date updated successfully", rental });
        } else {
            res.status(400).json({ error: "Invalid update" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRental = async (req, res) => {
    try {
        const { rentalId } = req.params;
        const { userId } = req.user;

        const rental = await Rental.findOne({ _id: rentalId, user: userId });
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }

        if (rental.status === 'rented') {
            await Rental.findByIdAndDelete(rentalId);
            res.status(200).json({ message: "Rental cancelled successfully" });
        } else {
            res.status(400).json({ error: "Cannot delete returned rental" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
