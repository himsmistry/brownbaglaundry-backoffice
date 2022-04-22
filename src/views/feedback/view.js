import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
} from '@coreui/react';
import configuration from '../../config';

const fields = [
    { key: 'feedback_id',label:'#ID', _style: { width: '15%'} },
    { key: 'name', _style: { width: '20%'} },
    { key: 'type', _style: { width: '10%'} },
    { key: 'message', _style: { width: '35%'} },
    { key: 'rating', _style: { width: '10%'} },
    { key: 'delete',label:'', _style: { width: '10%'} },
]


class view extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	data:[]
        };
    }

    componentDidMount(){
		fetch(configuration.baseURL+"ticket/get-feedback").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type, feedback_id) {
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"ticket/action-feedback", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({ids:[feedback_id], type:type})
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
					          	'delete':
					          	(item)=>(
						            <td>
						              	<img alt="delete icon" src="img/close.png" width="15" onClick={this.handleAction.bind(this, 'delete',item.feedback_id)}/>
						            </td>
					          	),
					          	'type':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	{item.type}
						            </td>
					          	),
					          	'rating':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	{item.rating}
						            </td>
					          	),
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
