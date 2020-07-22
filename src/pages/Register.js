/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import { CButton, CCard, CCardBody, CContainer, CForm } from '@coreui/react';
import { Input } from 'reactstrap';
import { VEHICLETYPES } from '../parameters/const_env';
import Utils from '../Utils';
import BaseAction from '../actions/BaseAction';
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        vehicleType: 'car'
      }
    }

    this.submit = this.submit.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  submit() {
    BaseAction.register(this.state.user).then((res) => {
      if (res.data.total) {
        alert('Complete success!');
        BaseAction.authentication(res.data.data[0]['account'], res.data.data[0]['password'])
          .then((resLogin) => {
            if (resLogin.data.data) {
              Utils.setCookie(resLogin.data.data);
              Utils.resetLink();
            }
          })
      } else {
        alert('Something error!');
      }
    })
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
      <CContainer style={{ marginTop: '60px' }}>
        <CCard className="mx-4">
          <CCardBody className="p-4">
            <CForm>
              <h1>Register</h1>
              <p className="text-muted">Create your account</p>
              <table style={{ width: '100%' }}>
                <tr>
                  <td>Account</td>
                  <td>
                    <Input name='account' value={this.state.user.account} autoComplete='off' onChange={this.changeText} />
                  </td>
                  <td>&ensp;</td>
                  <td>Password</td>
                  <td>
                    <Input type='password' name='password' value={this.state.user.password} autoComplete='new-password' onChange={this.changeText} />
                  </td>
                </tr>
                <br />
                <tr>
                  <td>Name</td>
                  <td>
                    <Input name='name' value={this.state.user.name} autoComplete='off' onChange={this.changeText} />
                  </td>
                  <td>&ensp;</td>
                  <td>Email</td>
                  <td>
                    <Input name='email' value={this.state.user.email} autoComplete='off' onChange={this.changeText} />
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
                  <td>Vehicle Type</td>
                  <td>
                    <Input type='select' name='vehicleType' value={this.state.user.vehicleType} onChange={this.changeText} >
                      {
                        Object.keys(VEHICLETYPES).map((e, i) => <option key={e}>{e}</option>)
                      }
                    </Input>
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
                  <td>Description</td>
                  <td>
                    <Input type='textarea' name='description' value={this.state.user.description} autoComplete='off' onChange={this.changeText} />
                  </td>
                </tr>
              </table>
              <br />
              <CButton color="success" block onClick={this.submit}>Create Account</CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    );
  }
}

export default Register
