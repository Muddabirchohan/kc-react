import React, {useState, useEffect} from 'react';
import { keycloak } from '../modules/keycloak.js';


function sendToken(id){
	fetch('http://localhost:8000/token', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
			'token'       : id
		}
	})
		.then(response => response.json());
}



function Keycloak({children}) {
	// We'll use this variable to halt the app
	// excecution until the user is Authenticated
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	// The `init()` method we'll be in charge of starting
	// the authentication flow.
	useEffect(() => {
		keycloak
			.init({
				// The `onLoad` option can be configured
				// with two possible values:
				// - `login-required`
				// - `check-sso`
				// Both do the same, except the first one
				// redirects the user to the login page if
				// he's not authenticated.
				onLoad: 'login-required'
			})
			.success( res => {
				// We can continue rendering the app
				// now that the user has been authenticated
				setIsAuthenticated(true);
				sendToken(keycloak.idToken);
			})
			.error((err) => {
				// Log an error method if something went
				// wrong.
				console.error(err);
			});
	}, []);
	// We'll render the component `children` only after the
	// user has been authenticated.
	return isAuthenticated === true
		? children
		: <div>Please wait...</div>
}

export default Keycloak;