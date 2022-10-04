import React, { Component } from 'react'
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
	CRow,
	CFormText
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configuration from '../../config';
import { reactLocalStorage } from 'reactjs-localstorage';
var jwt = require('jsonwebtoken');

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {},
			errors: {}
		};
		this.checkLogin();
	}

	checkLogin() {
		var token = reactLocalStorage.get('token');
		try {
			jwt.verify(token, configuration.appName, function (err, decoded) {
				if (err) {
					decoded = null;
					window.location.href = '/#/login'
				}
				else {
					window.location.href = '/#/dashboard'
				}
			});
		} catch (err) {
			window.location.href = '/#/login'
		}
	}

	generateToken(user) {
		var object = {
			email: user.email,
			name: user.name,
			profile_picture: user.profile_picture,
		};
		return jwt.sign(object, configuration.appName, {
			expiresIn: '1d'
		});
	}

	handleChange(field, e) {
		let fields = this.state.fields
		fields[field] = e.target.value;
		this.setState({ fields })
	}

	validation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields["email"]) {
			formIsValid = false;
			errors["email"] = "Please enter email.";
		}
		if (typeof fields["email"] !== "undefined") {
			let lastAtPos = fields["email"].lastIndexOf('@');
			let lastDotPos = fields["email"].lastIndexOf('.');
			if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
				formIsValid = false;
				errors["email"] = "Please enter valid email address.";
			}
		}
		if (!fields["password"]) {
			formIsValid = false;
			errors["password"] = "Please enter password.";
		}

		this.setState({ errors: errors });
		return formIsValid;
	}

	login() {
		if (this.validation()) {
			fetch(configuration.baseURL + "auth/login", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.state.fields)
			}).then((response) => {
				return response.json();
			}).then((data) => {
				if (data.status === 404) {
					return toast.error('Email ID not exists.');
				}
				else if (data.status === 402) {
					return toast.error('Invalid password');
				}
				else if (data.status === 409) {
					return toast.error('Your account is deactivated, Please contact to administrator');
				}
				else if (data.status === 200) {
					var token = this.generateToken(data.payload);
					reactLocalStorage.set('token', token);
					reactLocalStorage.set('user_id', data.payload.user_id);
					this.props.history.push('/dashboard');
				}
				else {
					return toast.error('Something went wrong');
				}
			});
		}
	}

	render() {
		return (
			<div className="c-app c-default-layout flex-row align-items-center BrownBagLaundry">
				<ToastContainer position="top-right" autoClose={5000} style={{ top: '80px' }} />
				<CContainer>
					<CRow className="">
						<CCol md="4" sm="6">
							<CCardGroup>
								<CCard className="p-4">
									<CCardBody>
										<CForm>
											<h1>Login</h1>
											<p>Sign In to your account</p>
											<CInputGroup className="mb-3">
												<CInputGroupPrepend>
													<CInputGroupText>
														<CIcon name="cil-user" />
													</CInputGroupText>
												</CInputGroupPrepend>
												<CInput type="text" placeholder="Email" onChange={this.handleChange.bind(this, 'email')} value={this.state.fields.email} />
												<CFormText className="help-block" style={{ width: '100%', float: 'left' }}>{this.state.errors.email}</CFormText>
											</CInputGroup>
											<CInputGroup className="mb-4">
												<CInputGroupPrepend>
													<CInputGroupText>
														<CIcon name="cil-lock-locked" />
													</CInputGroupText>
												</CInputGroupPrepend>
												<CInput type="password" placeholder="Password" onChange={this.handleChange.bind(this, 'password')} value={this.state.fields.password} />
												<CFormText className="help-block" style={{ width: '100%', float: 'left' }}>{this.state.errors.password}</CFormText>
											</CInputGroup>
											<CRow>
												<CCol xs="6">
													<CButton color="primary" className="px-4" onClick={this.login.bind(this)}>Login</CButton>
												</CCol>
												<CCol xs="6" className="text-right">
													<CButton color="link" className="px-0" onClick={() => this.props.history.push('/forgot')}>Forgot password?</CButton>
												</CCol>
											</CRow>
										</CForm>
									</CCardBody>
								</CCard>
							</CCardGroup>
						</CCol>
					</CRow>
				</CContainer>
			</div>
		)
	}
}

export default Login
