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
        	languages:[],
        	categories:[]
        };
    }

    handleCancel(){
    	this.props.history.push('/faq/view')
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

        if(!fields["faq_category_id"]){
            formIsValid = false;
            errors["faq_category_id"] = "Please select category.";
        }
        if(!fields["status"]){
            formIsValid = false;
            errors["status"] = "Please select status.";
        }
        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter question.";
            }
        }
        for(var k=0; k<languages.length; k++){
            if(!fields["ans_"+languages[k]['code']]){
                formIsValid = false;
            	errors["ans_"+languages[k]['code']] = "Please enter answer.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"faq/create", {
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
		fetch(configuration.baseURL+"faq-category/get?status=active").then((response) => {
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
				                    	<CLabel htmlFor="hf-Type">Faq Category</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'faq_category_id')} value={this.state.fields.faq_category_id}>
					                      	<option value="">--Select Category--</option>
					                      	{
	                                            this.state.categories.map((e, key) => {
	                                                return <option key={key} value={e.faq_category_id}>{e.title.EN} --> {e.type}</option>;
	                                            })
	                                        }
					                    </CSelect>
		                    			<CFormText className="help-block">{this.state.errors['faq_category_id']}</CFormText>
				                  	</CCol>
				                  	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Question [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter question" onChange={this.handleChange.bind(this, e.code)} value={this.state.fields[e.code]} />
				                    			<CFormText className="help-block">{this.state.errors[e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
				                </CFormGroup>
				                <CFormGroup row>
				                  	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="12" key={key}>
						                    	<CLabel htmlFor="hf-Type">Answer [ {e.title} ]</CLabel>
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
			                                        data={this.state.chart['ans_'+e.code]}
			                                        id={'ans_'+e.code}
			                                        placeholder='Type your answer!'
			                                        onChange={this.handleEditor.bind(this,'ans_'+e.code)}
			                                	/>
				                    			<CFormText className="help-block">{this.state.errors['ans_'+e.code]}</CFormText>
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
