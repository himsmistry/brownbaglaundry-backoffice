import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  CButton
} from '@coreui/react';
import {Link} from 'react-router-dom';
import configuration from '../../config';

const fields = [
    { key: 'emailtemplate_id',label:'#ID', _style: { width: '15%'} },
    { key: 'title', _style: { width: '20%'} },
    { key: 'code', _style: { width: '60%'} },
    { key: 'delete',label:'', _style: { width: '5%'} },
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
		fetch(configuration.baseURL+"email/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type, emailtemplate_id) {
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"email/action", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({ids:[emailtemplate_id], type:type})
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
	            				<CButton color="primary" className="px-4" onClick={() => this.props.history.push('/email/add') }>Add</CButton>
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
						      	'emailtemplate_id':
					          	(item)=>(
						            <td>
						              	<Link to={{ pathname: "/email/edit/"+item.emailtemplate_id }} > {item.emailtemplate_id}</Link>
						            </td>
					          	),
					          	'delete':
					          	(item)=>(
						            <td>
						              	<img alt="delete icon" src="img/close.png" width="15" onClick={this.handleAction.bind(this, 'delete',item.emailtemplate_id)}/>
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
