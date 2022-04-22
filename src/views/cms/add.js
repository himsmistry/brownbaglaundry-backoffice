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
import Trumbowyg from 'react-trumbowyg'
import 'react-trumbowyg/dist/trumbowyg.min.css';
import $ from 'jquery';

class add extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	chart:[],
        	showLoader:false,
        	fields:{},
        	errors:{},
        	languages:[]
        };
    }

    handleCancel(){
    	this.props.history.push('/cms/view')
    }

    handleEditor(field,evt){
        let fields = this.state.fields;
        fields[field]=$('#'+field).trumbowyg('html');
       	this.setState({ fields: fields});
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

        if(!fields["code"]){
            formIsValid = false;
            errors["code"] = "Please enter code.";
        }
        if(!fields["type"]){
            formIsValid = false;
            errors["type"] = "Please enter type.";
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
			fetch(configuration.baseURL+"cms/create", {
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
				                  	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Title [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter title" onChange={this.handleChange.bind(this, e.code)} value={this.state.fields[e.code]} />
				                    			<CFormText className="help-block">{this.state.errors[e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Code</CLabel>
				                    	<CInput type="text" placeholder="Enter code" onChange={this.handleChange.bind(this,'code')} value={this.state.fields.code} />
				                    	<CFormText className="help-block">{this.state.errors.code}</CFormText>
				                  	</CCol>
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
				                </CFormGroup>
				                <CFormGroup row>
				                	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="12" key={key}>
						                    	<CLabel htmlFor="hf-Type">Description [ {e.title} ]</CLabel>
						                    	<Trumbowyg
			                                    	buttons={
			                                            [
			                                                ['viewHTML'],
			                                                ['formatting'],
			                                                'btnGrp-semantic',
			                                                ['link'],
			                                                ['insertImage'],
			                                                'btnGrp-justify',
			                                                'btnGrp-lists',
			                                            ]
			                                    	}
			                                        data={this.state.chart['desc_'+e.code]}
			                                        id={'desc_'+e.code}
			                                        placeholder='Type your text!'
			                                        onChange={this.handleEditor.bind(this,'desc_'+e.code)}
			                                	/>
				                    			<CFormText className="help-block">{this.state.errors["desc_"+e.code]}</CFormText>
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
