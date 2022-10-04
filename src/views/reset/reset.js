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

class Reset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {},
			errors: {},
			code: '',
		};
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

		if (!fields["password"]) {
			formIsValid = false;
			errors["password"] = "Please enter password.";
		}
		if (!fields["cpassword"]) {
			formIsValid = false;
			errors["cpassword"] = "Please enter confirm password.";
		}
		if (fields["cpassword"]) {
			if (fields["password"] !== fields["cpassword"]) {
				formIsValid = false;
				errors["cpassword"] = "Password does not match.";
			}
		}

		this.setState({ errors: errors });
		return formIsValid;
	}

	reset() {
		if (this.validation()) {
			fetch(configuration.baseURL + "auth/reset", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password: this.state.fields.password, code: this.state.code })
			}).then((response) => {
				return response.json();
			}).then((data) => {
				if (data.status === 200) {
					toast.success('Your password has been changed successfully');
					this.props.history.push('/login');
				}
				else if (data.status === 404) {
					return toast.error('Your link is expired');
				}
				else {
					return toast.error('Something went wrong');
				}
			});
		}
	}

	componentDidMount() {
		var url_string = window.location.href;
		var url = url_string.split('=')
		this.setState({ code: url[1] });
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
											<h1>Reset Password</h1>
											<p>Reset password to your account</p>
											<CInputGroup className="mb-3">
												<CInputGroupPrepend>
													<CInputGroupText>
														<CIcon name="cil-lock-locked" />
													</CInputGroupText>
												</CInputGroupPrepend>
												<CInput type="password" placeholder="Password" onChange={this.handleChange.bind(this, 'password')} value={this.state.fields.password} />
												<CFormText className="help-block" style={{ width: '100%', float: 'left' }}>{this.state.errors.password}</CFormText>
											</CInputGroup>
											<CInputGroup className="mb-4">
												<CInputGroupPrepend>
													<CInputGroupText>
														<CIcon name="cil-lock-locked" />
													</CInputGroupText>
												</CInputGroupPrepend>
												<CInput type="password" placeholder="Confirm Password" onChange={this.handleChange.bind(this, 'cpassword')} value={this.state.fields.cpassword} />
												<CFormText className="help-block" style={{ width: '100%', float: 'left' }}>{this.state.errors.cpassword}</CFormText>
											</CInputGroup>
											<CRow>
												<CCol xs="6">
													<CButton color="primary" className="px-4" onClick={this.reset.bind(this)}>Reset</CButton>
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

export default Reset
