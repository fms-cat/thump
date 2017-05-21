<template>
<div class="inspectorContainer">
  <div class="inspector"
    :style="{
      left: left,
      right: right,
      top: top,
      bottom: bottom
    }"
    :class="{ active: active }"
  >{{ text }}</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      left: "",
      right: "",
      top: "",
      bottom: "",

      text: "",
      active: false,
      target: null,
      updateSwitch: true
    }
  },

  mounted() {
    window.addEventListener( "mousemove", this.onmousemove );
    this.update();
  },

  beforeDestroy() {
    window.removeEventListener( "mousemove", this.onmousemove );
    this.updateSwitch = false;
  },

  methods: {
    onmousemove( event ) {
      this.target = event.target;

      if ( event.clientX < window.innerWidth / 2 ) {
        this.left = ( event.clientX + 15 ) + "px";
        this.right = "";
      } else {
        this.left = "";
        this.right = ( window.innerWidth - event.clientX + 15 ) + "px";
      }

      if ( event.clientY < window.innerHeight / 2 ) {
        this.top = ( event.clientY + 5 ) + "px";
        this.bottom = "";
      } else {
        this.top = "";
        this.bottom = ( window.innerHeight - event.clientY + 5 ) + "px";
      }
    },

    update() {
      if ( this.target ) {
        let text = this.target.getAttribute( "inspector" );
        if ( text ) { this.active = true; this.text = text; }
        else { this.active = false; }
      }

      setTimeout( this.update, 50 );
    }
  }
}
</script>

<style lang="scss">
.inspectorContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  overflow: hidden;
  pointer-events: none;

  .inspector {
    position: absolute;
    
    transition-property: filter, opacity;
    transition-duration: 0.2s;
    transition-timing-function: ease;

    &.active {
      filter: blur( 0px );
      opacity: 1.0;
    }

    &:not(.active) {
      filter: blur( 3px );
      opacity: 0.0;
    }
  }
}
</style>