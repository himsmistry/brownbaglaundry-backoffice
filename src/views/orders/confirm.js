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
		fetch(configuration.baseURL+"order/get?status=confirmed").then((response) => {
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
		    { key: 'customer', _style: { width: '10%'} },
		    { key: 'partner', _style: { width: '10%'} },
		    { key: 'delivery_staff', _style: { width: '10%'} },
		    { key: 'location', _style: { width: '28%'} },
		    { key: 'payment_type', _style: { width: '12%'} },
		    { key: 'total', _style: { width: '10%'} },
		    { key: 'created_at', label:'Created Date',_style: { width: '10%'} },
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
					          	'pickup_date':
						          	(item)=>(
							            <td>
							              	{moment(item.pickup_date).format('ll') +', '+ item.pickup_time}
							            </td>
						          	),
						          	'delivery_date':
						          	(item)=>(
							            <td>
							              	{moment(item.delivery_date).format('ll') +', '+ item.delivery_time}
							            </td>
						          	),
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
						          	),
						          	'payment_type':
						          	(item)=>(
							            <td style={{textTransform:'capitalize'}}>
							              	{item.payment_type}
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
