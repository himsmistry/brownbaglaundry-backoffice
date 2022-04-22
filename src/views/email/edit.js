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
import Trumbowyg from 'react-trumbowyg'
import 'react-trumbowyg/dist/trumbowyg.min.css';
import $ from 'jquery';
let emailtemplate_id;


class edit extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	chart:[],
        	showLoader:false,
        	fields:{},
        	errors:{},
        	languages:[],
        };
    }

    handleCancel(){
    	this.props.history.push('/email/view')
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    }

    handleEditor(field,evt){
        let fields = this.state.fields;
        fields[field]=$('#'+field).trumbowyg('html');
       	this.setState({ fields: fields});
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
        if(!fields["from_name"]){
            formIsValid = false;
            errors["from_name"] = "Please enter from name.";
        }
        if(!fields["from_email"]){
            formIsValid = false;
            errors["from_email"] = "Please enter from email.";
        }
        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter description.";
            }
        }
        for(var k=0; k<languages.length; k++){
            if(!fields["sub_"+languages[k]['code']]){
                formIsValid = false;
            	errors["sub_"+languages[k]['code']] = "Please enter subject.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"email/update", {
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
        emailtemplate_id=url.substring(url.lastIndexOf('/') + 1);
		
		fetch(configuration.baseURL+"email/get?emailtemplate_id="+emailtemplate_id).then((response) =>{
	    	return response.json();
	    }).then((data)=> {
	   		this.setState({ fields: data.payload, chart:data.payload.chart});
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
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-title">Title</CLabel>
				                    	<CInput type="text" placeholder="Enter title" onChange={this.handleChange.bind(this,'title')} value={this.state.fields.title} />
				                    	<CFormText className="help-block">{this.state.errors.title}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Code</CLabel>
				                    	<CInput type="text" placeholder="Enter code" onChange={this.handleChange.bind(this,'code')} value={this.state.fields.code} readOnly={true}/>
				                    	<CFormText className="help-block">{this.state.errors.code}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-title">From name</CLabel>
				                    	<CInput type="text" placeholder="Enter from name" onChange={this.handleChange.bind(this,'from_name')} value={this.state.fields.from_name} />
				                    	<CFormText className="help-block">{this.state.errors.from_name}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">From email</CLabel>
				                    	<CInput type="text" placeholder="Enter from email" onChange={this.handleChange.bind(this,'from_email')} value={this.state.fields.from_email} />
				                    	<CFormText className="help-block">{this.state.errors.from_email}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                  	{
                                        this.state.languages.map((e, key) => {
                                            return <CCol md="6" key={key}>
						                    	<CLabel htmlFor="hf-Type">Subject [ {e.title} ]</CLabel>
						                    	<CInput key={key} type="text" placeholder="Enter subject" onChange={this.handleChange.bind(this, 'sub_'+e.code)} value={this.state.fields['sub_'+e.code]} />
				                    			<CFormText className="help-block">{this.state.errors['sub_'+e.code]}</CFormText>
						                  	</CCol>;
                                        })
                                    }
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
			                                        data={this.state.chart[e.code]}
			                                        id={e.code}
			                                        placeholder='Type your description!'
			                                        onChange={this.handleEditor.bind(this,e.code)}
			                                	/>
				                    			<CFormText className="help-block">{this.state.errors[e.code]}</CFormText>
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

export default edit
