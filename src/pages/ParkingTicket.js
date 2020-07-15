/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import { Col, Row, Label, Button, Card, CardBody } from 'reactstrap';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import ReactSelect from 'react-select';
import { SELECT_PARAMETERS, db_collection } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';

class ParkingTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: {},
      company: {},
      companies: [],
      pages: 1,
      pageSize: 5,
      total: 0,
      filteredRegex: {},
      parkingTickets: []
    };

    this.getCompanies({});
  }

  getTotal(_query) {
    BaseAction.getTotal(db_collection.users, { ..._query, ...this.state.filteredRegex }).then((res) => {
      if (res.data.total) {
        this.state.total = res.data.total;
        this.state.pages = Utils.getPage(res.data.total, this.state.pageSize);
        this.setState({});
      }
    })
  }

  getCompanies(_query) {
    BaseAction.get(db_collection.companies, { $skip: SELECT_PARAMETERS.skip, $limit: SELECT_PARAMETERS.limit, ..._query }).then((res) => {
      this.state.companies = [];
      res.data.data.forEach((e, i) => {
        this.state.companies.push({
          value: e._id,
          label: e.name,
          _id: e._id
        });
        this.setState({});
      });
    });
  }

  getUsers(_query) {
    BaseAction.get(db_collection.users, { ..._query, ...this.state.filteredRegex }).then((res) => {
      this.state.users = [];
      if (res.data.data) {
        this.state.users = res.data.data;
        this.setState({});
        this.getTotal({ companyId: this.state.company.value });
      }
    });
  }

  getParkingTickets(userId) {
    BaseAction.get(db_collection.packingTickets, { userId: userId }).then((res) => {
      this.state.parkingTickets = res.data.data;
      this.setState({});
    });
  }

  render() {
    const columns = [
      {
        Header: 'User of company',
        id: 'stt',
        Filter: ({ filter, onChange }) => (
          <TextFilterer
            filter={filter}
            onChange={onChange}
            defaultValue=""
            convertString={(value1) => ({ $regex: `.*${value1}` })}
          />
        ),
        Cell: (row) => {
          return <div>
            <Button color='link' onClick={() => this.getParkingTickets(row.original._id)}>{row.original.name}</Button>
          </div>
        },
      }
    ]

    return (
      <div>
        {/* <Button onClick={() => console.log(this.state)}>Test state</Button> */}
        <Row>
          <Label sm='2'>Select Company filter: </Label>
          <Col sm='4'>
            <ReactSelect
              options={this.state.companies}
              onInputChange={(value) => {
                setTimeout(() => {
                  this.getCompanies({ $regex: JSON.stringify([{ "name": "name", "value": `.*${value}.*`, "$options": "$i" }]) });
                }, 500);
              }}
              onChange={(value) => {
                this.state.company = value;
              }}
            />
          </Col>
          <Col>
            <Button
              color='success'
              onClick={() => {
                if (this.state.company.value) {
                  this.getUsers({ companyId: this.state.company.value, $limit: this.state.pageSize });
                } else {
                  alert('You must choose company!');
                }
              }}>
              Search
            </Button>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm='3'>
            <Table
              style={{ width: '100%' }}
              filterable={true}
              manual
              previousText='<<'
              nextText='>>'
              columns={columns}
              pages={this.state.pages}
              data={this.state.users}
              pageSizeOptions={[5, 10, 25, 50, 75, 100]}
              defaultPageSize={this.state.pageSize}
              onFetchData={(valueState) => {
                if (valueState.filtered[0]) {
                  this.state.filteredRegex = { $regex: JSON.stringify([{ "name": "name", "value": `.*${valueState.filtered[0].value['$valueTmp']}.*`, "$options": "$i" }]) };
                } else {
                  this.state.filteredRegex = {};
                }
                this.setState({
                  pageSize: valueState.pageSize
                })
                this.getUsers({ companyId: this.state.company.value, $skip: valueState.page * valueState.pageSize, $limit: valueState.pageSize });
              }}
            />
          </Col>
          <Col sm='9'>
            <h5>History</h5>
            {
              this.state.parkingTickets.map((e, i) => <div key={i}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm='2'><b>Port: </b>{e.port}</Col>
                      <Col sm='4'><b>Security: </b>{e.userId}</Col>
                      <Col sm='6'><b>Description: </b>{e.description}</Col>
                    </Row>
                    <Row className='text-center'>
                      <Col sm='6'>
                        <img
                          style={{ height: 200, width: 350, objectFit: 'contain', cursor: 'pointer' }} // 
                          src={e.imageIn}
                        />
                        <p>{Utils.convertTime(e.timeIn)}</p>
                      </Col>
                      <Col sm='6'>
                        <img
                          style={{ height: 200, width: 350, objectFit: 'contain', cursor: 'pointer' }}
                          src={e.imageOut}
                        />
                        <p>{Utils.convertTime(e.timeOut)}</p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default ParkingTicket;