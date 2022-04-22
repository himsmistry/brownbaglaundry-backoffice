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
      	case 'success': return 'success'
      	case 'failure': return 'danger'
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
        	selected:[]
        };
    }

    componentDidMount(){
		fetch(configuration.baseURL+"notification-log/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type) {
		if(this.state.selected.length === 0){
			this.setState({modal: !this.state.modal})
			return;
		}
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"notification-log/action", {
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
				selected.push(element.notification_log_id);
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
		    { key: 'notification_log_id',label:'#ID', _style: { width: '15%'} },
		    { key: 'user_id', _style: { width: '20%'} },
		    { key: 'user_type', _style: { width: '10%'} },
		    { key: 'description', _style: { width: '50%'} },
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
						              	<CInput type="checkbox" style={{width:'20px', height:'20px'}} onClick={this.checkbox.bind(this,item.notification_log_id)} checked={this.state.selected.includes(item.notification_log_id)===true}/>
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
					          	'user_type':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	{item.user_type}
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
