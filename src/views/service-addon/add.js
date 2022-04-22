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
    	this.props.history.push('/service-addon/view')
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
        if(!fields["price"]){
            formIsValid = false;
            errors["price"] = "Please enter price.";
        }
        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter title.";
            }
        }
        for(var k=0; k<languages.length; k++){
            if(!fields["desc_"+languages[k]['code']]){
                formIsValid = false;
            	errors["desc_"+languages[k]['code']] = "Please enter description.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"service-addon/create", {
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
	                                                return <option key={key} value={e.service_category_id}>{e.title.EN}</option>;
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
				                	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Description [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="textarea" placeholder="Enter description" onChange={this.handleChange.bind(this, 'desc_'+e.code)} value={this.state.fields['desc_'+e.code]} />
				                    			<CFormText className="help-block">{this.state.errors['desc_'+e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
				                </CFormGroup>
				                <CFormGroup row>
				                	<CCol md="6">
				                    	<CLabel htmlFor="hf-Type">Price($)</CLabel>
				                    	<CInput type="number" placeholder="Enter price" onChange={this.handleChange.bind(this, 'price')} value={this.state.fields['price']} />
		                    			<CFormText className="help-block">{this.state.errors['price']}</CFormText>
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
