import React from 'react'
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import players from './players';
const Player = () => {
  return (
    <div>
<players/>

<Card>
      <Card.Header className={players[1].name}>Featured Heading</Card.Header>
      <Card.Body>
        <Card.Title className={players}>Special title treatment</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>

</div>
  )
}

export default Player