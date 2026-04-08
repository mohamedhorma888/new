import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
    user : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movie : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    rentalDate: {
        type: Date,
        default: Date.now,
    },
    dueDate : {
        type: Date,
        default: function() {
            return new Date(Date.now() + 15*24*60*60*1000); // Default due date is 15 days from rental date
        },
    },
        datereturned: {
            type: Date,
            default: null,
        },
    
status: {
            type: String,
            enum : ['rented', 'returned'],
            default: 'rented',
        },
rentalPrice: {
            type: Number,
            default: 0,
        },

},
{timestamps: true,}
);


const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;

