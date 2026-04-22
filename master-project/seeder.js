import dotenv from 'dotenv';
import conectToMongoDB from './config/db.js';
import Genre from './models/genre.js';
import Movie from './models/movie.js';

dotenv.config();

const genresData = [
  { name: 'Action' },
  { name: 'Drama' },
  { name: 'Sci-Fi' },
  { name: 'Comedy' },
  { name: 'Horror' },
];

const moviesData = [
  {
    title: 'Echo Frontier',
    description: 'A rogue pilot uncovers a hidden colony on the edge of space.',
    releaseDate: '2021-11-02',
    price: 6.99,
    genre: 'Sci-Fi',
  },
  {
    title: 'Nightfall Protocol',
    description: 'An elite agent must prevent a high-tech blackout in a city of shadows.',
    releaseDate: '2022-05-14',
    price: 8.49,
    genre: 'Action',
  },
  {
    title: 'Silent Harbor',
    description: 'A small fishing town hides a family secret under its calm waters.',
    releaseDate: '2020-09-22',
    price: 5.99,
    genre: 'Drama',
  },
  {
    title: 'Neon Courier',
    description: 'A courier races through a futuristic megacity to deliver a stolen chip.',
    releaseDate: '2023-04-28',
    price: 7.99,
    genre: 'Action',
  },
  {
    title: 'Harvest Moon',
    description: 'Neighbors come together during a rare harvest to heal old wounds.',
    releaseDate: '2019-10-10',
    price: 4.99,
    genre: 'Drama',
  },
  {
    title: 'Lunar Reckoning',
    description: 'Astronauts face a deadly anomaly while orbiting the moon.',
    releaseDate: '2024-01-05',
    price: 9.49,
    genre: 'Sci-Fi',
  },
  {
    title: 'Crimson Orchard',
    description: 'A haunted orchard traps a group of friends during a stormy night.',
    releaseDate: '2021-08-16',
    price: 5.49,
    genre: 'Horror',
  },
  {
    title: 'Velvet Countdown',
    description: 'A suspenseful heist goes wrong when the timer begins to run out.',
    releaseDate: '2022-02-18',
    price: 8.29,
    genre: 'Action',
  },
  {
    title: 'Solar Requiem',
    description: 'Scientists must survive after the sun flares disrupt reality.',
    releaseDate: '2023-07-12',
    price: 8.99,
    genre: 'Sci-Fi',
  },
  {
    title: 'Midnight Overture',
    description: 'A musician returns home to rebuild his life after a public fall.',
    releaseDate: '2020-12-01',
    price: 5.99,
    genre: 'Drama',
  },
  {
    title: 'Phantom Harbor',
    description: 'A journalist investigates strange disappearances at a coastal marina.',
    releaseDate: '2021-10-31',
    price: 6.49,
    genre: 'Horror',
  },
  {
    title: 'Quantum Rift',
    description: 'Time fractures threaten to erase a scientist and her discoveries.',
    releaseDate: '2024-03-08',
    price: 9.99,
    genre: 'Sci-Fi',
  },
  {
    title: 'Riot Brigade',
    description: 'An underdog squad rises to stop a violent uprising in the city.',
    releaseDate: '2022-06-20',
    price: 7.49,
    genre: 'Action',
  },
  {
    title: 'Ember Street',
    description: 'A restless neighborhood erupts when an old factory secrets are exposed.',
    releaseDate: '2019-11-05',
    price: 5.29,
    genre: 'Horror',
  },
  {
    title: 'Carnival Kings',
    description: 'A group of friends chase laughs and trouble at a traveling carnival.',
    releaseDate: '2023-08-25',
    price: 4.79,
    genre: 'Comedy',
  },
  {
    title: 'Paper Stars',
    description: 'A young writer rediscovers hope while chasing childhood dreams.',
    releaseDate: '2021-03-11',
    price: 5.99,
    genre: 'Drama',
  },
  {
    title: 'Rogue Circuit',
    description: 'A hacker races against time to stop an AI uprising in the city grid.',
    releaseDate: '2022-09-09',
    price: 8.69,
    genre: 'Action',
  },
  {
    title: 'Dead Zone Diner',
    description: 'Stranded strangers face eerie events in an all-night roadside diner.',
    releaseDate: '2021-06-14',
    price: 6.19,
    genre: 'Horror',
  },
  {
    title: 'Avenue of Sparks',
    description: 'A detective hunts a serial arsonist on a dangerous city avenue.',
    releaseDate: '2020-04-04',
    price: 7.19,
    genre: 'Action',
  },
  {
    title: 'Summer Flicker',
    description: 'Three friends discover love and laughter during a summer road trip.',
    releaseDate: '2022-07-18',
    price: 4.99,
    genre: 'Comedy',
  },
];

const importData = async () => {
  try {
    await conectToMongoDB();
    await Movie.deleteMany();
    await Genre.deleteMany();

    const createdGenres = await Genre.insertMany(genresData);
    const genreMap = createdGenres.reduce((acc, genre) => {
      acc[genre.name] = genre._id;
      return acc;
    }, {});

    const movies = moviesData.map((movie) => ({
      ...movie,
      genre: genreMap[movie.genre],
    }));

    await Movie.insertMany(movies);
    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await conectToMongoDB();
    await Movie.deleteMany();
    await Genre.deleteMany();
    console.log('Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Usage: node seeder.js -i  (import) or node seeder.js -d  (destroy)');
  process.exit();
}
