// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup,
	OverlayTrigger, Row, Tooltip
} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import ConfirmModal from './confirm_modal.js';


// MAIN //

class CohortPanel extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			disabled: false,
			startDate: moment( props.startDate ),
			endDate: moment( props.endDate ),
			title: props.title,
			students: props.students.join( ',' ),
			showDeleteModal: false
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const name = target.name;
			let value = target.value;

			if ( name === 'students' ) {
				value = value.replace( /\s/g, '' );
			}
			this.setState({
				[ name ]: value
			}, () => {
				let { title } = this.state;
				if ( title.length > 4 ) {
					this.setState({
						disabled: false
					});
				} else {
					this.setState({
						disabled: true
					});
				}
			});
		};

		this.handleUpdate = () => {
			const updatedCohort = {
				_id: this.props.id,
				startDate: this.state.startDate.toDate(),
				endDate: this.state.endDate.toDate(),
				members: this.state.students,
				title: this.state.title
			};
			console.log( updatedCohort );
			this.props.onUpdate( updatedCohort );
		};

		this.handleDelete = () => {
			this.props.onDelete( this.props.id );
			this.closeDeleteModal();
		};

		this.closeDeleteModal = () => {
			this.setState({
				showDeleteModal: false
			});
		};
	}

	render() {
		const content = (
			<Form style={{ padding: '10px' }}>
				<Row>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Title with a minimum length of four characters.</Tooltip>}>
						<FormGroup>
							<ControlLabel>Title</ControlLabel>
							<FormControl
								name="title"
								type="text"
								value={this.state.title}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
				</Row>
				<Row>
					<FormGroup>
						<ControlLabel> From ... To </ControlLabel>
						<br />
						<DateRangePicker
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							onDatesChange={({ startDate, endDate }) =>
								this.setState({ startDate, endDate })
							}
							focusedInput={this.state.focusedInput}
							onFocusChange={ focusedInput => this.setState({ focusedInput }) }
						/>
					</FormGroup>
				</Row>
				<Row>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the students for this cohort</Tooltip>}>
						<FormGroup>
							<ControlLabel>Enrolled Students</ControlLabel>
							<FormControl
								name="students"
								componentClass="textarea"
								value={this.state.students}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
				</Row>
				<Row>
					<ButtonToolbar>
						<Button onClick={this.handleUpdate}>Save</Button>
						<Button onClick={ () => {
							this.setState({
								showDeleteModal: true
							});
						}} bsStyle="danger">Delete</Button>
					</ButtonToolbar>
				</Row>
				<ConfirmModal
					show={this.state.showDeleteModal}
					close={this.closeDeleteModal}
					message="Are you sure that you want to delete this cohort?"
					title="Delete?"
					onDelete={this.handleDelete}
				/>
			</Form>
		);
		return content;
	}
}


// EXPORTS //

export default CohortPanel;
