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
} from '@coreui/react'
import configuration from '../../config';

class add extends Component {
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
    	this.props.history.push('/push/view')
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

        if(!fields["title"]){
            formIsValid = false;
            errors["title"] = "Please enter title.";
        }
        if(!fields["code"]){
            formIsValid = false;
            errors["code"] = "Please enter code.";
        }
        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter value.";
            }
        }
        for(var k=0; k<languages.length; k++){
            if(!fields['cap_'+languages[k]['code']]){
                formIsValid = false;
            	errors['cap_'+languages[k]['code']] = "Please enter caption value.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"push/create", {
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
				                    	<CLabel htmlFor="hf-title">Title</CLabel>
				                    	<CInput type="text" placeholder="Enter title" onChange={this.handleChange.bind(this,'title')} value={this.state.fields.title} />
				                    	<CFormText className="help-block">{this.state.errors.title}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Code</CLabel>
				                    	<CInput type="text" placeholder="Enter code" onChange={this.handleChange.bind(this,'code')} value={this.state.fields.code} />
				                    	<CFormText className="help-block">{this.state.errors.code}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Value [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter value" onChange={this.handleChange.bind(this, e.code)} value={this.state.fields[e.code]} />
				                    			<CFormText className="help-block">{this.state.errors[e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
                                    {
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Caption Value [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter caption value" onChange={this.handleChange.bind(this, 'cap_'+e.code)} value={this.state.fields['cap_'+e.code]} />
				                    			<CFormText className="help-block">{this.state.errors['cap_'+e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
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
