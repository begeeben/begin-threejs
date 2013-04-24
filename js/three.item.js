/**
 * @author: Yi-Fan Liao / http://begeeben.wordpress.com
 */
THREE.item = function (item, options) {

  THREE.Object3D.call(this);

  options = options || {
    bulletColor: Math.random() * 0xffffff,
    textColor: Math.random() * 0xffffff,
    cubeLength: 50,
    itemMargin: 20,
    textSize: 50,
    textHeight: 20
  };

  function initBullet(options) {
    var geometry = new THREE.CubeGeometry( options.cubeLength, options.cubeLength, options.cubeLength );
    var material = new THREE.MeshLambertMaterial( { color: options.bulletColor } );
    var mesh = new THREE.Mesh( geometry, material);

    mesh.material.ambient = mesh.material.color;

    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;

    return mesh;
  }

  function initText(text, options) {
    // var text = items[index];

    var textGeometry = new THREE.TextGeometry( text, {

      size: options.textSize,
      height: options.textHeight,
      curveSegments: 4,

      font: 'optimer',
      weight: 'normal',
      style: 'normal',

      bevelThickness: 2,
      bevelSize: 1.5,
      bevelEnabled: true,

      material: 0,
      extrudeMaterial: 1

    });

    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();

    var material = new THREE.MeshFaceMaterial( [ 
      new THREE.MeshPhongMaterial( { color: options.textColor, shading: THREE.FlatShading } ), // front
      new THREE.MeshPhongMaterial( { color: options.textColor, shading: THREE.SmoothShading } ) // side
    ] );

    var centerOffset = -0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x );

    var mesh = new THREE.Mesh( textGeometry, material );

    // textMesh1.position.x = centerOffset;
    mesh.position.x = options.cubeLength + options.itemMargin * 2;
    mesh.position.y = - options.itemMargin;
    // mesh.position.y = -(options.itemMargin + options.cubeLength)-(options.itemMargin * 2 + options.cubeLength);
    // textMesh1.position.x = 50;
    // textMesh1.position.y = -100 * i;
    // mesh.position.z = 0;

    // mesh.rotation.x = 0;
    // mesh.rotation.y = Math.PI * 2;
    mesh.rotation.x = -0.4;
    // mesh.rotation.y = 0.2;

    return mesh;

  }

  // 
  this.itemId = item.id;
  this.text = item.text;
  this.value = item.value;

  // Raycaster only intersects with THREE.Particle, THREE.LOD and THREE.Mesh.
  // So here we store item id and value in the meshes.
  this.bulletMesh = initBullet(options);
  this.bulletMesh.itemId = this.itemId;
  this.bulletMesh.value = this.value;

  this.textMesh = initText(item.text, options);
  this.textMesh.itemId = this.itemId;
  this.textMesh.value = this.value;

  this.isHover = false;
  this.rotationSpeed = 0.1;

  this.add(this.bulletMesh);
  this.add(this.textMesh);
};

THREE.item.prototype = Object.create(THREE.Object3D.prototype);

/* Update item animation according to delta time passed. */
THREE.item.prototype.update = function(delta) {
  var speed = this.rotationSpeed;

  if (this.isHover) {
    // Tilt text.
  }

  this.bulletMesh.rotation.x += speed * delta;
  this.bulletMesh.rotation.y += speed * delta;
  this.bulletMesh.rotation.z += speed * delta;

  this.isHover = false;
};

THREE.item.prototype.hover = function() {
  this.isHover = true;
  this.rotationSpeed *= 10;
};