import React from 'react';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import FacebookLogin from 'react-facebook-login';
import BaseAction from '../actions/BaseAction';
import Utils from '../Utils';
import { FACEBOOK_ID } from '../parameters/const_env';

const Login = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" id="username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" id="password" autoComplete="current-password" />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={() => {
                          BaseAction.authentication(document.getElementById('username').value, document.getElementById('password').value)
                            .then((res) => {
                              if (res.data.data) {
                                Utils.setCookie(res.data.data);
                                window.location.reload();
                              }
                            })
                        }}>Login</CButton>{' '}
                        {/* </CCol>
                      <CCol xs="3"> */}
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                    <hr />
                    <CRow>
                      <CCol xs="6">
                        <FacebookLogin
                          appId={FACEBOOK_ID}
                          fields="name,email,picture"
                          textButton="Facebook"
                          cssClass="px-4 btn btn-primary"
                          icon={<CIcon name="cib-facebook" />}
                          callback={(facebook) => {
                            BaseAction.loginFacebook(facebook).then((res) => {
                              if (res.data.data) {
                                Utils.setCookie(res.data.data);
                                window.location.reload();
                              }
                            });
                          }}
                        />
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>If you do not have an account, you can register an account directly here. Please enter button '<b>Register Now!</b>'</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
