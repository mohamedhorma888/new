import mongoose from 'mongoose';
import colors from 'colors';



async function conectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_CLOUD_URI);
        console.log(colors.green('welcome you are Connected to dbmasterproject'));
    } catch (err) {
        console.log(colors.red('we could not connect to dbmasterproject:' , err));
    }}

export default conectToMongoDB;