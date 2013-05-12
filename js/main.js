(function() {
  var container = document.getElementById('menu-container');
  // var items = ['one', 'two', 'three'];
  var items = [{
    text: 'Your 1st three.js page',
    value: 'first-blood.html' 
  },{
    text: 'Add texture to an object',
    value: 'texture.html' 
  },{
    text: 'Common lights',
    value: 'lighting.html' 
  },{
    text: 'Common materials',
    value: 'materials.html' 
  },{
    text: 'Load a 3D model',
    value: 'model.html' 
  },{
    text: 'Animate a 3D model',
    value: 'animate-model.html' 
  },{
    text: 'Make a game',
    value: 'animate-model.html' 
  }];
  // var items = ['one', 'two', 'three', 'four', 'five'];
  var menu = new THREE.menu(container, items);

  menu.onPress = function(item) {
    // alert('Item pressed!');
    console.log('Pressed ' + item.text);
    window.location.assign(item.value);
  };

  menu.onClick = function(item) {
    console.log('Clicked ' + item.text);
  };

  menu.onRelease = function(item) {
    console.log('Released ' + item.text);
  };

  menu.onHover = function(item) {
    console.log('Hover on ' + item.text);
  };
}());
