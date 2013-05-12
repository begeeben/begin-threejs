/**
 * @author: Yi-Fan Liao / http://begeeben.wordpress.com
 */
THREE.menu = function(container, items, options) {

  this.options = options || {
    cubeLength: 50,
    itemMargin: 20,
    textSize: 50,
    textHeight: 20,

    bullet: {
      shape: 'cube',
      color: '#829',
      size: container.clientHeight / items.length
    },

    font: {
      
    }
  };

  this.container = container;
  this.renderer = null;
  this.scene = null;
  this.camera = null;

  // this.objects = [];
  this.items = [];

  this.clock = null;
  this.stats = null;

  this.projector = null;
  this.mouse = null;

  // Current hovered item.
  this.intersected = null;
  // Last pressed item.
  this.lastIntersected = null;

  this.init(container, items, this.options);
  this.animate();
};

THREE.menu.prototype = {

  constructor: THREE.menu,

  init: function(container, items, options) {

    if( Detector.webgl ){
      this.renderer = new THREE.WebGLRenderer({
        antialias   : true, // to get smoother output
        preserveDrawingBuffer : true  // to allow screenshot
      });
      this.renderer.setClearColor( 0x000000, 1 );
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

    for (var i=0; i<items.length; i++) {
      // Add an item.
      var object = new THREE.item({
        id: i,
        text: items[i].text,
        value: items[i].value
      });

      object.position.x = options.cubeLength + options.itemMargin;
      object.position.y = -(options.itemMargin + options.cubeLength)-(options.itemMargin * 2 + options.cubeLength) * i ;
      object.position.z = 0;

      // object.scale.x = Math.random() * 2 + 1;
      // object.scale.y = Math.random() * 2 + 1;
      // object.scale.z = Math.random() * 2 + 1;

      object.castShadow = true;
      object.receiveShadow = true;

      this.scene.add( object );

      // this.objects.push( object );
      this.items.push( object );

      // Add light.
      var pointLight = new THREE.PointLight(0x999999);
      pointLight.position.x = -60;
      pointLight.position.y = -100 * i + 20;
      pointLight.position.z = 200;

      this.scene.add(pointLight);
    }

  },

  onDocumentMouseMove: function( event ) {
    var container = this.container;
    var scene = this.scene;
    var camera = this.camera;
    var items = this.items;
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

    var intersects = raycaster.intersectObjects( items, true );

    // if ( SELECTED ) {
    //   var intersects = raycaster.intersectObject( plane );
    //   SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
    //   return;
    // }

    // var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
      container.style.cursor = 'pointer';
      if (!!this.intersected && intersects[0].object.parent.itemId!==this.intersected.itemId) {
        this.intersected.leave();
      }
      else if(!this.intersected) {
        this.onHover(intersects[0].object.parent);        
      }
      // On hover menu item.
      intersects[0].object.parent.hover();
      this.intersected = intersects[0].object.parent;
    } 
    else {
      container.style.cursor = 'auto';
      if (!!this.intersected) {
        this.intersected.leave();
        this.intersected = null;
      }
    }

  },

  onDocumentMouseDown: function( event ) {
    var container = this.container;
    var scene = this.scene;
    var camera = this.camera;
    var items = this.items;
    var projector = this.projector;
    var mouse = this.mouse;

    event.preventDefault();

    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

    var raycaster = projector.pickingRay( vector.clone(), camera );

    var intersects = raycaster.intersectObjects( items, true );

    if ( intersects.length > 0 ) {
      this.lastIntersected = intersects[0].object.parent;
      this.onPress(intersects[0].object.parent);
    } 

  },

  onDocumentMouseUp: function ( event ) {
    var container = this.container;
    var scene = this.scene;
    var camera = this.camera;
    var items = this.items;
    var projector = this.projector;
    var mouse = this.mouse;

    event.preventDefault();

    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

    var raycaster = projector.pickingRay( vector.clone(), camera );

    var intersects = raycaster.intersectObjects( items, true );

    if ( intersects.length > 0 ) {
      if (!!this.lastIntersected && this.lastIntersected.itemId === intersects[0].object.parent.itemId) {
        this.onClick(this.lastIntersected);
      }

      this.onRelease(intersects[0].object.parent);
    } 

    this.lastIntersected = null;

    // container.style.cursor = 'auto';

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
    // Update item animations.
    for (var i=0; i<this.items.length; i++) {
      this.items[i].update(delta);
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
  // When a menu item is hovered.
  onHover: function() {},
  // When a menu item is pressed and released.
  onClick: function() {},
  // When a menu item is pressed.
  onPress: function() {},
  // When a menu item is released.
  onRelease: function() {}

};