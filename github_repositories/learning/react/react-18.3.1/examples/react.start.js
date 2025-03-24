const rootNode = document.getElementById('root');

const App = React.createElement(
	'button',
	{
		onClick: function () {
			console.log('You liked this!');
		}
	},
	'Like'
);
// jsx
/*
	<button
		onClick={function(){
			console.log('You liked this!');
		}}>
		Like
	</button>
*/

const root = ReactDOM.createRoot(rootNode);

root.render(App);