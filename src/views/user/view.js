import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  CButton,
  CBadge,
  CInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import {Link} from 'react-router-dom';
import configuration from '../../config';
import _ from 'underscore'

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
        	checkAllSelect:false,
        	modal:false,
        	data:[],
        	selected:[]
        };
    }

    componentDidMount(){
		fetch(configuration.baseURL+"user/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type,) {
		if(this.state.selected.length === 0){
			this.setState({modal: !this.state.modal})
			return;
		}
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"user/action", {
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
				selected.push(element.user_id);
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
		    { key: 'user_id',label:'#ID', _style: { width: '15%'} },
		    { key: 'name', _style: { width: '20%'} },
		    { key: 'email', _style: { width: '30%'} },
		    { key: 'mobile', _style: { width: '20%'} },
		    { key: 'status', _style: { width: '10%'} },
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
	            				<CButton color="primary" className="px-4" onClick={() => this.props.history.push('/user/add') }>Add</CButton>{' '}
	            				<CButton color="primary" className="px-4" onClick={this.handleAction.bind(this, 'active')}>Active</CButton>{' '}
	            				<CButton color="primary" className="px-4" onClick={this.handleAction.bind(this, 'inactive')}>Inactive</CButton>{' '}
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
						              	<CInput type="checkbox" style={{width:'20px', height:'20px'}} onClick={this.checkbox.bind(this,item.user_id)} checked={this.state.selected.includes(item.user_id)===true}/>
						            </td>
					          	),
						      	'user_id':
					          	(item)=>(
						            <td>
						              	<Link to={{ pathname: "/user/edit/"+item.user_id }} > {item.user_id}</Link>
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
					          	'mobile':
					          	(item)=>(
						            <td>
						              	{item.mobile_country_code} {item.mobile}
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
