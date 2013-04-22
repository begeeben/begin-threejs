/**
 * @author: Yi-Fan Liao / http://begeeben.wordpress.com
 */
APP.item = function (item, options) {
  options = options || {
    cubeLength: 50,
    itemMargin: 20
  };

  function initBullet(options) {
    var geometry = new THREE.CubeGeometry( options.cubeLength, options.cubeLength, options.cubeLength );
    var material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
    var mesh = new THREE.Mesh( geometry, material);

    mesh.material.ambient = mesh.material.color;

    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;

    return mesh;
  }

  function initText() {

  }

  // 
  this.bulletMesh = initBullet(options);
  this.textMesh = initText();

  this.id = item.id;
  this.text = item.text;
  this.value = item.value;

  this.isHover = false;
  this.rotationSpeed = 0.1;

  THREE.Object3D.call(this);

  this.add(this.bulletMesh);
};

APP.item.prototype = Object.create(THREE.Object3D.prototype);

/* Update item animation according to delta time passed. */
APP.item.prototype.update = function(delta) {
  var speed = this.rotationSpeed;

  if (this.isHover) {
    // Tilt text.
  }

  this.bulletMesh.rotation.x += speed * delta;
  this.bulletMesh.rotation.y += speed * delta;
  this.bulletMesh.rotation.z += speed * delta;

  this.isHover = false;
};

APP.item.prototype.hover = function() {
  this.isHover = true;
  this.rotationSpeed *= 10;
};