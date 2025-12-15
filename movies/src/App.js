import React from 'react';
import ReactDOM from 'react-dom/client';
import MovieCard from './MovieCard';
import Description from './Description';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom"

function App() {
   
  return (
   <>
<h1>look please if any think ok </h1>

<Router>
<nav>
<Link to="/">MovieCard</Link>
</nav>


<Routes>

<Route path ="/" element={<MovieCard/>} />
  
</Routes>

   </Router>
   

  <MovieCard films= {[]} title = {['film1', 'film2', 'film3' ]} Description = {['This film is Amasing','This film is Cool','This film is good']}
   Rating = {[60,55,50]}/> 


   
  
   </>
  );
}
   
   
export default App;
