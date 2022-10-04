import React, { Component } from 'react'
import {
	CCard,
	CCardBody,
	CCol,
	CRow,
	CImg,
	CButton
} from '@coreui/react';
import configuration from '../../config';
import moment from 'moment';
let order_id;

class details extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLoader: false,
			fields: { new_sub_total: 0, sub_total: 0, tip: 0, total: 0, cart_info: [], express_service_charge_percentage: 0, express_service_charge: 0, pickup_delivery_charge: 0, none_charge: 0, extra_weight_charge: 0 },
			newFields: {},
			settings: { default_currency: '$' }
		};
	}

	handleChange(field, e) {
		let newFields = this.state.newFields
		newFields[field] = e.target.value;
		this.setState({ newFields })
	}

	submit() {
		let order_id = "";
		let url = window.location.href;
		order_id = url.substring(url.lastIndexOf('/') + 1);
		let newFields = this.state.newFields
		newFields['order_id'] = order_id;
		this.setState({ newFields })
		console.log("this.state.newFields", this.state.newFields);
		fetch(configuration.baseURL + "order/add-additional-details", {
			method: "post",
			headers: {
				'contentType': "application/json",
				'content-type': "application/json",
			},
			body: JSON.stringify(this.state.newFields)
		}).then((response) => {
			return response.json();
		}).then((data) => {
			let newFields = this.state.newFields
			this.setState({ newFields: data.payload });
			this.props.history.push('/order/attheshop')
		});
	}

	componentDidMount() {
		var url = window.location.href;
		order_id = url.substring(url.lastIndexOf('/') + 1);

		fetch(configuration.baseURL + "order/details?order_id=" + order_id).then((response) => {
			return response.json();
		}).then((data) => {
			let new_sub_total = data.payload.total - data.payload.express_service_charge;
			new_sub_total = new_sub_total - data.payload.pickup_delivery_charge;
			new_sub_total = new_sub_total - data.payload.none_charge;
			new_sub_total = new_sub_total - data.payload.extra_weight_charge;
			new_sub_total = new_sub_total - data.payload.tip;
			/* new_sub_total = new_sub_total - data.payload.additional_fee; */
			new_sub_total = (data.payload.additional_fee > 0) ? (new_sub_total - data.payload.additional_fee) : (new_sub_total - 0);
			data.payload.new_sub_total = new_sub_total
			this.setState({ fields: data.payload });
			this.setState({ newFields: data.payload });
		});
		fetch(configuration.baseURL + "settings/get").then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({ settings: data.payload });
		});
	}

	render() {
		return (
			<CRow>
				<div className="loader-img" style={{ display: this.state.showLoader ? 'block' : 'none' }}></div>
				<CCol xs="12" md="12">
					<CButton color="primary" className="px-4" onClick={() => this.props.history.push('/order/delivered')}>Back</CButton>
					<CCard style={{ marginTop: '10px' }}>
						<CCardBody>
							<div className="expanded">
								<main className="col-md-12">
									<div className="inner-container">
										<section className="">
											<div className="callout large table-responsive-sm invoice-container">
												<table className="invoice">
													<tr className="header">
														<td className="">
															<CImg
																src={'logo.png'}
																className="c-avatar-img cus_logo"
																alt="admin@bootstrapmaster.com"
																style={{ width: '70px' }}
															/>
														</td>
														<td className="align-right">
															<h2>Invoice</h2>
														</td>
													</tr>
													<tr className="intro">
														<td className="">
															Hello, <span style={{ fontWeight: 'bold' }}>{this.state.fields.customer_name}</span>.<br />
															Thank you for your order.
														</td>
														<td className="text-right">
															<span className="num">Order ID #{this.state.fields.order_id}</span><br />
															{moment(this.state.fields.created_at).format('LL')}
														</td>
													</tr>
													<tr className="additional-info">
														<td style={{ height: '30px' }} className="">
														</td>
													</tr>
													<tr className="additional-info">
														<td className="">
															<h5>Billing Information</h5>
															<p>Email: {this.state.fields.customer_email}</p>
															<p>Mobile: {this.state.fields.customer_mobile_country_code} {this.state.fields.customer_mobile}</p>
															<p>Address: {this.state.fields.location}.</p>
														</td>
														<td className="text-right">
															<h5>Payment Type</h5>
															<p style={{ textTransform: 'capitalize' }}>{this.state.fields.payment_type}</p>
														</td>
													</tr>
													<tr className="additional-info">
														<td style={{ height: '30px' }} className="">
														</td>
													</tr>
													<tr className="additional-info">
														<td className="">
															<h5>Partner Details</h5>
															<p>Name: {this.state.fields.partner_name}</p>
															<p>Email: {this.state.fields.partner_email}</p>
															<p>Mobile: {this.state.fields.partner_mobile_country_code} {this.state.fields.partner_mobile}</p>
														</td>
														<td className="text-right">
															<h5>Delivery Staff Details</h5>
															<p>Name: {this.state.fields.staff_name}</p>
															<p>Email: {this.state.fields.staff_email}</p>
															<p>Mobile: {this.state.fields.staff_mobile_country_code} {this.state.fields.staff_mobile}</p>
														</td>
													</tr>
													<tr className="additional-info">
														<td style={{ height: '30px' }} className="">
														</td>
													</tr>
													<tr className="additional-info">
														<td className="">
															<h5>Is First Time Order</h5>
															{
																this.state?.fields?.is_first_order ?
																	<p>YES</p> : <p>NO</p>
															}
														</td>
													</tr>
													<tr className="details">
														<td colspan="2">
															<table className="table table-hover table-outline mb-0 d-sm-table">
																<thead className="thead-light">
																	<tr>
																		<th>Service Category</th>
																		<th>Item Count</th>
																		<th>Price</th>
																		<th>Total</th>
																	</tr>
																</thead>
																{

																	this.state.fields.cart_info.map((e, key) => {
																		if (e.service_code === 'WELL_HEELED') {
																			return <tbody key={key}>
																				<tr>
																					<td colspan="4" className="cat-title">
																						{e.title.EN}
																					</td>
																				</tr>
																				<tr>
																					<td colspan="4" className="cat-addon">
																						Packages
																					</td>
																				</tr>
																				{e.items.map((e1, key1) => {
																					return <tr className="cat-tr" key={key1}>
																						<td className="cat-item">
																							{e1.title}
																						</td>
																						<td>
																							1
																						</td>
																						<td>
																							{this.state.settings.default_currency}{e1.price}
																						</td>
																						<td>
																							{this.state.settings.default_currency}{e1.total}
																						</td>
																					</tr>;
																				})
																				}
																			</tbody>
																		}
																		else if (e.service_code === 'LA_LA_SIGNATURE') {
																			return <tbody key={key}>
																				<tr>
																					<td colspan="4" className="cat-title">
																						{e.title.EN}
																					</td>
																				</tr>
																				<tr>
																					<td colspan="4" className="cat-addon">
																						Addons
																					</td>
																				</tr>
																				{e.items.map((e1, key1) => {
																					return <tr className="cat-tr" key={key1}>
																						<td className="cat-item">
																							{e1.title}
																						</td>
																						<td>
																							1
																						</td>
																						<td>
																							{this.state.settings.default_currency}{e1.price}
																						</td>
																						<td>
																							{this.state.settings.default_currency}{e1.total}
																						</td>
																					</tr>;
																				})
																				}
																				<tr>
																					<td colspan="4" className="cat-addon">
																						Attributes
																					</td>
																				</tr>
																				<tr>
																					<td colspan="4">
																						<table style={{ width: '100%' }}>
																							{e.attributes.map((e2, key2) => {
																								return <tbody key={key2}>
																									<tr>
																										<td className="cat-item cat-att" colspan="4" >
																											{e2.title}
																										</td>
																									</tr>
																									{e2.sub_attributes.map((e3, key3) => {
																										return <tr className="cat-tr" key={key3}>
																											<td className="cat-attribute">
																												{e3.title}
																											</td>
																											<td>
																												1
																											</td>
																											<td>
																												{this.state.settings.default_currency}{e3.price}
																											</td>
																											<td>
																												{this.state.settings.default_currency}{e3.price}
																											</td>
																										</tr>
																									})
																									}
																								</tbody>
																							})
																							}
																						</table>
																					</td>
																				</tr>
																			</tbody>
																		}
																		else {
																			return <tbody key={key}>
																				<tr>
																					<td colspan="4" className="cat-title">
																						{e.title.EN}
																					</td>
																				</tr>
																				<tr>
																					<td colspan="4" className="cat-addon">
																						Addons
																					</td>
																				</tr>
																				{e.items.map((e1, key1) => {
																					return <tr className="cat-tr" key={key1}>
																						<td className="cat-item">
																							{e1.title}
																						</td>
																						<td>
																							{e1.item_count}
																						</td>
																						<td>
																							{this.state.settings.default_currency}{e1.price}
																						</td>
																						<td>
																							{this.state.settings.default_currency}{e1.total}
																						</td>
																					</tr>;
																				})
																				}
																			</tbody>
																		}
																	})
																}
															</table>
														</td>
													</tr>
													<tr className="totals">
														{this.state.fields.status !== "delivered" && <td>
															<label class="w-100" for="hf-title">Additional Comment</label>
															<input style={{ width: 'auto' }} className='form-control' type='text' onChange={this.handleChange.bind(this, 'additional_comment')} value={this.state.newFields.additional_comment} />
															<CButton color="primary" className="px-4 mt-2" onClick={this.submit.bind(this)}>Add</CButton>
														</td>}
														<td style={{ float: 'revert', width: '30%' }}>
															<table style={{ width: '100%', marginTop: '20px' }}>
																<tr className="subtotal">
																	<td className="num">Subtotal</td>
																	<td className="num">{this.state.settings.default_currency}{(this.state.fields.new_sub_total).toFixed(2)}</td>
																</tr>
																{(this.state.fields.status !== 'delivered' || (this.state.newFields.additional_fee && this.state.fields.status === 'delivered')) && <tr className="subtotal">

																	<td className="num">Addtional Fee</td>
																	<td className="num">
																		{this.state.fields.status === 'delivered' ? this.state.newFields.additional_fee :
																			<input class="form-control" type="text" name="additional_fee" onChange={this.handleChange.bind(this, 'additional_fee')} value={(this.state.newFields.additional_fee)} />}
																	</td>
																</tr>}
																{
																	this.state.fields.is_express_service_charge ?
																		<tr className="tax">
																			<td className="num">Express service charge ({this.state.fields.express_service_charge_percentage}%)</td>
																			<td className="num">{this.state.settings.default_currency}{(this.state.fields.express_service_charge).toFixed(2)}</td>
																		</tr> : null
																}
																
																{
																	this.state.fields.is_pickup_delivery ?
																		<tr className="tax">
																			<td className="num">Pickup & Delivery Charge</td>
																			<td className="num">{this.state.settings.default_currency}{(this.state.fields.pickup_delivery_charge).toFixed(2)}</td>
																		</tr> : null
																}
																{
																	this.state.fields.discount > 0 ?
																		<tr className="tax">
																			<td className="num">Discount</td>
																			<td className="num">{this.state.settings.default_currency}{(this.state.fields.discount).toFixed(2)}</td>
																		</tr> : null
																}
																<tr className="subtotal">
																	<td className="num">Weight Charge</td>
																	<td className="num">{this.state.settings.default_currency}{(this.state.fields.none_charge).toFixed(2)}</td>
																</tr>
																{
																	this.state.fields.extra_weight_charge > 0 ?
																		<tr className="tax">
																			<td className="num">Extra Weight Charge</td>
																			<td className="num">{this.state.settings.default_currency}{(this.state.fields.extra_weight_charge).toFixed(2)}</td>
																		</tr> : null
																}
																<tr className="subtotal">
																	<td className="num">Tip</td>
																	<td className="num">{this.state.settings.default_currency}{(this.state.fields.tip).toFixed(2)}</td>
																</tr>
																<tr className="total">
																	<td style={{ fontSize: '20px' }}>Total</td>
																	<td style={{ fontSize: '20px' }}>{this.state.settings.default_currency}{(this.state.fields.total).toFixed(2)}</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
											</div>
										</section>
									</div>
								</main>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
		)
	}
}

export default details