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
let faq_category_id;


class edit extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{},
        	errors:{},
        	languages:[]
        };
    }

    handleCancel(){
    	this.props.history.push('/faq-category/view')
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

        if(!fields["type"]){
            formIsValid = false;
            errors["type"] = "Please enter type.";
        }
        if(!fields["status"]){
            formIsValid = false;
            errors["status"] = "Please select status.";
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
			fetch(configuration.baseURL+"faq-category/update", {
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

	componentWillMount(){
		var url = window.location.href;
        faq_category_id=url.substring(url.lastIndexOf('/') + 1);
		
		fetch(configuration.baseURL+"faq-category/get?faq_category_id="+faq_category_id).then((response) =>{
	    	return response.json();
	    }).then((data)=> {
	   		this.setState({ fields: data.payload});
	    });

	    fetch(configuration.baseURL+"language/get?status=active").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ languages: data.payload});
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
				                    	<CLabel htmlFor="hf-Type">Type</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'type')} value={this.state.fields.type}>
					                      	<option value="">--Select Type--</option>
					                      	<option value="customer">Customer</option>
					                      	<option value="partner">Partner</option>
					                      	<option value="delivery_staff">Delivery Staff</option>
					                    </CSelect>
				                    	<CFormText className="help-block">{this.state.errors.type}</CFormText>
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

export default edit
