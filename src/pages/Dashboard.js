/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Table from '../components/Table';
import BaseAction from '../actions/BaseAction';
import { ROLES, db_collection } from '../parameters/const_env';
import Utils from '../Utils';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: 1,
      pageSize: 10,
      total: 0,
    };

    if (!Utils.showElementRole([ROLES.admin])) {
      this.get({ $limit: this.state.pageSize });
    }
  }

  getTotal(_query) {
    BaseAction.getTotal(db_collection.feedBacks, { ..._query }).then((res) => {
      if (res.data.total) {
        this.state.total = res.data.total;
        this.state.pages = Utils.getPage(res.data.total, this.state.pageSize);
        this.setState({});
      }
    })
  }

  get(_query) {
    BaseAction.get(db_collection.feedBacks, { ..._query })
      .then((res) => {
        if (res.data.errorMessage) {
          alert('Something wrong! ' + res.data.errorMessage);
          return;
        }
        if (res.data.data) {
          this.state.data = res.data.data;
          this.setState({});
        }
      });
    this.getTotal({});
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
        Header: 'Email',
        accessor: 'email',
        filterable: false
      },
      {
        Header: 'Subject',
        accessor: 'subject',
        filterable: false
      },
      {
        Header: 'Content',
        accessor: 'content',
        filterable: false
      },
    ];

    return (
      <div>
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
            this.get({ $skip: valueState.page * valueState.pageSize, $limit: valueState.pageSize });
          }}
        />
      </div>
    );
  }
}

export default Dashboard;