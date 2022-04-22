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
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

class add extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{start_date:null, end_date:null},
        	errors:{},
        	languages:[],
        };
    }

    handleCancel(){
    	this.props.history.push('/coupon/view')
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	if(field === 'start_date' || field === 'end_date'){
            fields[field] = e;
        }
        else{
    	   fields[field] = e.target.value;
        }
    	this.setState({fields})
    }

    validation(){
    	let languages = this.state.languages;
    	let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        for(var i=0; i<languages.length; i++){
            if(!fields[languages[i]['code']]){
                formIsValid = false;
            	errors[languages[i]['code']] = "Please enter title.";
            }
        }
        if(!fields["coupon_code"]){
            formIsValid = false;
            errors["coupon_code"] = "Please enter code.";
        }
        if(!fields["start_date"]){
            formIsValid = false;
            errors["start_date"] = "Please select start date.";
        }
        if(!fields["end_date"]){
            formIsValid = false;
            errors["end_date"] = "Please select end date.";
        }
        if(!fields["total_usage"]){
            formIsValid = false;
            errors["total_usage"] = "Please enter total usage.";
        }
        if(parseFloat(fields["total_usage"]) <=0 ){
            formIsValid = false;
            errors["total_usage"] = "Please enter only positive value in total usage.";
        }
        if(!fields["value"]){
            formIsValid = false;
            errors["value"] = "Please enter value.";
        }
        if(parseFloat(fields["value"]) <=0 ){
            formIsValid = false;
            errors["value"] = "Please enter only positive value in value.";
        }
        if(!fields["type"]){
            formIsValid = false;
            errors["type"] = "Please select type.";
        }
        if(!fields["status"]){
            formIsValid = false;
            errors["status"] = "Please select status.";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

	submit() {
		if(this.validation()){
			this.setState({showLoader:true})
			fetch(configuration.baseURL+"coupon/create", {
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
				                  	<CCol md="12">
				                    	<CLabel htmlFor="hf-code">Code</CLabel>
				                    	<CInput type="text" placeholder="Enter code" onChange={this.handleChange.bind(this,'coupon_code')} value={this.state.fields.coupon_code} />
				                    	<CFormText className="help-block">{this.state.errors.coupon_code}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>    
                                    <CCol md="6">
                                        <CLabel htmlFor="hf-Status">Start Date</CLabel><br/>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker
                                                format="MM/dd/yyyy"
                                                animateYearScrolling
                                                value={this.state.fields.start_date}
                                                onChange={this.handleChange.bind(this, 'start_date')}
                                              />
                                        </MuiPickersUtilsProvider><br/>
                                        <CFormText className="help-block">{this.state.errors.start_date}</CFormText>
                                    </CCol>
                                    <CCol md="6">
                                        <CLabel htmlFor="hf-Status">End Date</CLabel><br/>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker
                                                format="MM/dd/yyyy"
                                                animateYearScrolling
                                                value={this.state.fields.end_date}
                                                onChange={this.handleChange.bind(this, 'end_date')}
                                              />
                                        </MuiPickersUtilsProvider><br/>
                                        <CFormText className="help-block">{this.state.errors.end_date}</CFormText>
                                    </CCol>
                                </CFormGroup>
				                <CFormGroup row>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Type</CLabel>
				                    	<CSelect custom onChange={this.handleChange.bind(this,'type')} value={this.state.fields.type}>
					                      	<option value="">--Select Type--</option>
					                      	<option value="percentage">Percentage</option>
					                      	<option value="amount">Amount</option>
					                    </CSelect>
				                    	<CFormText className="help-block">{this.state.errors.type}</CFormText>
				                  	</CCol>
				                  	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Value</CLabel>
				                    	<CInput type="number" placeholder="Enter value" onChange={this.handleChange.bind(this,'value')} value={this.state.fields.value} />
				                    	<CFormText className="help-block">{this.state.errors.value}</CFormText>
				                  	</CCol>
				                </CFormGroup>
				                <CFormGroup row>
				                	<CCol md="6">
				                    	<CLabel htmlFor="hf-Status">Total Usage</CLabel>
				                    	<CInput type="number" placeholder="Enter total usage" onChange={this.handleChange.bind(this,'total_usage')} value={this.state.fields.total_usage} />
				                    	<CFormText className="help-block">{this.state.errors.total_usage}</CFormText>
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
