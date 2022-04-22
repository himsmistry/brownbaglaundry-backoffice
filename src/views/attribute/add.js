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

class add extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{},
        	errors:{},
        	languages:[],
            categories:[]
        };
    }

    handleCancel(){
    	this.props.history.push('/attribute/view')
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    }

    validation(){
    	let fields = this.state.fields;
    	let languages = this.state.languages;
        let errors = {};
        let formIsValid = true;

        if(!fields["service_category_id"]){
            formIsValid = false;
            errors["service_category_id"] = "Please select category.";
        }
        if(!fields["status"]){
            formIsValid = false;
            errors["status"] = "Please select status.";
        }
        if(!fields["type"]){
            formIsValid = false;
            errors["type"] = "Please select type.";
        }
        if(!fields["max_select"]){
            formIsValid = false;
            errors["max_select"] = "Please enter max select value.";
        }
        if(fields["max_select"]){
            if(parseFloat(fields["max_select"]) < 0){
                formIsValid = false;
                errors["max_select"] = "Please enter only positive value in max select.";
            }
        }
        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter title.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"attribute/create", {
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
				this.handleCancel()
			});
		}
	}

	componentDidMount(){
		fetch(configuration.baseURL+"language/get?status=active").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ languages: data.payload});
		});
        fetch(configuration.baseURL+"service-category/get?status=active").then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({ categories: data.payload});
        });
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
                                        <CLabel htmlFor="hf-Type">Service Category</CLabel>
                                        <CSelect custom onChange={this.handleChange.bind(this,'service_category_id')} value={this.state.fields.service_category_id}>
                                            <option value="">--Select Service Category--</option>
                                            {
                                                this.state.categories.map((e, key) => {
                                                    let val = e.title.EN.toLowerCase()
                                                    if(val.includes('signature')){
                                                        return <option key={key} value={e.service_category_id}>{e.title.EN}</option>;
                                                    }
                                                    else {
                                                        return null;
                                                    }
                                                })
                                            }
                                        </CSelect>
                                        <CFormText className="help-block">{this.state.errors['service_category_id']}</CFormText>
                                    </CCol>
                                    {
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
                                                <CLabel htmlFor="hf-Type">Title [ {e.title} ]</CLabel>
                                                <CInput key={key} type="text" placeholder="Enter title" onChange={this.handleChange.bind(this, e.code)} value={this.state.fields[e.code]} />
                                                <CFormText className="help-block">{this.state.errors[e.code]}</CFormText>
                                            </CCol>;
                                        })
                                    }
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
                                    <CCol md="6">
                                        <CLabel htmlFor="hf-Status">Select Type</CLabel>
                                        <CSelect custom onChange={this.handleChange.bind(this,'type')} value={this.state.fields.type}>
                                            <option value="">--Select Type--</option>
                                            <option value="radio">Radio</option>
                                            <option value="checkbox">Checkbox</option>
                                        </CSelect>
                                        <CFormText className="help-block">{this.state.errors.type}</CFormText>
                                    </CCol>
				                </CFormGroup>
                                <CFormGroup row>
                                    <CCol md="6">
                                        <CLabel htmlFor="hf-Status">Max Select</CLabel>
                                        <CInput type="number" placeholder="Enter max select" onChange={this.handleChange.bind(this, 'max_select')} value={this.state.fields['max_select']} />
                                        <CFormText className="help-block">{this.state.errors.max_select}</CFormText>
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
