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
  CSelect
} from '@coreui/react'
import configuration from '../../config';
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"

class send extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{},
        	errors:{},
        	languages:[],
        	users: [],
            selectedUsers: [],
        };
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    	if(field === 'user_type'){
    		this.getUsers(e.target.value)
    	}
    }

    validation(){
    	let languages = this.state.languages;
    	let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["user_type"]){
            formIsValid = false;
            errors["user_type"] = "Please enter user type.";
        }
        if(this.state.selectedUsers.length === 0){
            formIsValid = false;
            errors["users"] = "Please select at least one user.";
        }
        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter title.";
            }
            if(!fields['desc_'+languages[i]['code']]){
                formIsValid = false;
            	errors['desc_'+languages[i]['code']] = "Please enter description.";
            }
        }
        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			let fields = this.state.fields
	    	fields['users'] = this.state.selectedUsers;
	    	this.setState({fields})
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"send-notification/send", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:JSON.stringify(this.state.fields)
			}).then((response) => {
				return response.json();
			}).then((data) => {
				this.setState({showLoader:false})
				let fields = this.state.fields
		    	fields['user_type'] = '';
		    	fields['EN'] = '';
		    	fields['desc_EN'] = '';
		    	this.setState({fields, selectedUsers:[]})
			});
		}
	}

	componentDidMount(){
		fetch(configuration.baseURL+"language/get?status=active").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ languages: data.payload});
		});
	}

	getUsers(type){
		this.setState({showLoader:true, selectedUsers:[]})
		fetch(configuration.baseURL+"send-notification/get-users?type="+type).then((response) => {
			return response.json();
		}).then((data) => {
			let users=[];
            for(var i=0; i<data.payload.length; i++){
            	if(type === 'customer'){
	                users.push({
	                    id:data.payload[i].customer_id,
	                    label:data.payload[i].name,
	                })
            	}
            	else if(type === 'partner'){
	                users.push({
	                    id:data.payload[i].user_id,
	                    label:data.payload[i].name,
	                })
            	}
            	else{
            		users.push({
	                    id:data.payload[i].delivery_staff_id,
	                    label:data.payload[i].name,
	                })
            	}
            }
            this.setState({users:users, showLoader:false});
		});
	}

	handleChangeItem(selectedUsers) {
        this.setState({ selectedUsers });
    }

    render() {
	  	return (
	  		<CRow>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<CForm className="form-horizontal">
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">User Type</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'user_type')} value={this.state.fields.user_type}>
					                      	<option value="">--Select Type--</option>
					                      	<option value="customer">Customer</option>
					                      	<option value="partner">Partner</option>
					                      	<option value="delivery_staff">Delivery Staff</option>
					                    </CSelect>
				                    	<CFormText className="help-block">{this.state.errors.user_type}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                  	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Title [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter title" onChange={this.handleChange.bind(this, e.code)} value={this.state.fields[e.code]} />
				                    			<CFormText className="help-block">{this.state.errors[e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
                                    {
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Description [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter description" onChange={this.handleChange.bind(this, 'desc_'+e.code)} value={this.state.fields['desc_'+e.code]} />
				                    			<CFormText className="help-block">{this.state.errors['desc_'+e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
				                </CFormGroup>
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Select User</CLabel>
				                    	<MultiSelect
                                            items={this.state.users}
                                            selectedItems={this.state.selectedUsers}
                                            onChange={this.handleChangeItem.bind(this)}
                                            showSelectAll={true}
                                        />
				                    	<CFormText className="help-block">{this.state.errors.users}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				              </CForm>
			            </CCardBody>
			            <CCardFooter>
			            	<CButton color="primary" className="px-4" onClick={this.submit.bind(this)}>Submit</CButton>{' '}
			            </CCardFooter>
		            </CCard>
		        </CCol>  
		    </CRow>      
	  	)
    }
}

export default send
