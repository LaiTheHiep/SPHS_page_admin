/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Table from '../components/Table';
import TextFilterer from '../components/Table/Filterer/TextFilterer';
import { Row, Col, Button, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CIcon from '@coreui/icons-react';
import { SELECT_PARAMETERS, db_collection } from '../parameters/const_env';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';

class Company extends React.Component {
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
    };

    this.get({ $limit: this.state.pageSize });

    this.toggle = this.toggle.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  getTotal(_query) {
    BaseAction.getTotal(db_collection.companies, { ..._query, ...this.state.filteredRegex }).then((res) => {
      if (res.data.total) {
        this.state.total = res.data.total;
        this.state.pages = Utils.getPage(res.data.total, this.state.pageSize);
        this.setState({});
      }
    })
  }

  get(_query) {
    BaseAction.get(db_collection.companies, { ..._query, ...this.state.filteredRegex })
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
        Filter: ({ filter, onChange }) => (
          <TextFilterer
            filter={filter}
            onChange={onChange}
            defaultValue=""
            convertString={(value1) => ({ $regex: `.*${value1}.*` })}
          />
        ),
        Cell: (row) => {
          return <div>
            <Button color='link' onClick={() => this.getParkingTickets(row.original._id)}>{row.original.name}</Button>
          </div>
        },
      },
      {
        Header: 'Address',
        accessor: 'address',
        Filter: ({ filter, onChange }) => (
          <TextFilterer
            filter={filter}
            onChange={onChange}
            defaultValue=""
            convertString={(value1) => ({ $regex: `.*${value1}.*` })}
          />
        ),
        Cell: (row) => {
          return <div>
            <Button color='link' onClick={() => this.getParkingTickets(row.original._id)}>{row.original.name}</Button>
          </div>
        },
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
          <Button color='success' onClick={this.toggleCreate}>+ Create new company</Button>
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
                if (e.value)
                  _regex_arr.push({ "name": e.id, "value": `.*${e.value['$valueTmp']}.*`, "$options": "$i" });
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

export default Company;