var APP = {

  /** The DOM element to attach to. */
  container: null,
  renderer: null,
  scence: null,
  camera: null,
  clock: null,
  stats: null,

  init: function() {

  },

  /** The main animation loop. */
  animate: function() {

    requestAnimationFrame( this.animate.bind(this) );

    this.update();
    this.render();
    stats.update();
  },

  /** Update  */
  update: function(delta) {

  },

  /** Render the scence. */
  render: function() {
    this.renderer.render(scence, camera);
  }

};