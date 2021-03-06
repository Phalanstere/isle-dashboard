// MODULES //

import React, { Component } from 'react';
import { Button, Col, ControlLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger, Overlay, PageHeader, Panel, Popover, Tooltip } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import request from 'request';
import server from './../constants/server';
import './login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// VARIABLES //

const MsgModal = withRouter( ( props ) => (
	<Modal show={props.show}>
		<Modal.Header>
			<Modal.Title>Create User</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			{ props.successful ?
				<Button onClick={()=>{
					props.history.push( '/login' );
				}}>Go to login page</Button>
				:
				<Button onClick={props.close}>
					Close
				</Button>
			}
		</Modal.Footer>
	</Modal>
) );


// MAIN //

class Signup extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			name: '',
			email: '',
			password: '',
			passwordRepeat: '',
			showModal: false
		};

		this.handleSubmit = ( event ) => {
			event.preventDefault();
			if (
				this.getEmailValidationState() === 'success' &&
				this.getNameValidationState() === 'success' &&
				this.getPasswordValidationState() === 'success'
			) {
				request.post( server+'/create_user', {
					form: this.state
				}, ( err, res ) => {
					const body = JSON.parse( res.body );
					console.log( body );
					if ( !err ) {
						this.setState({
							message: body.message,
							successful: body.successful,
							showModal: true
						});
					}
				});
			} else {
				this.setState({
					showSubmitOverlay: true,
					overlayTarget: event.target
				}, () => {
					setTimeout( () => {
						this.setState({
							showSubmitOverlay: false
						});
					}, 2000 );
				});
			}
			return false;
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;

			this.setState({
				[ name ]: value
			});
		};

		this.getEmailValidationState = () => {
			const { email } = this.state;
			if ( email.includes( '@' ) ) {
				return 'success';
			}
			return 'warning';
		};

		this.getNameValidationState = () => {
			const { name } = this.state;
			if ( name.length > 3 ) {
				return 'success';
			}
			return 'warning';
		};

		this.getPasswordValidationState = () => {
			const { password, passwordRepeat } = this.state;
			if ( password.length < 6 || passwordRepeat.length === 0 ) {
				return 'warning';
			}
			if ( password !== passwordRepeat ) {
				 return 'error';
			}
			return 'success';
		};

		this.close = () => {
			this.setState({
				showModal: false
			});
		};
	}

	render() {
		return (
			<div>
				<div className="login">
					<Panel style={{ opacity: 0.9 }}>
						<PageHeader style={{ textAlign: 'center' }}>ISLE <small>Dashboard</small></PageHeader>
						<Form horizontal>
							<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a valid email address.' )}>
								<FormGroup
									controlId="formHorizontalEmail"
									validationState={this.getEmailValidationState()}
								>
									<Col componentClass={ControlLabel} sm={2}>
										Email
									</Col>
									<Col sm={10}>
										<FormControl
											name="email"
											type="email"
											placeholder="Enter Email"
											onChange={this.handleInputChange}
										/>
										<FormControl.Feedback />
									</Col>
								</FormGroup>
							</OverlayTrigger>
							<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter your name (minimum three characters).' )}>
								<FormGroup
									controlId="formHorizontalName"
									validationState={this.getNameValidationState()}
								>
									<Col componentClass={ControlLabel} sm={2}>
										Name
									</Col>
									<Col sm={10}>
										<FormControl
											name="name"
											type="text"
											placeholder="Enter Name"
											onChange={this.handleInputChange}
										/>
										<FormControl.Feedback />
									</Col>
								</FormGroup>
							</OverlayTrigger>
							<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a password of your choosing with at least six characters' )}>
								<FormGroup
									controlId="formHorizontalPassword"
									validationState={this.getPasswordValidationState()}
								>
									<Col componentClass={ControlLabel} sm={2}>
										Password
									</Col>
									<Col sm={10}>
										<FormControl
											name="password"
											type="password"
											placeholder="Choose Password"
											onChange={this.handleInputChange}
											maxLength={30}
											minLength={6}
										/>
										<FormControl.Feedback />
									</Col>
								</FormGroup>
							</OverlayTrigger>
							<FormGroup
								controlId="formHorizontalPassword"
								validationState={this.getPasswordValidationState()}
							>
								<Col componentClass={ControlLabel} sm={2}>
								</Col>
								<Col sm={10}>
									<FormControl
										name="passwordRepeat"
										type="password"
										placeholder="Confirm Password"
										onChange={this.handleInputChange}
										maxLength={30}
										minLength={6}
									/>
									<FormControl.Feedback />
								</Col>
							</FormGroup>
							<FormGroup>
								<Button
									bsStyle="primary"
									className="centered"
									type="submit"
									onClick={this.handleSubmit}
								>Sign up</Button>
							</FormGroup>
						</Form>
						<div style={{ marginTop: 20 }}>
							<span style={{ float: 'right' }}>
								<Link to="/forgot-password">Forgot password?</Link>
								<span> | </span>
								<Link to="/login">Log in</Link>
							</span>
						</div>
					</Panel>
				</div>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
				/>
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="bottom"
					container={this}
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Input fields are not valid">
						Please make sure that all input values are valid before submitting.
					</Popover>
				</Overlay>
			</div>
		);
	}
}


// EXPORTS //

export default Signup;
