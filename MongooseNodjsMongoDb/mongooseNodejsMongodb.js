import mongoose from 'mongoose';
import colors from 'colors';


/*mongoose.connect('mongodb://localhost:27017/dbtest2')
.then(() => {console.log(colors.green('welcome you are Connected to MongoDB2'))})
.catch((err) => {console.log(colors.red('we could not connect to MongoDB2:', err))});

*/
async function conectToMongoDB() {
    try {
        await mongoose.connect('mongodb+srv://mauritanienneimportexport_db_user:O68VTNFC8ecr6kc6@cluster0.4mtiy27.mongodb.net/checkpoint');
        console.log(colors.green('welcome you are Connected to checkpoint'));
    } catch (err) {
        console.log(colors.red('we could not connect to checkpoint:', err));
    }}
conectToMongoDB();

const personSchema = new mongoose.Schema({
    name: String,
    age : Number,
    favoriteFoods: [String],
});
const Person = mongoose.model('Person', personSchema);
async function createPerson() {
 try{    const person = new Person({
        name: 'horma',
        age: 20,
        favoriteFoods: ['pizza', 'pasta']
    });
   const result =  await person.save();
    console.log(result);}
    catch (err) {
        console.log(colors.red('Error creating person:', err));
    }
}
createPerson();

async function createManyPersons() {
    try {
        const persons = await Person.create([
            { name: 'mostapha', age: 21, favoriteFoods: 'Pizza' },
            { name: 'peter', age: 22,  favoriteFoods: 'sanwitch' },
            { name: 'sara', age: 19, favoriteFoods: 'pasta' }
        ]);
        console.log('Created persons:', persons);
    } catch (err) {
        console.log(colors.red('Error creating persons:', err));
    }
}
createManyPersons(); 


async function createManyPeoples(arrayOfPeople) {
    try {
        const persons = await Person.create(arrayOfPeople);
        console.log('Created persons:', persons);
    } catch (err) {
        console.log(colors.red('Error creating persons:', err));
    }
}
async function findPeoplesByName(name) {
    try {
        const persons = await Person.find({ name });
        console.log('Found persons:', persons);
        return persons;
    } catch (err) {
        console.log(colors.red('Error finding persons:', err));
    }
}
    async function findOnePeoplesByName(By_id) {
    try {
        const persons = await Person.findOne({ _id: By_id });
        console.log('Found persons:', persons);
        return persons;
    } catch (err) {
        console.log(colors.red('Error finding persons:', err));
    }
}

async function findPersonById(personId) {
    try {
        const person = await Person.findById(personId);
        console.log('Found person:', person);
        return person;
    } catch (err) {
        console.log(colors.red('Error finding person:', err));
    }
}

async function findEditThenSave(personId) {
    try {
        const person = await Person.findById(personId);
        if (person) {
            person.favoriteFoods.push('hamburger');
            await person.save();
            console.log('Updated person:', person);
        } else {
            console.log('Person not found');
        }
    } catch (err) {
        console.log(colors.red('Error updating person:', err));
    }
}

async function removeById(personId) {
    try {
        const removedPerson = await Person.findByIdAndDelete(personId);
        console.log('Removed person:', removedPerson);
        return removedPerson;
    } catch (err) {
        console.log(colors.red('Error removing person:', err));
    }
}

async function removeByName(name) {
    try {
        const result = await Person.deleteMany({ name });
        console.log('Remove result:', result);
        return result;
    } catch (err) {
        console.log(colors.red('Error removing people:', err));
    }
}


const arrayOfPeople = [
    { name: 'horma', age: 24, favoriteFoods: 'pasta' },
    { name: 'ali', age: 22, favoriteFoods: 'sandwich' },
    { name: 'mohamed', age: 19,favoriteFoods: 'pizza' }
];

createManyPeoples(arrayOfPeople);
findPeoplesByName('horma');
findOnePeoplesByName('69bb4f0747f398630f98f594');
findPersonById('69bb4f0747f398630f98f594');
findEditThenSave('69bb4c2e7836e1d7a01a81cc');
removeById('69bb4c2e7836e1d7a01a81ca');
removeByName('mostapha') ;





