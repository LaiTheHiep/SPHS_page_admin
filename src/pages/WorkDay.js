import React from 'react';
import { Col, Input, Row, Button, Card, CardBody } from 'reactstrap';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import ReactSelect from 'react-select';
import { LINK_SPECIALS, db_collection } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';

class WorkDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      deviceId: '',
      company: {},
      users: [],
      user: {},
      pages: 1,
      pageSize: 5,
      total: 0,
      filteredRegex: {},
      data: [],
    };

    this.getDevices();
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

  getUsers(_query) {
    _query.companyId = Utils.getItemCookie('companyId');
    BaseAction.get(db_collection.users, { ..._query, ...this.state.filteredRegex }).then((res) => {
      this.state.users = [];
      if (res.data.data) {
        this.state.users = res.data.data;
        this.setState({});
        this.getTotal({ companyId: this.state.company.value });
      }
    });
  }

  getDevices() {
    BaseAction.get(db_collection.devices, { companyId: Utils.getItemCookie('companyId') })
      .then(res => {
        if (res.data.total) {
          this.state.devices = [];
          res.data.data.forEach(e => {
            this.state.devices.push({
              value: e._id,
              label: e.name,
              _id: e._id
            })
          });
          this.setState({});
        }
      })

    // Get information company
    BaseAction.get(db_collection.companies, { _id: Utils.getItemCookie('companyId') })
      .then(res => {
        if (res.data.total) {
          this.state.company = res.data.data[0];
          this.setState({});
        }
      })
  }

  getWork(userId) {
    var dateStart = document.getElementById('dateStart').value;
    var dateEnd = document.getElementById('dateEnd').value;
    var timeCalculate = document.getElementById('timeCalculate').value;

    // check null
    if (!dateStart) {
      alert('You must select to date Start');
      return;
    }
    if (!dateEnd) {
      alert('You must select to date End');
      return;
    }
    let d1 = new Date(dateStart);
    let d2 = new Date(dateEnd);
    if (d2 - d1 <= 0) {
      alert('Date Start must less than Date End');
      return;
    }
    if (!timeCalculate) {
      timeCalculate = 0;
    }

    this.state.data = [];
    this.setState({});
    BaseAction.get(LINK_SPECIALS.workDay, {
      dateStart: dateStart,
      dateEnd: dateEnd,
      timeCalculate: timeCalculate,
      userId: userId,
      timeStart: this.state.company.timeStart,
      timeEnd: this.state.company.timeEnd
    }).then(res => {
      if (res.data.total) {
        this.state.data = res.data.data;
        this.setState({});
      }
    })

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
            <Button color='link' onClick={() => this.getWork(row.original._id)}>{row.original.name}</Button>
          </div>
        },
      }
    ]

    return (
      <div>
        <Row>
          <Col>Device in Company:</Col>
          <Col>
            <ReactSelect
              options={this.state.devices}
              onChange={(value) => {
                this.state.deviceId = value.value;
                this.setState({});
              }}
            />
          </Col>
          <Col>
            Time enable (+/-):
          </Col>
          <Col>
            <Input
              id='timeCalculate'
              type='number'
            />
          </Col>
          <Col>
            Time work of day:
          </Col>
          <Col>
            {this.state.company.timeStart} - {this.state.company.timeEnd}
          </Col>
        </Row>
        <br />
        <Row>
          <Col>Date Start:</Col>
          <Col>
            <Input type='date' id='dateStart' />
          </Col>
          <Col>Date End</Col>
          <Col>
            <Input type='date' id='dateEnd' />
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <br />
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
          <Col>
            {
              this.state.data.map((e, i) => {
                var start = new Date(e.start);
                var end = new Date(e.end);
                return <div key={i}>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col sm={1}><b>{i + 1}</b></Col>
                        <Col sm={3}>{e.date}</Col>
                        <Col sm={4}>{start.toLocaleString()}</Col>
                        <Col sm={4}>{end.toLocaleString()}</Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              })
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default WorkDay;