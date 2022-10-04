import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CLabel,
  CFormText,
  CImg
} from '@coreui/react';
import moment from 'moment';
import configuration from '../../config';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fields = [
    { key: 'contact_us_id',label:'#ID', _style: { width: '15%'} },
    { key: 'name', _style: { width: '20%'} },
    { key: 'type', _style: { width: '10%'} },
    { key: 'message', _style: { width: '45%'} },
    { key: 'delete',label:'', _style: { width: '10%'} },
]


class view extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	data:[],
        	modal:false,
        	item:{},
        	fields:{},
        	errors:{},
        };
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	fields[field] = e.target.value;
    	this.setState({fields})
    }

    componentDidMount(){
		fetch(configuration.baseURL+"ticket/get-contact-us").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ data: data.payload});
		});
	}

	handleAction(type, contact_us_id) {
		this.setState({showLoader:true})
		fetch(configuration.baseURL+"ticket/action-contact-us", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({ids:[contact_us_id], type:type})
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({showLoader:false})
			this.componentDidMount();
		});
	}

	openModal(item){
		this.setState({item, modal:true})
	}

	sendReply(){
		let formIsValid = true;
		let errors = {};
		if(!this.state.fields["answer"]){
            formIsValid = false;
            errors["answer"] = "Please enter answer.";
        }
        this.setState({errors: errors});
        if(formIsValid){
        	let item = this.state.item;
        	item['answer'] = this.state.fields.answer;
        	this.setState({item})
        	fetch(configuration.baseURL+"ticket/send-reply", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:JSON.stringify(item)
			}).then((response) => {
				return response.json();
			}).then((data) => {
				this.setState({modal:false})
				return toast.success('Reply sent successfully.');
			});
        }
	}

    render() {
	  	return (
	  		<CRow>
	  			<ToastContainer position="top-right" autoClose={5000} style={{top:'80px'}}/>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
	  			<CModal 
	              show={this.state.modal} 
	              onClose={() => this.setState({modal:!this.state.modal})}
	              color="info"
            	>
              		<CModalHeader closeButton style={{backgroundColor:'#292d78'}}>
                		<CModalTitle>Reply</CModalTitle>
              		</CModalHeader>
              		<CModalBody>
		                <CRow>
	            			<CCol xs="12" md="12">
	                            <div className="media">
	                               	<div className="mr-10">
	                               	{	this.state.item.profile_picture === '' ? 
	                               		<CImg src="avatars/5.jpg" alt="user profile" className="media-object rounded-circle" width="50" height="50"/>
	                               		:
	                                    <CImg src={this.state.item.profile_picture} alt="user profile" className="media-object rounded-circle" width="50" height="50"/>
	                               	}
	                                </div>
	                               	<div className="media-body">
	                                  	<div className="d-flex justify-content-between">
	                                     	<h5 className="text-primary2">{this.state.item.name}</h5>
	                                     	<p style={{margin: '0',color: 'grey'}}>{moment(this.state.item.created_at).format('llll')}</p>
	                                  	</div>
	                                  	<p>{this.state.item.email}</p>
	                               	</div>
	                            </div>
	                            <p>{this.state.item.message}</p>

	            				<CFormGroup row style={{padding:'10px'}}>
	                                <CLabel htmlFor="name"><strong>Reply</strong></CLabel>
	                                <textarea className="textbox" placeholder="Enter Answer" type="text" onChange={this.handleChange.bind(this, "answer")} value={this.state.fields["answer"]}></textarea>
	                                <CFormText className="help-block">{this.state.errors.answer}</CFormText>
	                            </CFormGroup>	
	            			</CCol>
	            		</CRow>
              		</CModalBody>
              		<CModalFooter>
		                <CButton color="primary" className="px-4" onClick={this.sendReply.bind(this)}>Send Reply</CButton>{' '}
              		</CModalFooter>
        		</CModal>
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
						              	<img alt="delete icon" src="img/close.png" width="15" onClick={this.handleAction.bind(this, 'delete',item.contact_us_id)}/>
						            </td>
					          	),
					          	'type':
					          	(item)=>(
						            <td style={{textTransform:'capitalize'}}>
						              	{item.type}
						            </td>
					          	),
					          	'contact_us_id':
					          	(item)=>(
						            <td onClick={this.openModal.bind(this, item)} style={{color:'#292d78',cursor: 'pointer'}}>
						              	{item.contact_us_id}
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
