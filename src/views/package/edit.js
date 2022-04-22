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
  CSelect
} from '@coreui/react'
import configuration from '../../config';
let package_id;


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
    	this.props.history.push('/package/view')
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
        
        if(fields["image"]===''){
            formIsValid = false;
            errors["image"] = "Please select image.";
        }
        if(!fields["price"]){
            formIsValid = false;
            errors["price"] = "Please enter price.";
        }
        if(!fields["status"]){
            formIsValid = false;
            errors["status"] = "Please select status.";
        }
        if(!fields["min_weight"]){
            formIsValid = false;
            errors["min_weight"] = "Please enter min weight.";
        }
        if(!fields["weight_charge"]){
            formIsValid = false;
            errors["weight_charge"] = "Please enter weight charge.";
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
			if (this.state.fields['image'] === 'image' || this.state.fields['image']===''){
            	data.append('image', this.uploadIcon.files[0]);
            	let fields = this.state.fields;
                fields['change_logo'] = true;
                this.setState({ fields });
			} 
            data.append('fields', JSON.stringify(this.state.fields));
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"package/update", {
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

	componentWillMount(){
		var url = window.location.href;
        package_id=url.substring(url.lastIndexOf('/') + 1);
		
		fetch(configuration.baseURL+"package/get?package_id="+package_id).then((response) =>{
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
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-code">Price($)</CLabel>
				                    	<CInput type="number" placeholder="Enter price" onChange={this.handleChange.bind(this,'price')} value={this.state.fields.price} />
				                    	<CFormText className="help-block">{this.state.errors.price}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Image</CLabel><br/>
				                    	{	this.state.fields.image==='' || this.state.fields.image==='image'?
					                    	<input
	                                        	accept="image/*"
	                                            type="file"
	                                            ref={(ref) => { this.uploadIcon = ref; }}
	                                            onChange={this.handleUploadImage.bind(this,'image')}
	                                        /> :
	                                        <div>
		                                        <CImg
		                                        	style={{width:'150px', height:'150px'}}
								                    src={this.state.fields['image']}
								                    className="c-avatar-img"
								                    alt="laundry"
								                /><br/>
								                <CButton color="danger" className="px-4" onClick={this.handleRemovePhoto.bind(this, this.state.fields['image'],'image')}>Remove</CButton>
							                </div>
	                                    }
					                    <CFormText className="help-block">{this.state.errors.image}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
                                    <CCol md="6">
                                        <CLabel htmlFor="hf-code">Min Weight(lbs)</CLabel>
                                        <CInput type="number" placeholder="Enter wight" onChange={this.handleChange.bind(this,'min_weight')} value={this.state.fields.min_weight} />
                                        <CFormText className="help-block">{this.state.errors.min_weight}</CFormText>
                                    </CCol>
                                    <CCol md="6">
                                        <CLabel htmlFor="hf-code">Weight Charge($)(Charge will apply when weight is greater than min weight)</CLabel>
                                        <CInput type="number" placeholder="Enter weight charge" onChange={this.handleChange.bind(this,'weight_charge')} value={this.state.fields.weight_charge} />
                                        <CFormText className="help-block">{this.state.errors.weight_charge}</CFormText>
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

export default edit
