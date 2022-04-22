import React, {Component} from 'react'
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
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configuration from '../../config';

class Forgot extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	fields:{},
        	errors:{},
            link:''
        };
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    }

    validation(){
    	let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["email"]){
            formIsValid = false;
            errors["email"] = "Please enter email.";
        }
        if(typeof fields["email"] !== "undefined"){
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
            	formIsValid = false;
            	errors["email"] = "Please enter valid email address.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    forgot(){
    	if(this.validation()){
    		fetch(configuration.baseURL+"auth/forgot", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:JSON.stringify({email: this.state.fields.email, link:this.state.link})
			}).then((response) => {
				return response.json();
			}).then((data) => {
				if(data.status===404){
					return toast.error('Email ID not exists.');
				}
                else if(data.status===409){
                    return toast.error('Your account is deactivated, Please contact to administrator');
                }
				else if(data.status===200){
				    toast.success('We have sent you reset password link on your email address');
	    			this.props.history.push('/login');
				}
				else{
					return toast.error('Something went wrong');
				}
			});
    	}
    }

    componentDidMount(){
        this.setState({link:window.location.protocol+ '//' +window.location.host});
    }

    render() {
	  	return (
				<div className="c-app c-default-layout flex-row align-items-center brownbag-bg">
		    	<ToastContainer position="top-right" autoClose={5000} style={{top:'80px'}}/>
		      	<CContainer>
			        <CRow className="">
			          <CCol md="4" sm="6">
			            <CCardGroup>
			              <CCard className="p-4">
			                <CCardBody>
			                  <CForm>
			                    <h1>Forgot Password</h1>
			                    <p>Forgot password to your account</p>
			                    <CInputGroup className="mb-3">
			                      <CInputGroupPrepend>
			                        <CInputGroupText>
			                          <CIcon name="cil-user" />
			                        </CInputGroupText>
			                      </CInputGroupPrepend>
			                      <CInput type="text" placeholder="Email" onChange={this.handleChange.bind(this,'email')} value={this.state.fields.email}/>
			                      <CFormText className="help-block" style={{width:'100%', float:'left'}}>{this.state.errors.email}</CFormText>
			                    </CInputGroup>
			                    <CRow>
			                      <CCol xs="6">
			                        <CButton color="primary" className="px-4" onClick={this.forgot.bind(this)}>Submit</CButton>
			                      </CCol>
			                      <CCol xs="6" className="text-right">
			                        <CButton color="link" className="px-0" onClick={()=> this.props.history.push('/login') }>Back to Login?</CButton>
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

export default Forgot
