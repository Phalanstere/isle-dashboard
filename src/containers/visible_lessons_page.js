// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import LessonsPage from './../components/lessons_page.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleLessonsPage = connect( mapStateToProps, mapDispatchToProps )( LessonsPage );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace
	};
}

function  mapDispatchToProps( dispatch ) {
	return {
		deleteLesson: ({ lessonName, namespaceName, token }) => {
			if ( namespaceName && lessonName ) {
				request.get( 'http://localhost:3000/delete_lesson', {
					qs: {
						namespaceName,
						lessonName
					},
					headers: {
						'Authorization': 'JWT ' + token
					}
				}, function ( err, res ) {
					if ( err ) {
						return dispatch( actions.addNotification({
							message: err.message,
							level: 'error'
						}) );
					}
					let msg = JSON.parse( res.body ).message;
					if ( res.statusCode >= 400 ) {
						return dispatch( actions.addNotification({
							message: msg,
							level: 'error'
						}) );
					}
					dispatch( actions.deletedLesson( lessonName ) );
					dispatch( actions.addNotification({
						message: msg,
						level: 'success'
					}) );
				});
			}
		},
		getLessons: ( namespaceName ) => {
			if ( namespaceName ) {
				request.get( 'http://localhost:3000/get_lessons', {
					qs: {
						namespaceName
					}
				}, function( error, response, body ) {
					if ( error ) {
						return error;
					}
					body = JSON.parse( body );
					let lessons = body.lessons;
					lessons = lessons.map( lesson => {
						lesson.url = 'http://localhost:3000/' + namespaceName + '/' + lesson.title;
						return lesson;
					});
					dispatch( actions.retrievedLessons( lessons ) );
				});
			}
		}
	};
}

export default VisibleLessonsPage;
