/**
 * @author: Yi-Fan Liao / http://begeeben.wordpress.com
 */
APP.menu = function(container, items, options) {

  this.options = options || {
    cubeLength: 50,
    itemMargin: 20
  };

  this.container = container;
  this.renderer = null;
  this.scene = null;
  this.camera = null;
  this.objects = [];
  this.clock = null;
  this.stats = null;

  this.projector = null;
  this.mouse = null;

  this.init(container, items, this.options);
  this.animate();
};

APP.menu.prototype = {

  constructor: APP.menu,

  init: function(container, items, options) {

    if( Detector.webgl ){
      this.renderer = new THREE.WebGLRenderer({
        antialias   : true, // to get smoother output
        preserveDrawingBuffer : true  // to allow screenshot
      });
      this.renderer.setClearColorHex( 0x000000, 1 );
    // uncomment if webgl is required
    //}else{
    //  Detector.addGetWebGLMessage();
    //  return true;
    }else{
      this.renderer  = new THREE.CanvasRenderer();
    }
    this.renderer.setSize( container.clientWidth, container.clientHeight );
    // this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container = container;
    this.container.appendChild(this.renderer.domElement);

    // create a scene
    this.scene = new THREE.Scene();

    // Set up the camera.
    // this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera = new THREE.OrthographicCamera( 0, container.clientWidth, 0, -container.clientHeight, - 500, 1000 );
    // this.camera = new THREE.OrthographicCamera( 0, window.innerWidth, 0, -window.innerHeight, - 500, 1000 );
    this.camera.position.set(0, 0, 50);
    this.scene.add(this.camera);

    this.initLights();
    this.initItems(items, options);

    this.clock = new THREE.Clock();

    // Mouse event.
    this.projector = new THREE.Projector();
    this.mouse = new THREE.Vector2();
    this.renderer.domElement.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
    this.renderer.domElement.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
    this.renderer.domElement.addEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );

    // add Stats.js - https://github.com/mrdoob/stats.js
    // this.stats = new Stats();
    // this.stats.domElement.style.position = 'absolute';
    // this.stats.domElement.style.bottom = '0px';
    // document.body.appendChild( stats.domElement );
  },

  /** Initialise lights. */
  initLights: function() {
    var ambient = new THREE.AmbientLight( 0x222222 ) ;

    this.scene.add(ambient);
    // var light = new THREE.SpotLight( 0xffffff, 1.5 );
  },

  /** Initialize menu items. */
  initItems: function(items, options) {
    var geometry = new THREE.CubeGeometry( options.cubeLength, options.cubeLength, options.cubeLength );

    for (var i=0; i<items.length; i++) {
      // Add cube.
      var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

      object.material.ambient = object.material.color;

      object.position.x = options.cubeLength + options.itemMargin;
      object.position.y = -(options.itemMargin + options.cubeLength)-(options.itemMargin * 2 + options.cubeLength) * i ;
      object.position.z = 0;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      // object.scale.x = Math.random() * 2 + 1;
      // object.scale.y = Math.random() * 2 + 1;
      // object.scale.z = Math.random() * 2 + 1;

      object.castShadow = true;
      object.receiveShadow = true;

      this.scene.add( object );

      this.objects.push( object );

      // Add text.
      this.createText(items, options, i);

      // Add light.
      var pointLight = new THREE.PointLight(0x999999);
      pointLight.position.x = -60;
      pointLight.position.y = -100 * i + 20;
      pointLight.position.z = 200;

      this.scene.add(pointLight);
    }

  },

  createText: function(items, options, index) {
    var text = items[index];

    var textGeometry = new THREE.TextGeometry( text, {

      size: 40,
      height: 20,
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

    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

    // if ( ! bevelEnabled ) {
    if (false) {

      var triangleAreaHeuristics = 0.1 * ( height * size );

      for ( var i = 0; i < textGeometry.faces.length; i ++ ) {

        var face = textGeometry.faces[ i ];

        if ( face.materialIndex == 1 ) {

          for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

            face.vertexNormals[ j ].z = 0;
            face.vertexNormals[ j ].normalize();

          }

          var va = textGeometry.vertices[ face.a ];
          var vb = textGeometry.vertices[ face.b ];
          var vc = textGeometry.vertices[ face.c ];

          var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

          if ( s > triangleAreaHeuristics ) {

            for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

              face.vertexNormals[ j ].copy( face.normal );

            }

          }

        }

      }

    }

    var material = new THREE.MeshFaceMaterial( [ 
      new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
      new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );

    var centerOffset = -0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x );

    var textMesh1 = new THREE.Mesh( textGeometry, material );

    // textMesh1.position.x = centerOffset;
    textMesh1.position.x = ( options.cubeLength + options.itemMargin )* 2;
    textMesh1.position.y = -(options.itemMargin + options.cubeLength)-(options.itemMargin * 2 + options.cubeLength) * index;
    // textMesh1.position.x = 50;
    // textMesh1.position.y = -100 * i;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    this.scene.add( textMesh1 );

    // if ( mirror ) {
      if(false) {
      var textMesh2 = new THREE.Mesh( textGeometry, material );

      textMesh2.position.x = centerOffset;
      textMesh2.position.y = -30;
      textMesh2.position.z = 20;

      textMesh2.rotation.x = Math.PI;
      textMesh2.rotation.y = Math.PI * 2;

      this.scene.add( textMesh2 );

    }
  },

  onDocumentMouseMove: function( event ) {
    var container = this.container;
    var scene = this.scene;
    var camera = this.camera;
    var objects = this.objects;
    var projector = this.projector;
    var mouse = this.mouse;

    event.preventDefault();
    // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;
    // Unproject the screen space mouse point to 3D world space.
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    // projector.unprojectVector( vector, camera );
    // // Cast a ray from the camera position.
    // var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var raycaster = projector.pickingRay( vector.clone(), camera );

    var intersects = raycaster.intersectObjects( scene.children );

    // if ( SELECTED ) {
    //   var intersects = raycaster.intersectObject( plane );
    //   SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
    //   return;
    // }

    // var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

      // if ( INTERSECTED != intersects[ 0 ].object ) {

      //   if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

      //   INTERSECTED = intersects[ 0 ].object;
      //   INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

      //   plane.position.copy( INTERSECTED.position );
      //   plane.lookAt( camera.position );

      // }

      container.style.cursor = 'pointer';

    } 
    else {

      // if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

      // INTERSECTED = null;

      container.style.cursor = 'auto';

    }

  },

  onDocumentMouseDown: function( event ) {

    // event.preventDefault();

    // var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    // projector.unprojectVector( vector, camera );

    // var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // var intersects = raycaster.intersectObjects( objects );

    // if ( intersects.length > 0 ) {

    //   controls.enabled = false;

    //   SELECTED = intersects[ 0 ].object;

    //   var intersects = raycaster.intersectObject( plane );
    //   offset.copy( intersects[ 0 ].point ).sub( plane.position );

    //   container.style.cursor = 'move';

    // }


    var container = this.container;
    var scene = this.scene;
    var camera = this.camera;
    var objects = this.objects;
    var projector = this.projector;
    var mouse = this.mouse;

    event.preventDefault();

    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

    var raycaster = projector.pickingRay( vector.clone(), camera );

    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
      this.onPress();
    } 

  },

  onDocumentMouseUp: function ( event ) {

    event.preventDefault();

    controls.enabled = true;

    if ( INTERSECTED ) {

      plane.position.copy( INTERSECTED.position );

      SELECTED = null;

    }

    container.style.cursor = 'auto';

  },

  /** The main animation loop. */
  animate: function() {
    requestAnimationFrame( this.animate.bind(this) );
    this.update(this.clock.getDelta());
    this.render();
    // this.stats.update();
  },

  /** 
   *  Update animations according to time difference.
   */
  update: function(delta) {
    // Rotate cubes.
    for (var i=0; i<this.objects.length; i++) {
      this.objects[i].rotation.x += delta;
      this.objects[i].rotation.y += 0.7 * delta;
      this.objects[i].rotation.z += 0.2 * delta;
    }
  },

  /** Render the scence. */
  render: function() {
    this.renderer.render(this.scene, this.camera);
  },

  /** Show this menu. */
  show: function() {

  },

  /** Hide this menu. */
  hide: function() {

  },

  // Callbacks for mouse events.
  onHover: function() {},
  onClick: function() {},
  onPress: function() {},
  onRelease: function() {}

};