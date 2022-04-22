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
    { key: 'language_id',label:'#ID', _style: { width: '15%'} },
    { key: 'title', _style: { width: '50%'} },
    { key: 'code', _style: { width: '10%'} },
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
		fetch(configuration.baseURL+"language/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type, language_id) {
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"language/action", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({ids:[language_id], type:type})
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({showLoader:false})
			this.componentDidMount();
			//this.refs.table.reset();
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
	            				<CButton color="primary" className="px-4" onClick={() => this.props.history.push('/language/add') }>Add</CButton>
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
						      	'language_id':
					          	(item)=>(
						            <td>
						              	<Link to={{ pathname: "/language/edit/"+item.language_id }} > {item.language_id}</Link>
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
						              	<img alt="delete icon" src="img/close.png" width="15" onClick={this.handleAction.bind(this, 'delete',item.language_id)}/>
						            </td>
					          	),
					          	'active_inactive':
					          	(item)=>(
						            <td>
						            	{	item.status==='active' ?
						              		<Switch onChange={this.handleAction.bind(this, 'inactive',item.language_id)} checked={true} onColor="#1e7e34" />
						              		: 
							              	<Switch onChange={this.handleAction.bind(this, 'active',item.language_id)} checked={false} onColor="#1e7e34" />
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
