import React,{Component} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CWidgetProgressIcon,
  CDataTable,
  CFormGroup,
  CLabel,
  CSelect,
} from '@coreui/react'
import {
  CChartBar,
  CChartLine
} from '@coreui/react-chartjs'
import Session from '../../session';
import CIcon from '@coreui/icons-react';
import configuration from '../../config';
import _ from 'underscore';

class Dashboard extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	orders:[],
        	settings:{default_currency:'$'},
        	statistics:{
        		customer:0,
        		order:0,
        		staff:0,
        		category:0,
        		addon:0,
        		package:0
        	},
        	earnings:[],
        	sales:[],
        	saleyear:new Date().getFullYear(),
        	earnyear:new Date().getFullYear(),
        	years:[]
        };
    }

    componentDidMount(){
    	fetch(configuration.baseURL+"dashboard/statistics").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ statistics: data.payload});
		});
		fetch(configuration.baseURL+"dashboard/earnings").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ earnings: data.payload});
		});
		fetch(configuration.baseURL+"dashboard/sales").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ sales: data.payload});
		});
		fetch(configuration.baseURL+"order/get?type=dashboard").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ orders: data.payload});
		});
		fetch(configuration.baseURL+"settings/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ settings: data.payload});
		});
		let currentYear = new Date().getFullYear();
		let years = [currentYear, 2020]
		for (var i=1; i<6; i++){
			years.push(currentYear + i)
		}
		this.setState({years:_.uniq(years)})
	}

	changeYearSales(e){
		this.setState({saleyear: e.target.value})
		fetch(configuration.baseURL+"dashboard/sales?year="+e.target.value).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ sales: data.payload});
		});
	}

	changeYearEarn(e){
		this.setState({earnyear: e.target.value})
		fetch(configuration.baseURL+"dashboard/earnings?year="+e.target.value).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ earnings: data.payload});
		});
	}

    render() {
    	const fields = [
		    { key: 'order_id',label:'#ID', _style: { width: '15%'} },
		    { key: 'customer',label:'Name', _style: { width: '15%'} },
		    { key: 'customer_mobile',label:'Mobile No', _style: { width: '15%'} },
		    { key: 'service', _style: { width: '30%'} },
		    { key: 'total', _style: { width: '10%'} },
		    { key: 'status', _style: { width: '10%'} },
		]
	  	return (
	  		<div>
	  			<Session/>
				<CRow>    
				    <CCol xs="12" md="12">  	
				      	<CCard>
				        	<CCardHeader>
				          		Sales
				        	</CCardHeader>
				        	<CCardBody>
				        		<CFormGroup row>
								    <CCol md="1">
								        <CLabel>Select Year</CLabel>
								    </CCol>
								    <CCol md="2">
								        <CSelect onChange={this.changeYearSales.bind(this)} value={this.state.saleyear}>
								            {
								                this.state.years.map((val, index) => {
								                    return <option key={index} value={val}>{val}</option>
								                })
								            }
								        </CSelect>
								    </CCol>
								</CFormGroup>
					          	<CChartLine
						            datasets={[
						              	{
							                label: 'Total Sales',
							                backgroundColor: 'rgb(228,102,81,0.9)',
							                data: this.state.sales
						              	}
						            ]}
						            options={{
						              	tooltips: {
						                	enabled: true
						              	}
						            }}
						            labels="months"
						        />
				        	</CCardBody>
				      	</CCard>
				    </CCol>
		  		</CRow>
		  		<CRow>
		  			<CCol xs="12" md="12">
					    <CCard>
				        	<CCardHeader>
				          		Earnings
				        	</CCardHeader>
				        	<CCardBody>
				        		<CFormGroup row>
								    <CCol md="1">
								        <CLabel>Select Year</CLabel>
								    </CCol>
								    <CCol md="2">
								        <CSelect onChange={this.changeYearEarn.bind(this)} value={this.state.earnyear}>
								            {
								                this.state.years.map((val, index) => {
								                    return <option key={index} value={val}>{val}</option>
								                })
								            }
								        </CSelect>
								    </CCol>
								</CFormGroup>
					          	<CChartBar
					            	datasets={[
						              	{
							                label: 'Total Earnings',
							                backgroundColor: '#292d78',
							                data: this.state.earnings,
						              	}
					            	]}
					            	labels="months"
					            	options={{
					              		tooltips: {
					                		enabled: true
					              		}
					            	}}
					          	/>
				        	</CCardBody>
				      	</CCard>
				    </CCol>
				</CRow>
		  		<CRow>
			        <CCol sm="6" md="4">
				        <CWidgetProgressIcon
				            header={this.state.statistics.customer}
				            text="Customers"
				            color="gradient-info"
				            inverse
				         >
			            	<CIcon name="cil-people" height="36"/>
			          	</CWidgetProgressIcon>
			        </CCol>
			        <CCol sm="6" md="4">
			          	<CWidgetProgressIcon
				            header={this.state.statistics.staff}
				            text="Delivery Staffs"
				            color="gradient-warning"
				            inverse
			          	>
			            	<CIcon name="cil-basket" height="36"/>
			          	</CWidgetProgressIcon>
			        </CCol>
			        <CCol sm="6" md="4">
			          	<CWidgetProgressIcon
				            header={this.state.statistics.order}
				            text="Orders"
				            color="gradient-success"
				            inverse
			          	>
			            	<CIcon name="cil-userFollow" height="36"/>
			          	</CWidgetProgressIcon>
			        </CCol>
			    </CRow>
			    <CRow>    
			        <CCol sm="6" md="4">
			          	<CWidgetProgressIcon
				            header={this.state.statistics.category}
				            text="Service Categories"
				            color="gradient-primary"
				            inverse
			          	>
			            	<CIcon name="cil-chartPie" height="36"/>
			          	</CWidgetProgressIcon>
			        </CCol>
			        <CCol sm="6" md="4">
			          	<CWidgetProgressIcon
				            header={this.state.statistics.addon}
				            text="Service Addons"
				            color="gradient-danger"
				            inverse
			          	>
			            	<CIcon name="cil-speedometer" height="36"/>
			          	</CWidgetProgressIcon>
			        </CCol>
			        <CCol sm="6" md="4">
			          	<CWidgetProgressIcon
				            header={this.state.statistics.package}
				            text="Packages"
				            color="gradient-info"
				            inverse
			          	>
			            	<CIcon name="cil-speech" height="36"/>
			          	</CWidgetProgressIcon>
			        </CCol>
		      	</CRow>
		      	<CRow>
		  			<CCol xs="12" md="12">
					    <CCard>
				        	<CCardHeader>
				          		Latest Orders
				        	</CCardHeader>
				        	<CCardBody>
					          	<CCardBody>
								    <CDataTable
								      	items={this.state.orders}
								      	fields={fields}
								      	//columnFilter
								      	tableFilter
								      	//footer
								      	itemsPerPageSelect
								      	itemsPerPage={10}
								      	hover
								      	sorter
								      	pagination
								      	scopedSlots = {{
								          	'status':
								          	(item)=>(
									            <td style={{textTransform:'capitalize'}}>
									              	{item.status}
									            </td>
								          	),
								          	'total':
								          	(item)=>(
									            <td>
									              	{this.state.settings.default_currency}{item.total}
									            </td>
								          	),
								      	}}
								    />
					            </CCardBody>
				        	</CCardBody>
				      	</CCard>
				    </CCol>
				</CRow>
		  	</div>	
	  	)
    }
}

export default Dashboard
