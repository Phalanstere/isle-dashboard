// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from './../constants/server';
import EnterToken from './../components/enter_token.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleEnterToken = connect( mapStateToProps, mapDispatchToProps )( EnterToken );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		authenticate: ({ userToken, writeAccessToken }) => {
			console.log( userToken );
			request.get( server+'/set_write_access', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					 token: writeAccessToken
				}
			}, function( error, response, body ) {
				if ( error ) {
					return error;
				}
				if ( response.statusCode !== 200 ) {
					dispatch( actions.addNotification({
						message: 'The provided token is incorrect.',
						level: 'error'
					}) );
				} else {
					body = JSON.parse( body );
					dispatch( actions.authenticated() );
					dispatch( actions.addNotification({
						message: body.message,
						level: 'success'
					}) );
				}
			});
		}
	};
}

export default VisibleEnterToken;
