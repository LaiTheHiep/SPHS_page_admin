import React, { useState } from 'react';
import { Button } from 'reactstrap';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Button onClick={() => {
          localStorage.setItem('accessToken', '123456789');
        }}>Set token</Button>
        <Button onClick={() => {
          console.log(localStorage.getItem('accessToken'));
        }}>Get token</Button>
        <Button onClick={() => {
          localStorage.removeItem('accessToken');
        }}>Clear token</Button>
        <h3>Hello world</h3>
      </div>
    );
  }
}

export default Dashboard;