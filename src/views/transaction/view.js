import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  CBadge,
  CInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import configuration from '../../config';
import _ from 'underscore'

const getBadge = (status)=>{
    switch (status) {
      	case 'Success': return 'success'
      	case 'Failure': return 'danger'
      	default: return 'primary'
    }
}


class view extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	checkAllSelect:false,
        	modal:false,
        	data:[],
        	selected:[],
        	settings:{default_currency:'$'}
        };
    }

    componentDidMount(){
		fetch(configuration.baseURL+"transaction/get").then((response) => {
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

	handleAction(type) {
		if(this.state.selected.length === 0){
			this.setState({modal: !this.state.modal})
			return;
		}
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"transaction/action", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({ids:this.state.selected, type:type})
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({showLoader:false, selected:[], checkAllSelect:false})
			this.componentDidMount();
		});
	}

	checkbox(id){
		let selected = this.state.selected;
        if(selected.includes(id)===false){
            selected.push(id);        
        }
        else{
            selected.splice( selected.indexOf(id), 1 );
        }
        this.setState({selected});
        if(selected.length !== this.state.data.length){
        	this.setState({checkAllSelect:false});
        }
	}

	selectall(){
		if(this.state.checkAllSelect === false){
			let selected = this.state.selected;
			_.each(this.state.data, (element) => {
				selected.push(element.transaction_id);
			});
			this.setState({selected, checkAllSelect:!this.state.checkAllSelect});
		}
		else{
			this.setState({selected:[], checkAllSelect:!this.state.checkAllSelect});
		}
	}

    render() {
    	const fields = [
			{ key: 'selected',label:<CInput type="checkbox" style={{width:'20px', height:'20px'}} onClick={this.selectall.bind(this)} checked={this.state.checkAllSelect}/>, _style: { width: '5%'} },
		    { key: 'transaction_id',label:'#ID', _style: { width: '15%'} },
		    { key: 'payment_transaction_id', label:'Transaction ID', _style: { width: '15%'} },
		    { key: 'order_id', _style: { width: '15%'} },
		    { key: 'customer', _style: { width: '10%'} },
		    { key: 'partner', _style: { width: '10%'} },
		    { key: 'delivery_staff', _style: { width: '10%'} },
		    { key: 'charge', _style: { width: '10%'} },
		    { key: 'payment_type', _style: { width: '10%'} },
		]
	  	return (
	  		<CRow>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
	  			<CModal 
	              show={this.state.modal} 
	              onClose={() => this.setState({modal:!this.state.modal})}
	              color="danger"
            	>
              		<CModalHeader closeButton>
                		<CModalTitle>Message</CModalTitle>
              		</CModalHeader>
              		<CModalBody>
		                Please select atleast one row.
              		</CModalBody>
              		<CModalFooter>
		                <CButton color="danger" onClick={() => this.setState({modal:!this.state.modal})}>Close</CButton>{' '}
              		</CModalFooter>
        		</CModal>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<p>
	            				<CButton color="danger" className="px-4" onClick={this.handleAction.bind(this, 'delete')}>Delete</CButton>
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
						      	'selected':
					          	(item)=>(
						            <td>
						              	<CInput type="checkbox" style={{width:'20px', height:'20px'}} onClick={this.checkbox.bind(this,item.transaction_id)} checked={this.state.selected.includes(item.transaction_id)===true}/>
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
					          	'charge':
						          	(item)=>(
							            <td>
							              	{this.state.settings.default_currency}{item.charge}
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
