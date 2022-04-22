import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  //CBadge,
  CButton,
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

// const getBadge = (status)=>{
//     switch (status) {
//       	case 'active': return 'success'
//       	case 'inactive': return 'danger'
//       	default: return 'primary'
//     }
// }

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
		fetch(configuration.baseURL+"label/get").then((response) => {
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
		fetch(configuration.baseURL+"label/action", {
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
				selected.push(element.label_id);
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
		    //{ key: 'label_id',label:'#ID', _style: { width: '20%'} },
		    //{ key: 'title', _style: { width: '20%'} },
		    { key: 'title', _style: { width: '75%'} },
		    //{ key: 'code', _style: { width: '35%'} },
		    { key: 'type', _style: { width: '20%'} },
		    //{ key: 'status', _style: { width: '10%'} },
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
	            				<CButton color="primary" className="px-4" onClick={() => this.props.history.push('/label/add') }>Add</CButton>{' '}
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
						      	itemsPerPage={50}
						      	hover
						      	sorter
						      	pagination
						      	scopedSlots = {{
						      	'selected':
					          	(item)=>(
						            <td>
						              	<CInput type="checkbox" style={{width:'20px', height:'20px'}} onClick={this.checkbox.bind(this,item.label_id)} checked={this.state.selected.includes(item.label_id)===true}/>
						            </td>
					          	),	
						      	'title':
					          	(item)=>(
						            <td>
						              	<Link to={{ pathname: "/label/edit/"+item.label_id }} > {item.title}</Link>
						            </td>
					          	),
					          	// 'label_id':
					          	// (item)=>(
						          //   <td>
						          //     	<Link to={{ pathname: "/label/edit/"+item.label_id }} > {item.label_id}</Link>
						          //   </td>
					          	// ),
						        // 'status':
					         //  	(item)=>(
						        //     <td style={{textTransform:'capitalize'}}>
						        //       	<CBadge color={getBadge(item.status)}>
						        //         	{item.status}
						        //       	</CBadge>
						        //     </td>
					         //  	),
					          	'type':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	{item.type.split('_').join(' ')}
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
