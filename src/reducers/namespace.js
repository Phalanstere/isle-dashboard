// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	id: null,
	title: '',
	description: '',
	owners: '',
	lessons: null
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.CHANGED_NAMESPACE:
		return Object.assign({}, state, {
			_id: action.payload._id,
			title: action.payload.title,
			description: action.payload.description,
			owners: action.payload.owners
		});
	case types.DELETED_CURRENT_NAMESPACE:
		return initialState;
	case types.RETRIEVED_LESSONS:
		return Object.assign({}, state, {
			lessons: action.payload.lessons
		});
	case types.DELETED_LESSON:
		let lessons = state.lessons.slice();
		lessons = lessons.filter( x => x.title !== action.payload.title );
		return Object.assign({}, state, {
			lessons
		});
	default:
		return state;
	}
}
