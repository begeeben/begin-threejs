(function() {
  var container = document.getElementById('menu-container');

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
    value: 'animated-model.html' 
  },{
    text: 'Make a game',
    value: 'animate-model.html' 
  }];

  var menu = new THREE.menu(container, items);

  menu.onPress = function(item) {
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
