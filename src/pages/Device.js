/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import SelectFilterer from '../components/Table/Filterer/SelectFilterer';
import { Row, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import CIcon from '@coreui/icons-react';
import ReactSelect from 'react-select';
import { VEHICLETYPES, ROLES, SELECT_PARAMETERS, db_collection } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';

class Device extends React.Component {
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
    // this.getCompany({});

    this.toggle = this.toggle.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.submit = this.submit.bind(this);
    this.changeText = this.changeText.bind(this);
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
    if (!Utils.showElementRole([ROLES.admin]))
      BaseAction.get(db_collection.devices, { ..._query, ...this.state.filteredRegex })
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
    BaseAction.post(db_collection.devices, _body)
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
    BaseAction.put(db_collection.devices, _body)
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
      BaseAction.delete(db_collection.devices, id)
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
    if(textCardIds.length > 0){
      this.state.valueTemp.cardIds = Utils.convertStringListToArray(textCardIds);
    }
    else{
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
      case 'name':
        this.state.valueTemp.name = event.target.value;
        break;
      case 'description':
        this.state.valueTemp.description = event.target.value;
        break;
      case 'cardIds':
        // try {
        //   this.state.valueTemp.cardIds = JSON.parse(event.target.value);
        // }
        // catch { }
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
        Header: 'Company Id',
        accessor: 'companyId',
        Filter: ({ filter, onChange }) => {
          return (
            <TextFilterer
              filter={filter}
              onChange={onChange}
              defaultValue=""
              convertString={(value1) => ({ $regex: `.*${value1}.*` })}
            />
          )
        }
      },
      {
        Header: 'Description',
        accessor: 'description',
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
          <Button color='success' onClick={this.toggleCreate}>+ Create new device</Button>
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
          <ModalHeader>{this.state.typeSubmit === 1 ? 'Create new device' : 'Edit item'}</ModalHeader>
          <ModalBody>
            <table style={{ width: '100%' }}>
              <tr>
                <td style={{ width: '15%' }}>Name</td>
                <td style={{ width: '35%' }}>
                  <Input name='name' value={this.state.valueTemp.name} autoComplete='off' onChange={this.changeText} />
                </td>
                <td style={{ width: '15%', textAlign: 'center' }}>Company</td>
                <td style={{ width: '35%' }}>
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
                <td>Description</td>
                <td>
                  <Input type='textarea' name='description' value={this.state.valueTemp.description} autoComplete='off' onChange={this.changeText} />
                </td>
                <td style={{ width: '15%', textAlign: 'center' }}>Card Ids</td>
                <td>
                  <Input type='text' name='cardIds' id="textCardIds" defaultValue={this.state.valueTemp.cardIds && Utils.convertArrayToStringList(this.state.valueTemp.cardIds)} autoComplete='off' />
                  {/* <Label>{this.state.valueTemp.cardIds && JSON.stringify(this.state.valueTemp.cardIds)}</Label> */}
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

export default Device;