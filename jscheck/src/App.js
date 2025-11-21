import React from 'react'
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
 import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'
const App = () => {
  return (
    <React.Fragment> 
    <div className = 'App'>App
    <Card>
      <Card.Header>First Heading</Card.Header>
      <Card.Body>
        <Card.Title>First title </Card.Title>
        <Card.Text>
         Hier is our first card content.
        </Card.Text>
      </Card.Body>
    </Card>
     <Card>
      <Card.Header>Second Heading</Card.Header>
      <Card.Body>
        <Card.Title>Second title </Card.Title>
        <Card.Text>
           Hier is our second card content.
        </Card.Text>
      </Card.Body>
    </Card>
     <Card>
      <Card.Header>Third Heading</Card.Header>
      <Card.Body>
        <Card.Title>Third title </Card.Title>
        <Card.Text>
           Hier is our third card content.
        </Card.Text>
      </Card.Body>
    </Card>
</div>
</React.Fragment>
  )
}


export default App