(function() {
  var container = document.getElementById('menu-container');
  var items = ['one', 'two', 'three'];
  // var items = ['one', 'two', 'three', 'four', 'five'];
  var menu = new APP.menu(container, items);
  
  menu.onPress = function() {
    alert('Item pressed!');
  };
}());
