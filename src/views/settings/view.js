import React,{Component} from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabPane,
  CTabContent,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCardFooter,
  CButton
} from '@coreui/react'
import moment from 'moment';
import configuration from '../../config';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import U from 'underscore';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import Switch from '@material-ui/core/Switch';
import MultipleDatePicker from "react-multiple-datepicker";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

let mapRef;
const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g"
});

class Settings extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	showLoader:false,
        	fields:{},
        	mainArray:[],
            flyTo: { center: [-74.2598687, 40.6976701], zoom: 10 , speed: 1 },
            address:'',
            switch:false,
            switchPayment:false,
            switchTax:false,
            holidays:[]
        };
    }

    handleChange(field, e){
    	let fields = this.state.fields
    	if(field === "is_app_live"){
            fields[field] = !this.state.switch;        
            this.setState({switch:!this.state.switch})        
        }
        else if(field === "tax_enabled"){
            fields[field] = !this.state.switchTax;        
            this.setState({switchTax:!this.state.switchTax})        
        }
        else if(field === "is_payment_live"){
            fields[field] = !this.state.switchPayment;        
            this.setState({switchPayment:!this.state.switchPayment})        
        }
        else if(field === "from_time_mon_fri" || field === "to_time_mon_fri" || field === "from_time_sat_sun" || field === "to_time_sat_sun"){
            fields[field] = e;
            if(field === "from_time_mon_fri"){
                fields['from_time_mon_fri_formatted'] = moment(new Date(e)).format('HH:mm');
            }
            if(field === "to_time_mon_fri"){
                fields['to_time_mon_fri_formatted'] = moment(new Date(e)).format('HH:mm');
            } 
            if(field === "from_time_sat_sun"){
                fields['from_time_sat_sun_formatted'] = moment(new Date(e)).format('HH:mm');
            } 
            if(field === "to_time_sat_sun"){
                fields['to_time_sat_sun_formatted'] = moment(new Date(e)).format('HH:mm');
            }
            console.log(moment(new Date(e)).format('HH:mm'))     
        }
        else{
    		fields[field] = e.target.value;
        }
    	this.setState({fields})
    }

    componentDidMount(){
    	fetch(configuration.baseURL+"settings/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ fields: data.payload, holidays:data.payload.holidays});
			if(data.payload.original_areas){
                this.setState({mainArray:data.payload.original_areas, switch:data.payload.is_app_live,switchTax:data.payload.tax_enabled, switchPayment:data.payload.is_payment_live});
                this.setState({ flyTo: { center: [parseFloat(-74.106318), parseFloat(40.805689)], zoom: 10, speed: 1 } });
            }
		});
    }

    submit(){
    	this.setState({showLoader:true})
		fetch(configuration.baseURL+"settings/update", {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify(this.state.fields)
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({showLoader:false})
			return toast.success('Data updated successfully.');
		});
    }

    submitHolidays(){
        let holidays = [];
        if(this.state.selectedDates.length > 0){
            U.each(this.state.selectedDates, (elem) => {
                holidays.push(moment(elem).format('YYYY-MM-DD'))
            });
        }
        holidays.push(this.state.holidays);
        holidays = U.uniq(U.flatten(holidays))
        this.setState({showLoader:true})
        fetch(configuration.baseURL+"settings/update", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({holidays:holidays, formatedHolidaysDates: this.state.selectedDates})
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({showLoader:false});
            this.componentDidMount();
            return toast.success('Dates updated successfully.');
        });
    }

    deleteDate(date){
        this.setState({showLoader:true})
        fetch(configuration.baseURL+"settings/update", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({date:date, type:'delete_date'})
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({showLoader:false})
            this.componentDidMount();
            return toast.success('Dates updated successfully.');
        });
    }

    // FOR SERVICE AREA

    onDrawCreate({ features }) {
        let mainArray=this.state.mainArray;
        let coordinates={};
        for(let i=0; i < features.length; i++){
            coordinates.id=features[i].id;
            coordinates.arr=features[i].geometry.coordinates[i];
        }
        mainArray.push(coordinates)
        this.setState({mainArray});
    };

    onDrawUpdate ({ features }) {
        let mainArray=this.state.mainArray;
        for(let i=0; i < mainArray.length; i++){
            if(mainArray[i].id === features[0].id){
                mainArray[i].arr = features[0].geometry.coordinates[0];
            }
        }
        this.setState({mainArray});
    };

    onDrawDelete ({ features }) {
        let newArr=[];
        U.each(this.state.mainArray, function(element, index, list) {
            if (element.id !== features[0].id) {
                newArr.push(element);
            }
        })
        this.setState({mainArray:newArr});
    };

    handleChangeAddress (address) {
        this.setState({ address});
    };

    handleSelect (selected) {
        this.setState({ address: selected });
        geocodeByAddress(selected)
        .then(res => getLatLng(res[0]))
        .then(({ lat, lng }) => {
            this.setState({ flyTo: { center: [lng, lat], zoom: 12, speed: 1 } });
            mapRef=this.map.state.map;
            this.mapDidLoad(mapRef);
        })
        .catch(error => {
            console.log('error', error);
        });
    };

    handleCloseClick () {
        this.setState({address: ''});
        this.setState({ flyTo: { center: [72.57136209999999, 23.022505], zoom: 12, speed: 1 } });
        this.mapDidLoad(mapRef);
    };

    mapDidLoad(map) {
        map.flyTo(this.state.flyTo);
    }

    onFeatureClick(id,e){
        e.feature = JSON.parse(JSON.stringify(e.feature));
        e.feature.id = id;
        this.drawControl.draw.add(e.feature);
    }

    // componentWillUnmount(){
    //     window.location.reload();
    // }

    saveArea(){
    	if(this.state.mainArray.length === 0){
    		return toast.error('Please select delivery area.');
        }
        else{
        	this.setState({showLoader:true})
			fetch(configuration.baseURL+"settings/update-service-area", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body:JSON.stringify({delivery_areas: this.state.mainArray})
			}).then((response) => {
				return response.json();
			}).then((data) => {
				this.setState({showLoader:false})
				return toast.success('Service area updated successfully.');
			});
        }
    }

    render() {
    	let controls={
            polygon:true,
            trash:true
        }
        let polygonPaint = Map.FillPaint = {
           'fill-color': "#ff0000",
           'fill-opacity': 0.3
        }
	  	return (
		    <CRow>
		    	<ToastContainer position="top-right" autoClose={5000} style={{top:'80px'}}/>
	  			<div className="loader-img" style={{display: this.state.showLoader ? 'block' : 'none' }}></div>
        		<CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<CTabs>
				              	<CNav variant="tabs">
					                <CNavItem>
					                  	<CNavLink>
					                    	General
					                  	</CNavLink>
					                </CNavItem>
					                <CNavItem>
					                  	<CNavLink>
					                    	Social
					                  	</CNavLink>
					                </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                            Holidays
                                        </CNavLink>
                                    </CNavItem>
				              	</CNav>
				              	<CTabContent>
					                <CTabPane>
					                  	<CRow>
					                		<CCol xs="12" md="12">
					                			<CCard>
	            									<CCardBody>
									                  	<CForm className="form-horizontal">
											                <CFormGroup row>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-title">Call US</CLabel>
											                    	<CInput type="text" placeholder="Enter mobile number" onChange={this.handleChange.bind(this,'call_us')} value={this.state.fields.call_us} />
											                  	</CCol>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-code">Support Email</CLabel>
											                    	<CInput type="text" placeholder="Enter email" onChange={this.handleChange.bind(this,'support_email')} value={this.state.fields.support_email} />
											                  	</CCol>
											                </CFormGroup>
											                {/*<CFormGroup row>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-title">VAT (%)</CLabel>
											                    	<CInput type="number" placeholder="Enter VAT percentage" onChange={this.handleChange.bind(this,'tax_percentage')} value={this.state.fields.tax_percentage} />
											                  	</CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">VAT Enabled ?</CLabel><br/>
                                                                    <Switch onChange={this.handleChange.bind(this, 'tax_enabled')} checked={this.state.switchTax} onColor="#1e7e34" />
                                                                </CCol>
											                </CFormGroup>*/}
											                <CFormGroup row>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-code">Delivery boy arrive time (In mins)</CLabel>
											                    	<CInput type="number" placeholder="Enter arrive time" onChange={this.handleChange.bind(this,'delivery_boy_arrive_time')} value={this.state.fields.delivery_boy_arrive_time} />
											                  	</CCol>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-title">Default Currency</CLabel>
											                    	<CInput type="text" placeholder="Enter currency" onChange={this.handleChange.bind(this,'default_currency')} value={this.state.fields.default_currency} />
											                  	</CCol>
											                </CFormGroup>
                                                            <CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Company Address</CLabel>
                                                                    <CInput type="text" placeholder="Enter address" onChange={this.handleChange.bind(this,'company_address')} value={this.state.fields.company_address} />
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">3 HRS Express Service Charge(%)</CLabel>
                                                                    <CInput type="number" placeholder="Enter charge" onChange={this.handleChange.bind(this,'express_service_charge')} value={this.state.fields.express_service_charge} />
                                                                </CCol>
                                                            </CFormGroup>
                                                            <CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Min Required Weight (For Brown Bag Signature) (In lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter min required weight" onChange={this.handleChange.bind(this,'min_required_weight_all_service')} value={this.state.fields.min_required_weight_all_service} />
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Weight Price($) (For Brown Bag Signature) (for 1 lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter weight price" onChange={this.handleChange.bind(this,'weight_price_all_service')} value={this.state.fields.weight_price_all_service} />
                                                                </CCol>
                                                            </CFormGroup>
                                                            <CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Min Required Weight (Pickup & Delivery) (In lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter min required weight" onChange={this.handleChange.bind(this,'min_required_weight_pickup_delivery')} value={this.state.fields.min_required_weight_pickup_delivery} />
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Weight Price($) (Pickup & Delivery) (for 1 lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter weight price" onChange={this.handleChange.bind(this,'weight_price_pickup_delivery')} value={this.state.fields.weight_price_pickup_delivery} />
                                                                </CCol>
                                                            </CFormGroup>  
                                                            {/*<CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Min Required Weight (Drop Off) (In lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter min required weight" onChange={this.handleChange.bind(this,'min_required_weight_dropoff')} value={this.state.fields.min_required_weight_dropoff} />
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Weight Price($) (Drop Off) (for 1 lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter weight price" onChange={this.handleChange.bind(this,'weight_price_dropoff')} value={this.state.fields.weight_price_dropoff} />
                                                                </CCol>
                                                            </CFormGroup>*/}
                                                            <CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Time (Mon to Fri)</CLabel>
                                                                    <CInput type="string" placeholder="Enter display time" onChange={this.handleChange.bind(this,'display_time_mon_fri')} value={this.state.fields.display_time_mon_fri} />
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Time (Sat to Sun)</CLabel>
                                                                    <CInput type="string" placeholder="Enter display time" onChange={this.handleChange.bind(this,'display_time_sat_sun')} value={this.state.fields.display_time_sat_sun} />
                                                                </CCol>
                                                            </CFormGroup>
                                                            <CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Is App Live ?</CLabel><br/>
                                                                    <Switch onChange={this.handleChange.bind(this, 'is_app_live')} checked={this.state.switch} onColor="#1e7e34" />
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Is Payment Live ?</CLabel><br/>
                                                                    <Switch onChange={this.handleChange.bind(this, 'is_payment_live')} checked={this.state.switchPayment} onColor="#1e7e34" />
                                                                </CCol>
                                                            </CFormGroup>
                                                            <CFormGroup row>    
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-Status">From Time (Mon to Fri)</CLabel><br/>
                                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                        <KeyboardTimePicker
                                                                            margin="normal"
                                                                            id="time-picker"
                                                                            value={this.state.fields.from_time_mon_fri}
                                                                            onChange={this.handleChange.bind(this, 'from_time_mon_fri')}
                                                                            KeyboardButtonProps={{
                                                                                'aria-label': 'change time',
                                                                            }}
                                                                        />
                                                                    </MuiPickersUtilsProvider><br/>
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-Status">To Time (Mon to Fri)</CLabel><br/>
                                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                        <KeyboardTimePicker
                                                                            margin="normal"
                                                                            id="time-picker"
                                                                            value={this.state.fields.to_time_mon_fri}
                                                                            onChange={this.handleChange.bind(this, 'to_time_mon_fri')}
                                                                            KeyboardButtonProps={{
                                                                                'aria-label': 'change time',
                                                                            }}
                                                                        />
                                                                    </MuiPickersUtilsProvider><br/>
                                                                </CCol>
                                                            </CFormGroup>
                                                            <CFormGroup row>    
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-Status">From Time (Sat to Sun)</CLabel><br/>
                                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                        <KeyboardTimePicker
                                                                            margin="normal"
                                                                            id="time-picker"
                                                                            value={this.state.fields.from_time_sat_sun}
                                                                            onChange={this.handleChange.bind(this, 'from_time_sat_sun')}
                                                                            KeyboardButtonProps={{
                                                                                'aria-label': 'change time',
                                                                            }}
                                                                        />
                                                                    </MuiPickersUtilsProvider><br/>
                                                                </CCol>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-Status">To Time (Sat to Sun)</CLabel><br/>
                                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                        <KeyboardTimePicker
                                                                            margin="normal"
                                                                            id="time-picker"
                                                                            value={this.state.fields.to_time_sat_sun}
                                                                            onChange={this.handleChange.bind(this, 'to_time_sat_sun')}
                                                                            KeyboardButtonProps={{
                                                                                'aria-label': 'change time',
                                                                            }}
                                                                        />
                                                                    </MuiPickersUtilsProvider><br/>
                                                                </CCol>
                                                            </CFormGroup>
                                                            <CFormGroup row>
                                                                <CCol md="6">
                                                                    <CLabel htmlFor="hf-title">Weight Price (For Well Heeded) (Per lbs)</CLabel>
                                                                    <CInput type="number" placeholder="Enter min required weight" onChange={this.handleChange.bind(this,'weight_price_well_heeded')} value={this.state.fields.weight_price_well_heeded} />
                                                                </CCol>
                                                            </CFormGroup> 	
											            </CForm>    
	            									</CCardBody>
	            									<CCardFooter>
										            	<CButton color="primary" className="px-4" onClick={this.submit.bind(this)}>Submit</CButton>{' '}
										            </CCardFooter>
	            								</CCard>	
					                		</CCol>
					                	</CRow>
					                </CTabPane>
					                <CTabPane>
					                	<CRow>
					                		<CCol xs="12" md="12">
					                			<CCard>
	            									<CCardBody>
									                  	<CForm className="form-horizontal">
											                <CFormGroup row>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-title">Facebook URL</CLabel>
											                    	<CInput type="text" placeholder="Enter fb url" onChange={this.handleChange.bind(this,'fb_url')} value={this.state.fields.fb_url} />
											                  	</CCol>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-code">Twitter URL</CLabel>
											                    	<CInput type="text" placeholder="Enter twitter url" onChange={this.handleChange.bind(this,'twitter_url')} value={this.state.fields.twitter_url} />
											                  	</CCol>
											                </CFormGroup>
											                <CFormGroup row>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-title">LinkedIn URL</CLabel>
											                    	<CInput type="text" placeholder="Enter linkedin url" onChange={this.handleChange.bind(this,'linkedin_url')} value={this.state.fields.linkedin_url} />
											                  	</CCol>
											                  	<CCol md="6">
											                    	<CLabel htmlFor="hf-code">Instagram URL</CLabel>
											                    	<CInput type="text" placeholder="Enter instagram url" onChange={this.handleChange.bind(this,'instagram_url')} value={this.state.fields.instagram_url} />
											                  	</CCol>
											                </CFormGroup>
											            </CForm>    
	            									</CCardBody>
	            									<CCardFooter>
										            	<CButton color="primary" className="px-4" onClick={this.submit.bind(this)}>Submit</CButton>{' '}
										            </CCardFooter>
	            								</CCard>	
					                		</CCol>
					                	</CRow>
					                </CTabPane>
                                    <CTabPane>
                                        <CRow>
                                            <CCol xs="12" md="12">
                                                <CCard>
                                                    <CCardBody>
                                                        <CForm className="form-horizontal">
                                                            <CFormGroup row>
                                                                <CCol md="12" className="mul-date-pick">
                                                                    <CLabel htmlFor="hf-title">Holidays Dates</CLabel>
                                                                    <MultipleDatePicker
                                                                        onSubmit={dates => this.setState({selectedDates: dates})}
                                                                    />
                                                                </CCol>
                                                            </CFormGroup>
                                                            {
                                                                this.state.holidays.length > 0 ?
                                                                <table className="table table-outline mb-0 d-sm-table" style={{width:'50%'}}>
                                                                    <thead className="thead-light">
                                                                        <tr>
                                                                            <th>Date</th>
                                                                            <th>Delete</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            this.state.holidays.map((e, key) => {
                                                                                return <tr key={key}>
                                                                                    <td>{e}</td>
                                                                                    <td><img alt="x" src="img/close.png" width="15" onClick={this.deleteDate.bind(this, e)}/></td>
                                                                                </tr>;
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table> : null   
                                                            }
                                                        </CForm>    
                                                    </CCardBody>
                                                    <CCardFooter>
                                                        <CButton color="primary" className="px-4" onClick={this.submitHolidays.bind(this)}>Submit</CButton>{' '}
                                                    </CCardFooter>
                                                </CCard>    
                                            </CCol>
                                        </CRow>
                                    </CTabPane>
				              	</CTabContent>
				            </CTabs>
			            </CCardBody>
		            </CCard>
		        </CCol>
		        <CCol xs="12" md="12">
          			<CCard>
	            		<CCardBody>
	            			<PlacesAutocomplete
                                value={this.state.address}
                                onChange={this.handleChangeAddress.bind(this)}
                                onSelect={this.handleSelect.bind(this)}
                                shouldFetchSuggestions={this.state.address.length > 2}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div className="Demo__search-bar-container">
                                        <div className="Demo__search-input-container">
                                            <input 
                                                {...getInputProps({
                                                    placeholder: 'Search Places ...',
                                                    className: 'Demo__search-input',
                                                })}
                                            />
                                            {this.state.address.length > 0 && (
                                                <button className="Demo__clear-button" onClick={this.handleCloseClick.bind(this)}>x</button>
                                            )}
                                        </div>
                                        <div className="Demo__autocomplete-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <strong>
                                                            {suggestion.formattedSuggestion.mainText}
                                                        </strong>{' '}
                                                        <small>
                                                            {suggestion.formattedSuggestion.secondaryText}
                                                        </small>
                                                    </div>
                                                 );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            <br/>
                            <Map
                                style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                                containerStyle={{
                                    height: "75vh",
                                }}
                                ref={ map => { this.map = map } }
                                movingMethod="flyTo"
                                id="map"
                                onStyleLoad={this.mapDidLoad.bind(this)}
                            >   
                            	<Layer key={"polygonKey"} type="fill" paint={polygonPaint}>
                                    {
                                        this.state.mainArray.map((e, key) => {
                                            return <Feature key={key} coordinates={[e.arr]} onClick={this.onFeatureClick.bind(this,e.id)}/>;
                                        })
                                    }
                               </Layer>
                                <DrawControl
                                    position="top-left"
                                    onDrawCreate={this.onDrawCreate.bind(this)}
                                    onDrawUpdate={this.onDrawUpdate.bind(this)}
                                    onDrawDelete={this.onDrawDelete.bind(this)}
                                    ref={(drawControl) => { this.drawControl = drawControl; }}
                                    displayControlsDefault={false}
                                    controls={controls}
                                />
                            </Map> 
	            		</CCardBody>
	            		<CCardFooter>
			            	<CButton color="primary" className="px-4" onClick={this.saveArea.bind(this)}>Save Area</CButton>{' '}
			            </CCardFooter>
	            	</CCard>
	            </CCol>		  
		    </CRow> 
	  	)
    }
}

export default Settings
