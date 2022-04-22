import React, {Component} from 'react'
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CDataTable,
  CTabs,
  CTabPane,
  CTabContent,
  CNav,
  CNavItem,
  CNavLink,
  CButton
} from '@coreui/react'
import {Link} from 'react-router-dom';
import configuration from '../../config';
import moment from 'moment';
let customer_id;


class profile extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
            fields:{addresses:[]},
            data:[],
            settings:{default_currency:'$'}
        };
    }

    componentDidMount(){
        var url = window.location.href;
        customer_id=url.substring(url.lastIndexOf('/') + 1);
        
        fetch(configuration.baseURL+"customer/profile?customer_id="+customer_id).then((response) =>{
            return response.json();
        }).then((data)=> {
            this.setState({ fields: data.payload});
        });

        fetch(configuration.baseURL+"order/get?status=delivered&customer_id="+customer_id).then((response) => {
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

    render() {
        const fields = [
            { key: 'order_id',label:'#ID', _style: { width: '10%'} },
            { key: 'customer', _style: { width: '10%'} },
            { key: 'partner', _style: { width: '10%'} },
            { key: 'delivery_staff', _style: { width: '10%'} },
            { key: 'location', _style: { width: '13%'} },
            { key: 'pickup_date', label:'Pickup',_style: { width: '10%'} },
            { key: 'delivery_date', label:'Delivery',_style: { width: '10%'} },
            { key: 'payment_type', _style: { width: '10%'} },
            { key: 'total', _style: { width: '7%'} },
            { key: 'created_at', label:'Date',_style: { width: '10%'} },
        ]
	  	return (
            <CRow>
                <div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
                <div className="col-sm-12">
                    <CButton color="primary" className="px-4" onClick={() => this.props.history.push('/customer/view')}>Back</CButton>
                    <div className="card hovercard text-center" style={{marginTop:'10px'}}>
                        <div  className="cardheader"></div>
                        <div className="user-image">
                            <div className="avatar">
                                {   this.state.fields.profile_picture === '' ?
                                    <img alt="" src="/img/7.jpg"/> : <img alt="" src={this.state.fields.profile_picture}/>
                                }
                            </div>
                        </div>
                     <div className="info">
                        <div className="row">
                           <div className="col-sm-6 col-lg-4 order-sm-1 order-xl-0">
                              <div className="row">
                                 <div className="col-md-8">
                                    <div className="ttl-info text-left">
                                       <h6><i className="fa fa-envelope"></i>&nbsp;&nbsp;&nbsp;Email</h6>
                                       <span>{this.state.fields.email}</span>
                                    </div>
                                 </div>
                                 <div className="col-md-4">
                                    <div className="ttl-info text-left">
                                       <h6><i className="fa fa-registered"></i>&nbsp;&nbsp;&nbsp;Register Type</h6>
                                       <span style={{textTransform: 'capitalize'}}>{this.state.fields.register_type}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-sm-12 col-lg-4 order-sm-0 order-xl-1">
                              <div className="user-designation">
                                 <div className="title">{this.state.fields.name}</div>
                              </div>
                           </div>
                           <div className="col-sm-6 col-lg-4 order-sm-2 order-xl-2">
                              <div className="row">
                                 <div className="col-md-6">
                                    <div className="ttl-info text-left">
                                       <h6><i className="fa fa-phone"></i>&nbsp;&nbsp;&nbsp;Mobile No</h6>
                                       <span>{this.state.fields.mobile_country_code} {this.state.fields.mobile}</span>
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="ttl-info text-left">
                                       <h6><i className="fa fa-location-arrow"></i>&nbsp;&nbsp;&nbsp;Player ID</h6>
                                       <span>{this.state.fields.player_id || null}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                    </div>
                    <CRow>
                        <CCol>
                            <CCard>
                                <CCardBody>
                                    <CTabs>
                                        <CNav variant="tabs">
                                            <CNavItem>
                                                <CNavLink>
                                                    Orders
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink>
                                                    Address
                                                </CNavLink>
                                            </CNavItem>
                                        </CNav>
                                        <CTabContent>
                                            <CTabPane>
                                                <CRow xs="12" md="12" style={{margin:'15px 0'}}>
                                                    <CCol>
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
                                                                'order_id':
                                                                (item)=>(
                                                                    <td>
                                                                        <Link to={{ pathname: "/order/detail/"+item.order_id }} > {item.order_id}</Link>
                                                                    </td>
                                                                ),
                                                                'pickup_date':
                                                                (item)=>(
                                                                    <td>
                                                                        {moment(item.pickup_date).format('ll') +', '+ item.pickup_time}
                                                                    </td>
                                                                ),
                                                                'delivery_date':
                                                                (item)=>(
                                                                    <td>
                                                                        {moment(item.delivery_date).format('ll') +', '+ item.delivery_time}
                                                                    </td>
                                                                ),
                                                                'created_at':
                                                                (item)=>(
                                                                    <td>
                                                                        {moment(item.created_at).format('lll')}
                                                                    </td>
                                                                ),
                                                                'total':
                                                                (item)=>(
                                                                    <td>
                                                                        {this.state.settings.default_currency}{item.total}
                                                                    </td>
                                                                ),
                                                                'payment_type':
                                                                (item)=>(
                                                                    <td style={{textTransform:'capitalize'}}>
                                                                        {item.payment_type}
                                                                    </td>
                                                                )
                                                            }}
                                                        />
                                                    </CCol>
                                                </CRow>    
                                            </CTabPane>
                                            <CTabPane> 
                                                <CRow xs="12" md="12" style={{margin:'15px 0'}}>
                                                    <CCol>
                                                        <div className="paddy15 row">
                                                            {
                                                                this.state.fields.addresses.map((e, key) => {
                                                                    let val = e.type.toLowerCase();
                                                                    return <div className="col-12 col-md-4" key={key}>
                                                                        <div className="custome-card" style={{minHeight: '200px'}}>
                                                                            <div className="card-body">
                                                                                <div className="text-center">
                                                                                    {   val==='work' ?
                                                                                        <img src="/img/work.png" className="rounded" width="50" height="50" alt=""/>
                                                                                        : (val==='home' ? <img src="/img/home.png" className="rounded" width="50" height="50" alt=""/> : <img src="/img/other.png" className="rounded" width="50" height="50" alt=""/>)
                                                                                    }
                                                                                    <div className="mt-2 card-title" style={{textTransform: 'capitalize'}}>{e.type}</div>
                                                                                    <div className="card-subtitle"><i className="fa fa-map-marker" aria-hidden="true"></i> {e.address}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>;
                                                                })
                                                            }
                                                        </div>
                                                    </CCol>
                                                </CRow>    
                                            </CTabPane>
                                        </CTabContent>
                                    </CTabs>        
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
            </CRow>    		
        )
    }
}

export default profile
