var renderer = new THREE.WebGLRenderer();
var container = document.getElementById('three-container');

renderer.setSize(container.clientWidth, container.clientHeight);
// renderer.domElement: A canvas element to draw WebGL output
container.appendChild(renderer.domElement);

var scene = new THREE.Scene();
// new THREE.PerspectiveCamera(fov, aspect, near, far)
var camera = new THREE.PerspectiveCamera( 40, container.clientWidth / container.clientHeight, 1, 1000 );
camera.position.set( 0, 10, 130 );

var clock = new THREE.Clock();

// Load 3D model.
var loadCounter = 2;

function checkLoadingComplete() {
  loadCounter -= 1;
  if(loadCounter === 0) scene.add(boyMesh);
};
// Textures.
// How the image is applied to the object.
var mapping = new THREE.UVMapping();
var boyMap = THREE.ImageUtils.loadTexture('models/boy/textures/boy.png', mapping, checkLoadingComplete());

// Body.
var boyMesh;
var loader = new THREE.JSONLoader();

loader.load('models/boy/boy.js', function(geometry) {
  geometry.computeMorphNormals();

  var materialBoy = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x111111,
    shininess: 50,
    map: boyMap,
    morphTargets: true,
    morphNormals: true,
    wrapAround: true
  });

  boyMesh = new THREE.MorphAnimMesh(geometry, materialBoy);
  // boyMesh.scale = 1;
  boyMesh.rotation.y = Math.PI;

  boyMesh.castShadow = true;
  boyMesh.receiveShadow = true;
  // Parse animations in the model file.
  boyMesh.parseAnimations();
  // boyMesh.playAnimation( geometry.firstAnimation, 30 );

  checkLoadingComplete();
});

var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 0, 0, 1 );
scene.add(light);

function render() {
  requestAnimationFrame(render);

  var delta = clock.getDelta();

  if ( boyMesh ) {
    // boyMesh.rotation.y += 0.01;
    // THREE.MorphAnimMesh.updateAnimation
    boyMesh.updateAnimation(100*delta);
  }

  renderer.render(scene, camera);
}

render();