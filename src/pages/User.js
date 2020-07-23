/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import SelectFilterer from '../components/Table/Filterer/SelectFilterer';
import { Row, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
      typeSubmit: 0, // 0: none, 1 : create, 2: edit
      valueTemp: {}, // role
      data: [],
      pages: 1,
      pageSize: 10,
      total: 0,
      filteredRegex: {},
      companies: [],
    };

    this.get({ $limit: this.state.pageSize });
    this.getCompany({});

    this.toggle = this.toggle.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
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
    if (Utils.getItemCookie('role') === ROLES.manager)
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

  toggleEdit(role) {
    this.state.isOpen = true;
    this.state.typeSubmit = 2;
    this.state.valueTemp = role;
    this.setState({});
  }

  toggle() {
    this.state.isOpen = false;
    this.state.typeSubmit = 0;
    this.state.valueTemp = {};
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
        width: 100,
        filterable: false,
        Cell: (row) => {
          return <div>
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
          <ModalHeader>{this.state.typeSubmit === 1 ? 'Create new role' : 'Edit item'}</ModalHeader>
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
      </div>);
  }
}

export default User;