import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
} from '@coreui/react';
import configuration from '../../config';
import moment from 'moment';


class view extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	data:[],
        	settings:{default_currency:'$'}
        };
    }

    componentDidMount(){
		fetch(configuration.baseURL+"order/get?status=pending").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
		fetch(configuration.baseURL+"settings/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ settings: data.payload});
		});
	}

    render() {
    	const fields = [
		    { key: 'order_id',label:'#ID', _style: { width: '10%'} },
		    { key: 'customer', _style: { width: '15%'} },
		    { key: 'location', _style: { width: '50%'} },
		    { key: 'total', _style: { width: '10%'} },
		    { key: 'created_at', label:'Created Date',_style: { width: '15%'} },
		]
	  	return (
	  		<CRow>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
						    <CDataTable
						      	items={this.state.data}
						      	fields={fields}
						      	//columnFilter
						      	tableFilter
						      	footer
						      	itemsPerPageSelect
						      	itemsPerPage={10}
						      	hover
						      	sorter
						      	pagination
						      	scopedSlots = {{
						          	'created_at':
						          	(item)=>(
							            <td>
							              	{moment(item.created_at).format('lll')}
							            </td>
						          	),
						          	'total':
						          	(item)=>(
							            <td>
							              	{this.state.settings.default_currency}{item.total}
							            </td>
						          	)
						      	}}
						    />
			            </CCardBody>
		            </CCard>
		        </CCol>  
		    </CRow>      
	  	)
    }
}

export default view
