import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  CBadge,
  CButton
} from '@coreui/react';
import {Link} from 'react-router-dom';
import configuration from '../../config';
import Switch from '@material-ui/core/Switch';

const fields = [
    { key: 'coupon_id',label:'#ID', _style: { width: '10%'} },
    { key: 'title', _style: { width: '13%'} },
    { key: 'coupon_code', label:'Code',_style: { width: '12%'} },
    { key: 'start_date', _style: { width: '10%'} },
    { key: 'end_date', _style: { width: '10%'} },
    { key: 'total_usage',label:'Usage', _style: { width: '5%'} },
    { key: 'total_used', label:'Used',_style: { width: '5%'} },
	{ key: 'type', _style: { width: '4%' } },
	{ key: 'coupon_type', _style: { width: '4%' } },
    { key: 'value', _style: { width: '5%'} },
    { key: 'status', _style: { width: '10%'} },
    { key: 'active_inactive',label:'Action', _style: { width: '10%'} },
    { key: 'delete',label:'', _style: { width: '5%'} },
]

const getBadge = (status)=>{
    switch (status) {
      	case 'active': return 'success'
      	case 'inactive': return 'danger'
      	default: return 'primary'
    }
}

class view extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	data:[]
        };
    }

    componentDidMount(){
		fetch(configuration.baseURL+"coupon/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type, coupon_id) {
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"coupon/action", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({ids:[coupon_id], type:type})
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({showLoader:false})
			this.componentDidMount();
		});
	}

    render() {
	  	return (
	  		<CRow>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<p>
	            				<CButton color="primary" className="px-4" onClick={() => this.props.history.push('/coupon/add') }>Add</CButton>
	            			</p>
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
						      	'coupon_id':
					          	(item)=>(
						            <td>
						              	<Link to={{ pathname: "/coupon/edit/"+item.coupon_id }} > {item.coupon_id}</Link>
						            </td>
					          	),
					          	'type':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	{item.type}
						            </td>
					          	),
						        'status':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	<CBadge color={getBadge(item.status)}>
						                	{item.status}
						              	</CBadge>
						            </td>
					          	),
					          	'delete':
					          	(item)=>(
						            <td>
						              	<img alt="delete icon" src="img/close.png" width="15" onClick={this.handleAction.bind(this, 'delete',item.coupon_id)}/>
						            </td>
					          	),
					          	'active_inactive':
					          	(item)=>(
						            <td>
						            	{	item.status==='active' ?
						              		<Switch onChange={this.handleAction.bind(this, 'inactive',item.coupon_id)} checked={true} onColor="#1e7e34" />
						              		: 
							              	<Switch onChange={this.handleAction.bind(this, 'active',item.coupon_id)} checked={false} onColor="#1e7e34" />
							              }
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
