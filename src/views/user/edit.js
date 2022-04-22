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
  CImg,
  CSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabPane,
  CTabContent,
} from '@coreui/react'
import configuration from '../../config';
import country_code from '../../country_code';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let user_id;


class edit extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{},
        	fieldsPwd:{},
        	errors:{},
        };
    }

    handleCancel(){
    	this.props.history.push('/user/view')
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    }

    handleChangePassword(field, e){
    	let fieldsPwd = this.state.fieldsPwd
    	fieldsPwd[field] = e.target.value;
    	this.setState({fieldsPwd})
    }

    validation(){
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
        if(!fields["address"]){
            formIsValid = false;
            errors["address"] = "Please enter address.";
        }
        if(fields["profile_picture"] === ''){
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
			if (this.state.fields['profile_picture'] === 'profile_picture' || this.state.fields['profile_picture']===''){
            	data.append('profile_picture', this.uploadProfile.files[0]);
            	let fields = this.state.fields;
                fields['change_logo'] = true;
                this.setState({ fields });
			} 
            data.append('fields', JSON.stringify(this.state.fields));
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"user/update", {
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
		var url = window.location.href;
        user_id=url.substring(url.lastIndexOf('/') + 1);
		
		fetch(configuration.baseURL+"user/get?user_id="+user_id).then((response) =>{
	    	return response.json();
	    }).then((data)=> {
	   		this.setState({ fields: data.payload});
	    });
	}

	handleUploadImage(type,ev){
        let fields = this.state.fields;
        fields[type] = type;
        this.setState({fields});
    }

    handleRemovePhoto(photo,type){
        let fields = this.state.fields;
        fields[type] = '';        
        this.setState({fields});
    }

    password(){
    	let fieldsPwd = this.state.fieldsPwd;
        let errors = {};
        var re = /^.*(?=.{6,20})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!-_]).*$/;
        let formIsValid = true;
        if(!fieldsPwd["password"]){
            formIsValid = false;
            errors["password"] = "Please enter password.";
        }
        if(!fieldsPwd["cpassword"]){
            formIsValid = false;
            errors["cpassword"] = "Please enter confirm password.";
        }
        if(fieldsPwd["password"]){
	        if(!re.test(fieldsPwd["password"])){
	            formIsValid = false;
	            errors["password"] = "Password must be 6 characters long including one letter and one digit.";
	        }
        }
        if(fieldsPwd["cpassword"]){
        	if(fieldsPwd["password"] !== fieldsPwd["cpassword"]){
	            formIsValid = false;
	            errors["cpassword"] = "Password and confirm password does not match.";
	        }
        }
        this.setState({errors: errors});
        if(formIsValid){
        	fieldsPwd['user_id'] = user_id;
        	this.setState({fieldsPwd})
        	this.setState({showLoader:true})
			fetch(configuration.baseURL+"user/change-password", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:JSON.stringify(this.state.fieldsPwd)
			}).then((response) => {
				return response.json();
			}).then((data) => {
				this.setState({showLoader:false})
				return toast.success('Your password has been changed successfully.');
			});
        }
    }

    render() {
	  	return (
	  		<CRow>
	  			<ToastContainer position="top-right" autoClose={5000} style={{top:'80px'}}/>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<CTabs>
				              	<CNav variant="tabs">
					                <CNavItem>
					                  	<CNavLink>
					                    	Edit Profile
					                  	</CNavLink>
					                </CNavItem>
					                <CNavItem>
					                  	<CNavLink>
					                    	Change Password
					                  	</CNavLink>
					                </CNavItem>
				              	</CNav>
					            <CTabContent>
						            <CTabPane>
						            	<CRow>
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
											                    	<CLabel htmlFor="hf-code">Address</CLabel>
											                    	<CInput type="text" placeholder="Enter address" onChange={this.handleChange.bind(this,'address')} value={this.state.fields.address} />
											                    	<CFormText className="help-block">{this.state.errors.address}</CFormText>
											                  	</CCol>
											                	<CCol md="6">
											                    	<CLabel htmlFor="hf-Status">Profile Picture</CLabel><br/>
											                    	{	this.state.fields.profile_picture==='' || this.state.fields.profile_picture==='profile_picture'?
												                    	<input
								                                        	accept="image/*"
								                                            type="file"
								                                            ref={(ref) => { this.uploadProfile = ref; }}
								                                            onChange={this.handleUploadImage.bind(this,'profile_picture')}
								                                        /> :
								                                        <div>
									                                        <CImg
									                                        	style={{width:'150px', height:'150px'}}
															                    src={this.state.fields['profile_picture']}
															                    className="c-avatar-img"
															                    alt="laundry"
															                /><br/>
															                <CButton color="danger" className="px-4" onClick={this.handleRemovePhoto.bind(this, this.state.fields['profile_picture'],'profile_picture')}>Remove</CButton>
														                </div>
								                                    }
												                    <CFormText className="help-block">{this.state.errors.profile_picture}</CFormText>
											                  	</CCol>
											                </CFormGroup>
											                <CFormGroup row>
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
						            </CTabPane>
						            <CTabPane>
						            	<CRow>
                                            <CCol xs="12" md="12">
                                            	<CCard>
                                                    <CCardBody>
                                                    	<CForm className="form-horizontal">
											                <CFormGroup row>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-title">New Password</CLabel>
											                    	<CInput type="password" placeholder="Enter password" onChange={this.handleChangePassword.bind(this,'password')} value={this.state.fieldsPwd.password} />
											                    	<CFormText className="help-block">{this.state.errors.password}</CFormText>
											                  	</CCol>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-code">Confirm New Password</CLabel>
											                    	<CInput type="password" placeholder="Enter confirm password" onChange={this.handleChangePassword.bind(this,'cpassword')} value={this.state.fieldsPwd.cpassword} />
											                    	<CFormText className="help-block">{this.state.errors.cpassword}</CFormText>
											                  	</CCol>
											                </CFormGroup>
											            </CForm>
                                                    </CCardBody>
                                                    <CCardFooter>
                                                    	<CButton color="primary" className="px-4" onClick={this.password.bind(this)}>Submit</CButton>{' '}
			            								<CButton color="danger" className="px-4" onClick={this.handleCancel.bind(this)}>Cancel</CButton>
                                                    </CCardFooter>
                                                </CCard>    
                                            </CCol>
                                        </CRow>	
						            </CTabPane>
						        </CTabContent>     	
				            </CTabs>
			            </CCardBody>
		            </CCard>
		        </CCol>  
		    </CRow>      
	  	)
    }
}

export default edit
