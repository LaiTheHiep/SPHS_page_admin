/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Table from '../components/Table';
import { Row, Col, Button, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CIcon from '@coreui/icons-react';
import BaseAction from '../actions/BaseAction';
import { db_collection } from '../parameters/const_env';

class Role extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      typeSubmit: 0, // 0: none, 1 : create, 2: edit
      valueTemp: {}, // role
      data: []
    };

    this.get({});

    this.toggle = this.toggle.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  get(_query) {
    BaseAction.get(db_collection.roles, {})
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
  }

  post(_body) {
    BaseAction.post(db_collection.roles, _body)
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
    BaseAction.put(db_collection.roles, _body)
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
      default:
        break;
    }
    this.setState({});
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

  delete(id) {
    var conf = window.confirm('Are you sure?');
    if (!conf)
      return;

    if (id) {
      BaseAction.delete(db_collection.roles, id)
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

  render() {
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
        filterable: false
      },
      {
        Header: 'Description',
        accessor: 'description',
        filterable: false
      },
      {
        Header: 'ID',
        accessor: '_id',
        filterable: false
      },
      {
        Header: 'Option',
        id: 'option',
        width: 100,
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
          <Button color='success' onClick={this.toggleCreate}>+ Create new role</Button>
        </Row>
        <br />
        <Row>
          <Table
            style={{ width: '100%' }}
            filterable={false}
            // manual
            // pages={this.state.pages}              
            // page={this.state.page}
            columns={columns}
            data={this.state.data}
            pageSizeOptions={[10, 25, 50, 75, 100]}
            defaultPageSize={10}
          />
        </Row>
        <Modal isOpen={this.state.isOpen} toggle={this.isOpen} size='lg'>
          <ModalHeader>{this.state.typeSubmit === 1 ? 'Create new role' : 'Edit item'}</ModalHeader>
          <ModalBody>
            <Row>
              <Label sm='3'>Name:</Label>
              <Col sm='9'>
                <Input
                  name='name' value={this.state.valueTemp.name}
                  autoComplete='off'
                  onChange={this.changeText}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Label sm='3'>Description:</Label>
              <Col sm='9'>
                <Input
                  name='description' value={this.state.valueTemp.description}
                  autoComplete='off'
                  onChange={this.changeText}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className='text-right'>
              <Button color='success' onClick={this.submit}>{this.state.typeSubmit === 1 ? 'Create' : 'Edit'}</Button>&emsp;
              <Button color='secondary' onClick={this.toggle}>Cancel</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Role;
