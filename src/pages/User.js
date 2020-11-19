/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import SelectFilterer from '../components/Table/Filterer/SelectFilterer';
import { Row, Col, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CIcon from '@coreui/icons-react';
import ReactSelect from 'react-select';
import { VEHICLETYPES, ROLES, SELECT_PARAMETERS, db_collection } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isCard: false,
      typeSubmit: 0, // 0: none, 1 : create, 2: edit
      valueTemp: {}, // role
      data: [],
      pages: 1,
      pageSize: 10,
      total: 0,
      filteredRegex: {},
      companies: [],
      device: {},
      devices: [],
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };

    this.get({ $limit: this.state.pageSize });
    this.getCompany({});

    this.toggle = this.toggle.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
    this.submit = this.submit.bind(this);
    this.changeText = this.changeText.bind(this);
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

  getCompany(_query) {
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

  get(_query) {
    if (!Utils.showElementRole([ROLES.manager]))
      _query.companyId = Utils.getItemCookie('companyId');
    BaseAction.get(db_collection.users, { ..._query, ...this.state.filteredRegex })
      .then((res) => {
        if (res.data.errorMessage) {
          alert('Something wrong!');
          return;
        }
        if (res.data.data) {
          this.state.data = res.data.data;
          this.setState({});
        }
      });
    this.getTotal({});
  }

  post(_body) {
    BaseAction.post(db_collection.users, _body)
      .then((res) => {
        if (res.data.errorMessage) {
          alert(`${res.data.errorName}: ${res.data.errorMessage}`);
          return;
        }
        if (res.data.data) {
          alert('Create new success!');
          this.toggle();
          this.get({});
        }
      });
  }

  put(_body) {
    BaseAction.put(db_collection.users, _body)
      .then((res) => {
        if (res.data.errorMessage) {
          alert(`${res.data.errorName}: ${res.data.errorMessage}`);
          return;
        }
        if (res.data.data) {
          alert('Edit item success!');
          this.toggle();
          this.get({});
        }
      });
  }

  delete(id) {
    var conf = window.confirm('Are you sure?');
    if (!conf)
      return;

    if (id) {
      BaseAction.delete(db_collection.users, id)
        .then((res) => {
          if (res.data.errorMessage) {
            alert(`${res.data.errorName}: ${res.data.errorMessage}`);
            return;
          }
          if (res.data.data) {
            alert('Delete item success!');
            this.get({});
          }
        })
    } else {
      alert('Something wrong!');
    }
  }

  submit() {
    var conf = window.confirm('Are you sure?');
    if (!conf)
      return;

    // validate json array cardIds
    var textCardIds = document.getElementById("textCardIds").value;
    if (textCardIds.length > 0) {
      this.state.valueTemp.cardIds = Utils.convertStringListToArray(textCardIds);
    }
    else {
      this.state.valueTemp.cardIds = [];
    }

    if (this.state.typeSubmit === 1) {
      this.post(this.state.valueTemp); // create new item
      return;
    }
    if (this.state.typeSubmit === 2) {
      this.put(this.state.valueTemp); // edit item
      return;
    }
  }

  toggleCreate() {
    this.state.isOpen = true;
    this.state.typeSubmit = 1;
    this.setState({});
  }

  toggleEdit(user) {
    this.state.isOpen = true;
    this.state.typeSubmit = 2;
    this.state.valueTemp = user;
    this.setState({});
  }

  toggleCard(user) {
    this.state.isCard = true;
    this.state.valueTemp = user;
    BaseAction.get(db_collection.devices, { companyId: user.companyId })
      .then((res) => {
        if (res.data.total) {
          this.state.devices = [];
          res.data.data.forEach((e, i) => {
            this.state.devices.push({
              value: e._id,
              label: e.name,
              _id: e._id
            });
          })
          this.setState({});
        }
      })
    this.setState({});
  }

  toggle() {
    this.state.isOpen = false;
    this.state.isCard = false;
    this.state.typeSubmit = 0;
    this.state.valueTemp = {};
    this.state.devices = [];
    this.state.device = {};
    this.setState({});
  }

  changeText(event) {
    switch (event.target.name) {
      case 'account':
        this.state.valueTemp.account = event.target.value;
        break;
      case 'password':
        this.state.valueTemp.password = event.target.value;
        break;
      case 'name':
        this.state.valueTemp.name = event.target.value;
        break;
      case 'cmt':
        this.state.valueTemp.cmt = event.target.value;
        break;
      case 'phone':
        this.state.valueTemp.phone = event.target.value;
        break;
      case 'email':
        this.state.valueTemp.email = event.target.value;
        break;
      case 'numberPlate':
        this.state.valueTemp.numberPlate = event.target.value;
        break;
      case 'vehicleColor':
        this.state.valueTemp.vehicleColor = event.target.value;
        break;
      case 'vehicleBranch':
        this.state.valueTemp.vehicleBranch = event.target.value;
        break;
      case 'vehicleType':
        this.state.valueTemp.vehicleType = event.target.value;
        break;
      case 'role':
        this.state.valueTemp.role = event.target.value;
        break;
      case 'description':
        this.state.valueTemp.description = event.target.value;
        break;
      default:
        break;

    }
    this.setState({});
  }

  render() {
    const options = [{ value: 'all', name: 'all', key: 'all' }]

    Object.keys(ROLES).forEach(item => {
      options.push({
        value: ROLES[item],
        name: ROLES[item],
        key: ROLES[item]
      })
    })
    const columns = [
      {
        Header: 'STT',
        id: 'stt',
        width: 50,
        Cell: ({ index }) => index + 1,
        filterable: false,
        style: {
          textAlign: 'center'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        Filter: ({ filter, onChange }) => (
          <TextFilterer
            filter={filter}
            onChange={onChange}
            defaultValue=""
            convertString={(value1) => ({ $regex: `.*${value1}.*` })}
          />
        )
      },
      {
        Header: 'Account',
        accessor: 'account',
        Filter: ({ filter, onChange }) => (
          <TextFilterer
            filter={filter}
            onChange={onChange}
            defaultValue=""
            convertString={(value1) => ({ $regex: `.*${value1}.*` })}
          />
        )
      },
      {
        Header: 'Role',
        accessor: 'role',
        Filter: ({ filter, onChange }) => {
          return (
            <SelectFilterer
              filter={filter}
              onChange={onChange}
              options={options}
              defaultValue="all"
            />
          )
        }
      },
      {
        Header: 'Number Plate',
        accessor: 'numberPlate',
        Filter: ({ filter, onChange }) => (
          <TextFilterer
            filter={filter}
            onChange={onChange}
            defaultValue=""
            convertString={(value1) => ({ $regex: `.*${value1}.*` })}
          />
        )
      },
      {
        Header: 'Description',
        accessor: 'description',
        filterable: false,
      },
      {
        Header: 'Option',
        id: 'option',
        width: 150,
        filterable: false,
        Cell: (row) => {
          return <div>
            <Button color='link' onClick={() => this.toggleCard(row.original)}><CIcon name="cil-layers" /></Button>
            <Button color='link' onClick={() => this.toggleEdit(row.original)}><CIcon name="cil-pencil" /></Button>
            <Button color='link' onClick={() => this.delete(row.original._id)}><CIcon name="cil-trash" /></Button>
          </div>
        }
      }
    ];

    return (
      <div>
        <Row>
          <Button color='success' onClick={this.toggleCreate}>+ Create new user</Button>
        </Row>
        <br />
        <Row>
          <Table
            style={{ width: '100%' }}
            filterable={true}
            manual
            pages={this.state.pages}
            columns={columns}
            data={this.state.data}
            pageSizeOptions={[10, 25, 50, 75, 100]}
            defaultPageSize={this.state.pageSize}
            onFetchData={(valueState) => {
              this.state.filteredRegex = {};
              var _regex_arr = [];
              valueState.filtered.forEach((e, i) => {
                if (e.value) {
                  if (e.value['$valueTmp'])
                    _regex_arr.push({ "name": e.id, "value": `.*${e.value['$valueTmp']}.*`, "$options": "$i" });
                  else
                    _regex_arr.push({ "name": e.id, "value": `.*${e.value}.*`, "$options": "$i" });
                }
              })
              this.setState({
                pageSize: valueState.pageSize,
              })
              this.state.filteredRegex = { $regex: JSON.stringify(_regex_arr) }
              this.get({ $skip: valueState.page * valueState.pageSize, $limit: valueState.pageSize });
            }}
          />
        </Row>
        <Modal isOpen={this.state.isOpen} toggle={this.isOpen} size='lg'>
          <ModalHeader>{this.state.typeSubmit === 1 ? 'Create new user' : 'Edit item'}</ModalHeader>
          <ModalBody>
            <table style={{ width: '100%' }}>
              <tr>
                <td>Account</td>
                <td>
                  <Input name='account' value={this.state.valueTemp.account} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Password</td>
                <td>
                  <Input type='password' name='password' value={this.state.valueTemp.password} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Name</td>
                <td>
                  <Input name='name' value={this.state.valueTemp.name} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Company</td>
                <td>
                  <ReactSelect
                    options={this.state.companies}
                    onInputChange={(value) => {
                      setTimeout(() => {
                        this.getCompany({ $regex: JSON.stringify([{ "name": "name", "value": `.*${value}.*`, "$options": "$i" }]) });
                      }, 500);
                    }}
                    onChange={(value) => {
                      this.state.valueTemp.companyId = value.value; // _id
                    }}
                  />
                  <p>{this.state.valueTemp.companyId}</p>
                </td>
              </tr>
              <br />
              <tr>
                <td>CMT</td>
                <td>
                  <Input name='cmt' value={this.state.valueTemp.cmt} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Phone</td>
                <td>
                  <Input name='phone' value={this.state.valueTemp.phone} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Email</td>
                <td>
                  <Input name='email' value={this.state.valueTemp.email} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Number Plate</td>
                <td>
                  <Input name='numberPlate' value={this.state.valueTemp.numberPlate} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Vehicle Color</td>
                <td>
                  <Input name='vehicleColor' value={this.state.valueTemp.vehicleColor} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Vehicle Branch</td>
                <td>
                  <Input name='vehicleBranch' value={this.state.valueTemp.vehicleBranch} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Vehicle Type</td>
                <td>
                  <Input type='select' name='vehicleType' value={this.state.valueTemp.vehicleType} onChange={this.changeText} >
                    {
                      Object.keys(VEHICLETYPES).map((e, i) => <option key={e}>{e}</option>)
                    }
                  </Input>
                </td>
                <td>&ensp;</td>
                <td>Role</td>
                <td>
                  <Input type='select' name='role' value={this.state.valueTemp.role} onChange={this.changeText} >
                    {
                      Object.keys(Utils.selectRole()).map((e, i) => <option key={e}>{e}</option>)
                    }
                  </Input>
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <Input type='textarea' name='description' value={this.state.valueTemp.description} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Card Ids</td>
                <td>
                  <Input type='text' name='cardIds' id="textCardIds" defaultValue={this.state.valueTemp.cardIds && Utils.convertArrayToStringList(this.state.valueTemp.cardIds)} autoComplete='off' />
                </td>
              </tr>
            </table>

          </ModalBody>
          <ModalFooter>
            <div className='text-right'>
              <Button color='success' onClick={this.submit}>{this.state.typeSubmit === 1 ? 'Create' : 'Edit'}</Button>&emsp;
              <Button color='secondary' onClick={this.toggle}>Cancel</Button>
            </div>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isCard} toggle={this.isCard} size='lg'>
          <ModalHeader>Manage card with device</ModalHeader>
          <ModalBody>
            <Row>
              <table style={{ width: '100%' }}>
                <tr>
                  <td style={{ width: '5%' }}></td>
                  <td style={{ width: '40%' }}>You can select device in company: </td>
                  <td style={{ width: '50%' }}>
                    <ReactSelect
                      options={this.state.devices}
                      onChange={(value) => {
                        this.state.device = this.state.devices.find(e => e._id === value._id);
                        if (this.state.device._id && this.state.valueTemp.devicesAccess && this.state.valueTemp.devicesAccess[this.state.device._id]) {
                          this.state.valueTemp.devicesAccess[this.state.device._id].forEach((e, i) => {
                            Utils.convertDateTimeInput(`fromDate${i}`, e.dateTimeFrom);
                            Utils.convertDateTimeInput(`toDate${i}`, e.dateTimeTo);
                          });
                        }
                        else {
                          this.state.dayOfWeek.forEach((e, i) => {
                            Utils.convertDateTimeInput(`fromDate${i}`, '');
                            Utils.convertDateTimeInput(`toDate${i}`, '');
                          });
                        }
                        this.setState({});
                      }}
                    />
                  </td>
                  <td style={{ width: '5%' }}></td>
                </tr>
              </table>
            </Row>
            <br />
            <Row>
              <Col>
                <table style={{ width: '100%' }}>
                  {
                    this.state.dayOfWeek.map((e, i) =>
                      <tr key={i}>
                        <td>{e}</td>
                        <td>From:</td>
                        <td>
                          <Input type='time' id={`fromDate${i}`} />
                        </td>
                        <td>&emsp;</td>
                        <td>To:</td>
                        <td>
                          <Input type='time' id={`toDate${i}`} />
                        </td>
                      </tr>)
                  }
                  <tr></tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <Button color='info' onClick={() => {
                        if (this.state.device._id) {
                          if (!this.state.valueTemp.devicesAccess) this.state.valueTemp.devicesAccess = {};
                          if (!this.state.valueTemp.devicesAccess[this.state.device._id]) this.state.valueTemp.devicesAccess[this.state.device._id] = [];
                          this.state.valueTemp.devicesAccess[this.state.device._id] = [];
                          for (let i = 0; i < 7; i++) {
                            this.state.valueTemp.devicesAccess[this.state.device._id].push({
                              dateTimeFrom: Utils.convertDateTimeAccess(document.getElementById(`fromDate${i}`).value, true),
                              dateTimeTo: Utils.convertDateTimeAccess(document.getElementById(`toDate${i}`).value, false)
                            });
                          }
                          BaseAction.put(db_collection.users, this.state.valueTemp)
                            .then(res => {
                              if (res.data.errorMessage) {
                                alert('Something wrong!');
                              }
                              else {
                                alert('OK');
                                this.setState({});
                              }
                            });
                        }
                      }}>Confirm Access Device</Button>{' '}
                      {
                        this.state.device && this.state.valueTemp.devicesAccess && this.state.valueTemp.devicesAccess[this.state.device._id] &&
                        <Button color='danger' onClick={() => {
                          var devicesAccess = this.state.valueTemp.devicesAccess;
                          delete devicesAccess[this.state.device._id]
                          this.state.valueTemp.devicesAccess = devicesAccess;
                          BaseAction.put(db_collection.users, this.state.valueTemp)
                            .then(res => {
                              if (res.data.errorMessage) {
                                alert('Something wrong!');
                              }
                              else {
                                alert('OK');
                                this.setState({});
                              }
                            });
                        }}>Delete Access Device</Button>
                      }
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className='text-right'>
              <Button color='secondary' onClick={this.toggle}>Cancel</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>);
  }
}

export default User;