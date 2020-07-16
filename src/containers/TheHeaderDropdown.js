/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-unused-vars */
import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Input } from 'reactstrap';
import ReactSelect from 'react-select';
import Utils from '../Utils';
import BaseAction from '../actions/BaseAction';
import { db_collection, VEHICLETYPES, SELECT_PARAMETERS } from '../parameters/const_env';

class TheHeaderDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false,
      user: {},
      companies: [],

    }

    this.getCompany({});

    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  toggleUpdate() {
    this.state.isUpdate = !this.state.isUpdate;
    this.state.user = {};
    this.setState({});
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

  changeText(event) {
    switch (event.target.name) {
      case 'account':
        this.state.user.account = event.target.value;
        break;
      case 'password':
        this.state.user.password = event.target.value;
        break;
      case 'name':
        this.state.user.name = event.target.value;
        break;
      case 'cmt':
        this.state.user.cmt = event.target.value;
        break;
      case 'phone':
        this.state.user.phone = event.target.value;
        break;
      case 'email':
        this.state.user.email = event.target.value;
        break;
      case 'numberPlate':
        this.state.user.numberPlate = event.target.value;
        break;
      case 'vehicleColor':
        this.state.user.vehicleColor = event.target.value;
        break;
      case 'vehicleBranch':
        this.state.user.vehicleBranch = event.target.value;
        break;
      case 'vehicleType':
        this.state.user.vehicleType = event.target.value;
        break;
      case 'description':
        this.state.user.description = event.target.value;
        break;
      default:
        break;
    }
    this.setState({});
  }

  render() {
    return (
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="text-right">
            <h5>{Utils.getItemCookie('name')}</h5>
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem onClick={() => {
            this.state.user._id = Utils.getItemCookie('_id');
            this.state.user.account = Utils.getItemCookie('account');
            this.state.user.password = Utils.getItemCookie('password');
            this.state.user.name = Utils.getItemCookie('name');
            this.state.user.companyId = Utils.getItemCookie('companyId');
            this.state.user.cmt = Utils.getItemCookie('cmt');
            this.state.user.phone = Utils.getItemCookie('phone');
            this.state.user.email = Utils.getItemCookie('email');
            this.state.user.numberPlate = Utils.getItemCookie('numberPlate');
            this.state.user.vehicleColor = Utils.getItemCookie('vehicleColor');
            this.state.user.vehicleBranch = Utils.getItemCookie('vehicleBranch');
            this.state.user.vehicleType = Utils.getItemCookie('vehicleType');
            this.state.user.description = Utils.getItemCookie('description');
            this.state.isUpdate = !this.state.isUpdate;
            this.setState({});
          }}>
            <CIcon name="cil-user" className="mfe-2" />
          Update Profile
        </CDropdownItem>
          <CDropdownItem onClick={() => {
            Utils.clearCookie();
            window.location.reload();
          }}>
            <CIcon name="cil-lock-locked" className="mfe-2" />
          Logout
        </CDropdownItem>
        </CDropdownMenu>
        <Modal isOpen={this.state.isUpdate} toggle={this.toggleUpdate} size='lg'>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalBody>
            <table style={{ width: '100%' }}>
              <tr>
                <td>Account</td>
                <td>
                  <Input name='account' value={this.state.user.account} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Password</td>
                <td>
                  <Input type='password' name='password' value={this.state.user.password} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Name</td>
                <td>
                  <Input name='name' value={this.state.user.name} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Company</td>
                <td>
                  <Input name='companyId' value={this.state.user.companyId} autoComplete=' off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>CMT</td>
                <td>
                  <Input name='cmt' value={this.state.user.cmt} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Phone</td>
                <td>
                  <Input name='phone' value={this.state.user.phone} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Email</td>
                <td>
                  <Input name='email' value={this.state.user.email} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Number Plate</td>
                <td>
                  <Input name='numberPlate' value={this.state.user.numberPlate} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Vehicle Color</td>
                <td>
                  <Input name='vehicleColor' value={this.state.user.vehicleColor} autoComplete='off' onChange={this.changeText} />
                </td>
                <td>&ensp;</td>
                <td>Vehicle Branch</td>
                <td>
                  <Input name='vehicleBranch' value={this.state.user.vehicleBranch} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <br />
              <tr>
                <td>Vehicle Type</td>
                <td>
                  <Input type='select' name='vehicleType' value={this.state.user.vehicleType} onChange={this.changeText} >
                    {
                      Object.keys(VEHICLETYPES).map((e, i) => <option key={e}>{e}</option>)
                    }
                  </Input>
                  {/* <Input name='vehicleType' value={this.state.user.vehicleType} autoComplete='off' onChange={this.changeText} /> */}
                </td>
                <td>&ensp;</td>
                <td>Description</td>
                <td>
                  <Input type='textarea' name='description' value={this.state.user.description} autoComplete='off' onChange={this.changeText} />
                </td>
              </tr>
              <tr>
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
                      this.state.user.companyId = value.value; // _id
                    }}
                  />
                </td>
              </tr>
            </table>
          </ModalBody>
          <ModalFooter>
            <Button color='success' onClick={() => {
              if (this.state.user._id) {
                if (!this.state.user.password || this.state.user.password.length === 0) {
                  delete this.state.user.password;
                }
                BaseAction.put(db_collection.users, this.state.user).then((res) => {
                  if (res.data.toggle)
                    this.toggleUpdate();
                  else
                    alert('Something error!');
                })
              } else {
                alert('Something error!');
              }
            }}>Submit</Button>
            <Button color='secondary' onClick={this.toggleUpdate}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </CDropdown>
    );
  }
}

export default TheHeaderDropdown
