import React, {Component} from 'react'
import {
  CCol,
  CRow,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CFormGroup,
  CForm,
  CLabel,
  CInput,
  CFormText,
  CSelect,
} from '@coreui/react'
import configuration from '../../config';
import country_code from '../../country_code';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class add extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{},
        	errors:{},
        };
    }

    handleCancel(){
    	this.props.history.push('/customer/view')
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    }

    validation(){
    	//var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
        var re = /^.*(?=.{6,20})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!-_]).*$/;
    	let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["name"]){
            formIsValid = false;
            errors["name"] = "Please enter name.";
        }
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
        if(!fields["mobile"]){
            formIsValid = false;
            errors["mobile"] = "Please enter mobile.";
        }
        if(fields["mobile"]){
            if(fields["mobile"].length<7 ||  fields["mobile"].length>10){
                formIsValid = false;
            	errors["mobile"] = "Please enter mobile b/w 7 to 10 digit.";
            }
        }
        if(!fields["password"]){
            formIsValid = false;
            errors["password"] = "Please enter password.";
        }
        if(fields["password"]){
	        if(!re.test(fields["password"])){
	            formIsValid = false;
	            errors["password"] = "Password must be 6 characters long including one letter and one digit.";
	        }
        }
        if(!fields["cpassword"]){
            formIsValid = false;
            errors["cpassword"] = "Please enter confirm password.";
        }
        if(fields["cpassword"]){
            if(fields["password"] !== fields["cpassword"]){
                formIsValid = false;
            	errors["cpassword"] = "Password does not match.";
            }
        }
        if(!fields["profile_picture"]){
            formIsValid = false;
            errors["profile_picture"] = "Please select profile picture.";
        }
        if(!fields["status"]){
            formIsValid = false;
            errors["status"] = "Please select status.";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			const data = new FormData(); 
            data.append('profile_picture', this.uploadProfile.files[0]);
            data.append('fields', JSON.stringify(this.state.fields));
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"customer/create", {
				method: "post",
				headers: {
					'contentType': "application/json",
				},
				body:data
			}).then((response) => {
				return response.json();
			}).then((data) => {
				this.setState({showLoader:false})
				if(data.status===409){
                    return toast.error('Email or mobile number already exists.');
                }
                else{
                    this.handleCancel()
                }
			});
		}
	}

	componentDidMount(){
		let fields = this.state.fields;
        fields['mobile_country_code'] = '+1';
        this.setState({fields});
	}

	handleUploadImage(type,ev){
        let fields = this.state.fields;
        fields[type] = type;
        this.setState({fields});
    }

    render() {
	  	return (
	  		<CRow>
                <ToastContainer position="top-right" autoClose={5000} style={{top:'80px'}}/>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<CForm className="form-horizontal">
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-title">Name</CLabel>
				                    	<CInput type="text" placeholder="Enter name" onChange={this.handleChange.bind(this,'name')} value={this.state.fields.name} />
				                    	<CFormText className="help-block">{this.state.errors.name}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Email</CLabel>
				                    	<CInput type="text" placeholder="Enter email" onChange={this.handleChange.bind(this,'email')} value={this.state.fields.email} />
				                    	<CFormText className="help-block">{this.state.errors.email}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Mobile Country Code</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'mobile_country_code')} value={this.state.fields.mobile_country_code}>
					                      	{
                                                country_code.countries.map((e, key) => {
                                                    return <option key={key} value={e.code}>{e.name} ({e.code})</option>;
                                                })
                                            }
					                    </CSelect>
				                    	<CFormText className="help-block">{this.state.errors.mobile_country_code}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Mobile</CLabel>
				                    	<CInput type="number" placeholder="Enter mobile" onChange={this.handleChange.bind(this,'mobile')} value={this.state.fields.mobile} />
				                    	<CFormText className="help-block">{this.state.errors.mobile}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-title">Password</CLabel>
				                    	<CInput type="password" placeholder="Enter password" onChange={this.handleChange.bind(this,'password')} value={this.state.fields.password} />
				                    	<CFormText className="help-block">{this.state.errors.password}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Confirm Password</CLabel>
				                    	<CInput type="password" placeholder="Enter confirm password" onChange={this.handleChange.bind(this,'cpassword')} value={this.state.fields.cpassword} />
				                    	<CFormText className="help-block">{this.state.errors.cpassword}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Profile Picture</CLabel><br/>
				                    	<input
                                        	accept="image/*"
                                            type="file"
                                            ref={(ref) => { this.uploadProfile = ref; }}
                                            onChange={this.handleUploadImage.bind(this,'profile_picture')}
                                        />
					                    <CFormText className="help-block">{this.state.errors.profile_picture}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Status</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'status')} value={this.state.fields.status}>
					                      	<option value="">--Select Status--</option>
					                      	<option value="active">Active</option>
					                      	<option value="inactive">Inactive</option>
					                    </CSelect>
				                    	<CFormText className="help-block">{this.state.errors.status}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				              </CForm>
			            </CCardBody>
			            <CCardFooter>
			            	<CButton color="primary" className="px-4" onClick={this.submit.bind(this)}>Submit</CButton>{' '}
			            	<CButton color="danger" className="px-4" onClick={this.handleCancel.bind(this)}>Cancel</CButton>
			            </CCardFooter>
		            </CCard>
		        </CCol>  
		    </CRow>      
	  	)
    }
}

export default add
