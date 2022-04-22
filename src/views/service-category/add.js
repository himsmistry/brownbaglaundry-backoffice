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
        	languages:[]
        };
    }

    handleCancel(){
    	this.props.history.push('/service-category/view')
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

        // if(!fields["min_required_weight"]){
        //     formIsValid = false;
        //     errors["min_required_weight"] = "Please enter min weight.";
        // }
        if(!fields["icon"]){
            formIsValid = false;
            errors["icon"] = "Please select icon.";
        }
        if(!fields["min_price"]){
            formIsValid = false;
            errors["min_price"] = "Please enter min price.";
        }
        if(!fields["order"]){
            formIsValid = false;
            errors["order"] = "Please enter order no.";
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
        for(var k=0; k<languages.length; k++){
            if(!fields['desc_'+languages[k]['code']]){
                formIsValid = false;
            	errors['desc_'+languages[k]['code']] = "Please enter description.";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			const data = new FormData(); 
            data.append('icon', this.uploadIcon.files[0]);
            data.append('fields', JSON.stringify(this.state.fields));
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"service-category/create", {
				method: "post",
				headers: {
					'contentType': "application/json",
				},
				body:data
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
		let fields = this.state.fields
    	fields['is_addon_item'] = 'no';
    	this.setState({fields})
	}

	handleUploadImage(type,ev){
        let fields = this.state.fields;
        fields[type] = type;
        this.setState({fields});
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
				                {/*<CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-title">Min Required Weight(In lbs)</CLabel>
				                    	<CInput type="number" placeholder="Enter weight" onChange={this.handleChange.bind(this,'min_required_weight')} value={this.state.fields.min_required_weight} />
				                    	<CFormText className="help-block">{this.state.errors.min_required_weight}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Price(For 1 lbs)</CLabel>
				                    	<CInput type="number" placeholder="Enter price" onChange={this.handleChange.bind(this,'price')} value={this.state.fields.price} />
				                    	<CFormText className="help-block">{this.state.errors.price}</CFormText>
				                  	</CCol>
				                </CFormGroup>*/}
				                <CFormGroup row>
				                	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Icon</CLabel><br/>
				                    	<input
                                        	accept="image/*"
                                            type="file"
                                            ref={(ref) => { this.uploadIcon = ref; }}
                                            onChange={this.handleUploadImage.bind(this,'icon')}
                                        />
					                    <CFormText className="help-block">{this.state.errors.icon}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Is item addon?</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'is_addon_item')} value={this.state.fields.is_addon_item}>
					                      	<option value="no">No</option>
					                      	<option value="yes">Yes</option>
					                    </CSelect>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                	<CCol md="6">
				                    	<CLabel htmlFor="hf-title">Order No</CLabel>
				                    	<CInput type="number" placeholder="Enter order no" onChange={this.handleChange.bind(this,'order')} value={this.state.fields.order} />
				                    	<CFormText className="help-block">{this.state.errors.order}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Min Price</CLabel>
				                    	<CInput type="number" placeholder="Enter price" onChange={this.handleChange.bind(this,'min_price')} value={this.state.fields.min_price} />
				                    	<CFormText className="help-block">{this.state.errors.min_price}</CFormText>
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
	  	)
    }
}

export default add
