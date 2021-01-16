/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import { Col, Row, Label, Button, Card, CardBody } from 'reactstrap';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import ReactSelect from 'react-select';
import { SELECT_PARAMETERS, db_collection, ROLES } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';
import CIcon from '@coreui/icons-react';

class CardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      device: {},
      company: {},
      companies: [],
      pages: 1,
      pageSize: 5,
      total: 0,
      filteredRegex: {},
      listCards: []
    };

    if (!Utils.showElementRole([ROLES.manager, ROLES.user]))
      this.getDevices({});
    else
      this.getCompanies({});

    this.createCardInDevice = this.createCardInDevice.bind(this);
    this.createRandomCard = this.createRandomCard.bind(this);
    this.deleteCardInDevice = this.deleteCardInDevice.bind(this);
  }

  getTotal(_query) {
    BaseAction.getTotal(db_collection.devices, { ..._query, ...this.state.filteredRegex }).then((res) => {
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

  getDevices(_query) {
    if (!Utils.showElementRole([ROLES.manager, ROLES.user]))
      _query.companyId = Utils.getItemCookie('companyId');
    BaseAction.get(db_collection.devices, { ..._query, ...this.state.filteredRegex }).then((res) => {
      this.state.devices = [];
      if (res.data.data) {
        this.state.devices = res.data.data;
        this.setState({});
        this.getTotal({ companyId: this.state.company.value });
      }
    });
  }

  getListCards(device) {
    this.state.listCards = [];
    BaseAction.get(db_collection.cards, { deviceId: device._id }).then((res) => {
      if (res.data.data) {
        res.data.data.map((e, i) => {
          this.state.listCards.push(e.name)
        });
        this.state.device = device;
        this.setState({});
      }
    })
  }

  createCardInDevice() {
    var nameCard = prompt("Please enter your card Id", Date.now());
    if (nameCard == null) return;
    if (this.state.device._id) {
      if (!this.state.listCards) this.state.listCards = [];
      this.state.listCards.push(`${nameCard}`);
      this.setState({});
      BaseAction.post(db_collection.cards, { name: nameCard, deviceId: this.state.device._id })
        .then((data) => {
          if (data) {
            BaseAction.put(db_collection.devices, {
              _id: this.state.device._id,
              cardIds: this.state.listCards
            }).then((res) => {
              // alert('Create new OK');
            });
          }
        });
      return;
    }
    alert('You must to select Device');
  }

  createRandomCard() {
    if (this.state.device._id) {
      if (!this.state.listCards) this.state.listCards = [];
      var cardNew = Date.now();
      this.state.listCards.push(`${cardNew}`);
      this.setState({});
      BaseAction.post(db_collection.cards, { name: cardNew, deviceId: this.state.device._id })
        .then((data) => {
          if (data) {
            BaseAction.put(db_collection.devices, {
              _id: this.state.device._id,
              cardIds: this.state.listCards
            }).then((res) => {
              // alert('Create new OK');
            });
          }
        });
      return;
    }
    alert('You must to select Device');
  }

  deleteCardInDevice(nameCard) {
    this.state.listCards = this.state.listCards.filter(e => e != nameCard);
    BaseAction.get(db_collection.cards, { name: nameCard }).then((resCard) => {
      if (!resCard.data.total) {
        return;
      }
      var id = resCard.data.data[0]._id;
      BaseAction.delete(db_collection.cards, id)
        .then((data) => {
          if (data) {
            BaseAction.put(db_collection.devices, {
              _id: this.state.device._id,
              cardIds: this.state.listCards
            }).then((res) => {
              // alert('Remove card success');
            });
          }
        });
    })

    this.setState({});
  }

  render() {
    const columns = [
      {
        Header: 'Device of company',
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
            <Button color='link' onClick={() => this.getListCards(row.original)}>{row.original.name}</Button>
          </div>
        },
      }
    ]

    return (
      <div>
        {
          Utils.showElementRole([ROLES.manager, ROLES.user]) &&
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
                    this.getDevices({ companyId: this.state.company.value, $limit: this.state.pageSize });
                  } else {
                    alert('You must choose company!');
                  }
                }}>
                Search
            </Button>
            </Col>
          </Row>
        }
        {Utils.showElementRole([ROLES.manager, ROLES.user]) && <hr />}
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
              data={this.state.devices}
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
                this.getDevices({ companyId: this.state.company.value, $skip: valueState.page * valueState.pageSize, $limit: valueState.pageSize });
              }}
            />
          </Col>
          <Col sm='9'>
            <Row>
              <Col>
                <h5>List Card assigned in Device</h5>
              </Col>
              <Col className='text-right'>
                <Button onClick={this.createCardInDevice} color='info'>Create Card</Button> {' '}
                <Button onClick={this.createRandomCard}>Create Random Card</Button>
              </Col>
            </Row>
            <br />
            {
              this.state.listCards.map((e, i) => <div key={i}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col>{e}</Col>
                      <Col className='text-right'>
                        <Button color='link' onClick={() => this.deleteCardInDevice(e)}>
                          <CIcon name="cil-trash" />
                        </Button>
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

export default CardPage;