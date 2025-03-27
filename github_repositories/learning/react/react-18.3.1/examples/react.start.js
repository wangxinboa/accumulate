const rootNode = document.getElementById('root');

const App = React.createElement(
	'button',
	{
		onMouseDown: function () {
			console.error('You liked this!');
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


function mousedown() {
	// 模拟事件
	// 获取 dom
	const button = document.querySelectorAll("button")[0];
	if (button) {
		// 创建event
		const event = document.createEvent("MouseEvents");
		// 初始化event
		event.initMouseEvent("mousedown",
			true, true, document.defaultView, 0,
			10, 10,// screen
			10, 10,// client
			false, false, false, false, 0, null);
		// 触发事件
		button.dispatchEvent(event);
	}
}

setTimeout(() => {
	mousedown();
}, 1000)