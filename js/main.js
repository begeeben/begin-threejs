(function() {
  var container = document.getElementById('menu-container');
  // var items = ['one', 'two', 'three'];
  var items = ['Hello', 'World', '!', 'Three.js'];
  // var items = ['one', 'two', 'three', 'four', 'five'];
  var menu = new THREE.menu(container, items);

  menu.onPress = function(item) {
    // alert('Item pressed!');
    console.log('Pressed ' + item.text);
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
