/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import { Col, Row, Label, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import ReactSelect from 'react-select';
import { SELECT_PARAMETERS, db_collection } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: {},
      transactions: []
    };

    this.getUsers({});
  }

  getUsers(_query) {
    BaseAction.get(db_collection.users, { $skip: SELECT_PARAMETERS.skip, $limit: SELECT_PARAMETERS.limit, ..._query }).then((res) => {
      this.state.users = [];
      res.data.data.forEach((e, i) => {
        this.state.users.push({
          value: e._id,
          label: e.name,
          _id: e._id
        });
        this.setState({});
      });
    });
  }

  getUser(userId) {
    BaseAction.get(db_collection.users, { _id: userId }).then((res) => {
      if (res.data.data && res.data.data.length > 0) {
        this.state.user = res.data.data[0];
        this.setState({});
      }
    });
    BaseAction.get(db_collection.transactions, { userId: userId }).then((resTransactions) => {
      if (resTransactions.data.data) {
        this.state.transactions = resTransactions.data.data;
        this.setState({});
      }
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Label sm='2'>Select user: </Label>
          <Col sm='4'>
            <ReactSelect
              options={this.state.users}
              onInputChange={(value) => {
                setTimeout(() => {
                  this.getUsers({ $regex: JSON.stringify([{ "name": "name", "value": `.*${value}.*`, "$options": "$i" }]) });
                }, 500);
              }}
              onChange={(value) => {
                this.getUser(value._id);
              }}
            />
          </Col>
        </Row>
        <hr />
        {
          Object.keys(this.state.user).length > 0 &&
          <Row>
            <Col sm='4'>
              <Card>
                <CardBody>
                  <p className='text-center'><b>Information</b></p>
                  <table style={{ width: '100%' }}>
                    <tr>
                      <td>ID</td>
                      <td>: {this.state.user._id}</td>
                    </tr>
                    <tr>
                      <td>Name</td>
                      <td>: {this.state.user.name}</td>
                    </tr>
                    <tr>
                      <td>Account</td>
                      <td>: {this.state.user.account}</td>
                    </tr>
                    <tr>
                      <td>Role</td>
                      <td>: {this.state.user.role}</td>
                    </tr>
                    <tr>
                      <td>Number Plate</td>
                      <td>: {this.state.user.numberPlate}</td>
                    </tr>
                    <tr>
                      <td>Vehicle Type</td>
                      <td>: {this.state.user.vehicleType}</td>
                    </tr>
                  </table>
                </CardBody>
              </Card>
            </Col>
            <Col sm='8'>
              <h5 className='text-center'><b>List transaction</b></h5>
              <ListGroup>
                {
                  this.state.transactions.map((e, i) => <ListGroupItem key={i}>
                    <Row>
                      <Col sm='4'>{Utils.convertTime(e.createdAt)}</Col>
                      <Col sm='2'>{e.money}</Col>
                      <Col sm='6'>{e.description}</Col>
                    </Row>
                  </ListGroupItem>
                  )
                }
              </ListGroup>
            </Col>
          </Row>
        }
      </div>
    );
  }
}

export default Transaction;