import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  CLabel,
  CFormGroup,
  CFormText,
  CButton
} from '@coreui/react';
import configuration from '../../config';
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CSVLink } from "react-csv";

const fields = [
    { key: 'order_id',label:'#ID', _style: { width: '15%'} },
    { key: 'category_name', _style: { width: '75%'} },
    { key: 'total',label:'Sales', _style: { width: '10%'} },
]


class view extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	data:[],
        	total_sales:0,
        	settings:{default_currency:'$'},
        	fields:{start_date:null, end_date:null},
        	errors:{},
        	showTable:false,
        	csvData:[],
        };
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	if(field === 'start_date' || field === 'end_date'){
            fields[field] = e;
        }
    	this.setState({fields})
    }

    componentDidMount(){
		fetch(configuration.baseURL+"settings/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ settings: data.payload});
		});
	}

	submit(){
		let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        if(!fields["start_date"]){
            formIsValid = false;
            errors["start_date"] = "Please select start date.";
        }
        if(!fields["end_date"]){
            formIsValid = false;
            errors["end_date"] = "Please select end date.";
        }
        if(fields["end_date"]){
	        if(fields["start_date"] > fields["end_date"]){
	        	formIsValid = false;
	            errors["end_date"] = "Please select valid end date.";
	        }
        }
        this.setState({errors: errors});
        if(formIsValid){
			fetch(configuration.baseURL+"order/get-sales-report?start_date="+moment(this.state.fields.start_date).format('YYYY-MM-DD')+'&end_date='+moment(this.state.fields.end_date).format('YYYY-MM-DD')).then((response) => {
				return response.json();
			}).then((data) => {
				let csvData = [
		            ["ID", "Category Name", "Sales"],
		        ];
		        for(var i=0; i<data.payload.sales.length; i++){
		            csvData.push([data.payload.sales[i].order_id,
		                data.payload.sales[i].category_name,
		                this.state.settings.default_currency+data.payload.sales[i].total,
		            ])
		        }
				this.setState({ data: data.payload.sales, total_sales:data.payload.total_sales, showTable:true, csvData:csvData});
			});
        }
	}

    render() {
	  	return (
	  		<CRow>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<CFormGroup row>    
                                <CCol md="2">
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
                                <CCol md="2">
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
                                <CCol md="2">
                                    <CButton color="primary" className="px-4" onClick={this.submit.bind(this)}>Submit</CButton>{' '}
                                </CCol>
                                {
                                	this.state.showTable ?
	                                <CCol md="6">
	                                    <CButton color="primary" className="px-4" onClick={this.submit.bind(this)} style={{float:'right'}}><CSVLink data={this.state.csvData} filename={"sales.csv"} style={{color:'#fff'}}>Export CSV</CSVLink></CButton>{' '}
	                                </CCol> : null
                                }
                            </CFormGroup>
                            {
                            	this.state.showTable ? 
							    <CDataTable
							      	items={this.state.data}
							      	fields={fields}
							      	//columnFilter
							      	tableFilter
							      	//footer
							      	itemsPerPageSelect
							      	itemsPerPage={10}
							      	hover
							      	sorter
							      	pagination
							      	scopedSlots = {{
							      		'total':
							          	(item)=>(
								            <td>
								              	{this.state.settings.default_currency}{item.total}
								            </td>
							          	),
							      	}}
							    /> :  null
                            }
                            {
                            	this.state.showTable ? 
	                            <CFormGroup row>    
	                                <CCol md="12">
	                                    <span style={{float:'right', fontSize:'22px', padding:'10px'}}><b>Total Sales: </b> {this.state.settings.default_currency}{this.state.total_sales} </span>
	                                </CCol>
	                            </CFormGroup> : null
                            }
			            </CCardBody>
		            </CCard>
		        </CCol>  
		    </CRow>      
	  	)
    }
}

export default view
