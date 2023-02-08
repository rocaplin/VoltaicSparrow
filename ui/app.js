import React from 'react';
import './App.css';

class App extends React.Component{

	render() {
	  return(
	   
		  <div>
			<h1>Welcome To Chompsci React Version!</h1>
			<div id="rasa-chat-widget" data-websocket-url="http://localhost:5005"></div>
		  </div>
	  )
	}
	
	componentDidMount () {
		const script = document.createElement("script");
		script.src = "/javascripts/rasa-widget.js";
		script.async = true;
		document.body.appendChild(script);
	}

}



export default App;
