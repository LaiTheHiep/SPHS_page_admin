import React from 'react';
import { Row, Col, Label, Input, Container, Button } from 'reactstrap';
import BaseAction from '../actions/BaseAction';
import { db_collection } from '../parameters/const_env';

class FeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendFeedBack = this.sendFeedBack.bind(this);
  }

  sendFeedBack() {
    BaseAction.post(db_collection.feedBacks, {
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      content: document.getElementById('feedback').value
    }).then((res) => {
      if (res.data.total) {
        alert('Thank you for send feedback');
        document.getElementById('email').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('feedback').value = '';
      } else {
        alert('Data error');
      }
    })
  }

  render() {
    return (
      <div>
        <Container>
          <h1>Please enter feedback:</h1>
          <Row>
            <Label sm='2'>Email:</Label>
            <Col sm='10'>
              <Input id='email' autoComplete='off' />
            </Col>
          </Row>
          <br />
          <Row>
            <Label sm='2'>Subject:</Label>
            <Col sm='10'>
              <Input id='subject' autoComplete='off' />
            </Col>
          </Row>
          <br />
          <Row>
            <Label sm='2'>Feedback:</Label>
            <Col sm='10'>
              <Input type='textarea' id='feedback' />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm='2'></Col>
            <Col sm='10'>
              <Button color='success' onClick={this.sendFeedBack}>Send</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default FeedBack;