<template>
<div class="app">
  <div class="mainfield"
    :style="{
      width: 'calc( 100% - ' + ( sidebarVisible ? sidebarWidth : 0 ) + 'px )'
    }"
  >
    <div class="mainarea"
      :style="{
        transform: 'scale(' + mainareaScale + ',' + mainareaScale + ')'
      }"
    >
      <canvas class="canvas"
        ref="canvas"
      ></canvas>  
      <textarea class="textareaCode"
        v-show="editorVisible"
        spellcheck="false"
        ref="textareaCode"
    >// Visit: https://github.com/fms-cat/thump

pi $x, si 0 // $x = 0
pi $y, si 0 // $y = 0
pi $0, si 0 // $0 = 0
pi $1, si 1 // $1 = 1

@loop
pi $c, si 0, rnd $c // $c = random()
x $x, y $y, zi 4, s $c // set $c to ($x, $y, 4 (=red buffer))

pi $x, add $1 // $x += 1
pi $x, seq $0, j @loop // if x != 0 then jump to @loop

pi $_, si 10, w $_ // wait for 10ms

pi $y, add $1 // $y += 1
j @loop // jump to @loop</textarea>
    </div>

    <div class="buttons"
    >
      <div class="button"
        :inspector="sidebarVisible ? 'Close sidebar' : 'Open sidebar'"
        :style="{'background-image':sidebarVisible ? 'url(img/sidebar1.svg)' : 'url(img/sidebar0.svg)'}"
        @click="toggleSidebar"
      />
      <br />
      <div class="button"
        inspector="Run"
        :style="{'background-image':'url(img/play.svg)'}"
        @click="run"
      />
      <div class="button"
        inspector="Redice"
        :style="{'background-image':'url(img/dice.svg)'}"
        @click="redice"
      />
      <div class="button"
        :inspector="gifRecording ? 'Stop recording' : 'Save as GIF'"
        :style="{'background-image':gifRecording ? 'url(img/recstop.svg)' : 'url(img/rec.svg)'}"
        @click="gifRecord"
      />
    </div>
  </div>

  <div class="sidebar"
    :style="{
      left: ( sidebarVisible ? 0 : -sidebarWidth ) + 'px',
      width: sidebarWidth + 'px'
    }"
  >
    <div
      :style="{
        font: '500 24px Comic Sans MS',
        background: '#ff0',
        color: '#f06'
      }"
    >Work in Progress</div>
    
    <template
      v-for="number in 8"
    >
      ImageBank{{ number - 1 }}: <input
        :ref="'imageBank' + ( number - 1 )"
        type="file"
        @change="imageBankChanged( number - 1, $event )"
      /><br />
    </template>

    Program Inspector:
    <div class="prgInspector"
    >{{ prgInspector }}</div>

    <div>
      Esc : Emergency stop<br />
      Tab : Toggle code visibility<br />
      Ctrl + S : Run<br />
      Ctrl + R : Redice<br />
      Ctrl + - : Zoom out<br />
      Ctrl + = : Zoom in
    </div>
  </div>
  
  <div class="divConsole"
    ref="divConsole"
  >
    <div class="divLog"
      v-for="log in console"
    >{{ log }}</div>
  </div>

  <br />

  <a href="https://github.com/fms-cat/thump" target="_blank">
    <img class="logo"
      inspector="https://github.com/fms-cat/thump"
      src="img/thump.svg"
    />
  </a>

  <inspector />
</div>
</template>

<script>
import Thump from "./thump";
import inspector from "./inspector.vue";

let thump;

export default {
  components: {
    inspector
  },

  data() {
    return {
      thump: null,

      editorVisible: true,
      gifRecording: false,
      mainareaScale: 1.0,

      sidebarWidth: 240,
      sidebarVisible: false,

      prgInspector: "",

      console: []
    }
  },

  mounted() {
    thump = new Thump( this.$refs.canvas );

    this.resetConsole();

    thump.setLogFunc( ( num ) => {
      this.console.shift();
      this.console.push( num );
    } );

    thump.addDrawListener( ( thump ) => {
      let arr = thump.buf.subarray( Thump.Z_PRG * 65536, Thump.Z_PRG * 65536 + 65536 );

      this.prgInspector = "";
      let p = thump.get16b( Thump.P_CNT );
      for ( let i = 0; i < 1024; i ++ ) { // actually 32768 but that is really slow
        this.prgInspector += thump.funcMapR[ arr[ i * 2 + 0 ] % thump.funcMapR.length ] + "\t" + arr[ i * 2 + 1 ] + "\n";
      }
    } );

    window.addEventListener( "keydown", this.onkeydown );
  },

  beforeDestroy() {
    window.removeEventListener( "keydown", this.onkeydown );
  },

  methods: {
    onkeydown( event ) {
      if ( event.ctrlKey || event.metaKey ) {
        if ( event.which === 187 ) { // ctrl + =
          event.preventDefault();
          this.mainareaScale += 0.1;
        }

        if ( event.which === 189 ) { // ctrl + -
          event.preventDefault();
          this.mainareaScale = Math.max( this.mainareaScale - 0.1, 1 );
        }

        if ( event.which === 83 ) { // ctrl + s
          event.preventDefault();
          this.run();
        }

        if ( event.which === 82 ) { // ctrl + r
          event.preventDefault();
          this.redice();
        }
      }

      if ( event.which === 27 ) { // esc
        event.preventDefault();
        thump.stop();
      }

      if ( event.which === 9 ) { // tab
        event.preventDefault();
        this.editorVisible = !this.editorVisible;
      }
    },

    resetConsole() {
      this.console = new Array( 15 ).fill( "" );
    },

    run() {
      this.resetConsole();

      thump.run( this.$refs.textareaCode.value );
      thump.init();
    },

    redice() {
      this.resetConsole();

      thump.redice();
      thump.init();
    },

    gifRecord() {
      this.resetConsole();

      if ( this.gifRecording ) {
        this.gifRecording = false;
        
        thump.saveGifStop();
      } else {
        this.gifRecording = true;

        thump.init( {
          gif: {
            workerScript: "lib/gif.worker.js",
            dither: "FloydSteinberg"
          }
        } );
      }
    },

    imageBankChanged( num, event ) {
      console.log( num, event );
      let reader = new FileReader();
      reader.onload = () => {
        thump.setImageBank( num, reader.result );
      }
      reader.readAsDataURL( event.target.files[ 0 ] );
    },

    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }
};
</script>

<style lang="scss">

.app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font: 200 16px/1.5 "Helvetica Neue", "ヒラギノ角ゴシック", sans-serif;

  .mainfield {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;

    transition-property: width;
    transition-duration: 0.2s;
    transition-timing-function: ease-out;

    .mainarea {
      position: absolute;
      left: calc( 50% - 128px );
      top: calc( 50% - 128px );
      width: 256px;
      height: 256px;

      transition-property: transform;
      transition-duration: 0.1s;
      transition-timing-function: ease-out;

      .canvas {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;

        image-rendering: pixelated;
      }

      .textareaCode {
        position: absolute;
        left: -1px;
        top: -1px;
        width: calc( 100% - 6px );
        height: calc( 100% - 6px );
        padding: 4px;
        border: none;

        resize: none;
        word-wrap: break-word;
        word-break: break-all;
        font-family: monospace;
        font-size: 10px;

        background: #000;
        color: #fff;
        opacity: 0.6;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    .buttons {
      position: absolute;
      left: 0px;
      bottom: 0px;

      font-size: 0;

      .button {
        display: inline-block;
        margin-left: 8px;
        margin-bottom: 8px;
        width: 40px;
        height: 40px;

        border-radius: 4px;

        cursor: pointer;

        background-color: #444;
        background-size: contain;

        &:hover { background-color: #555; }
        &:active { opacity: 0.6; }
      }
    }
  }

  .sidebar {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;

    transition-property: left;
    transition-duration: 0.2s;
    transition-timing-function: ease-out;

    font-size: 12px;

    background: #111;
    color: #fff;

    overflow-x: hidden;
    overflow-y: scroll;

    .prgInspector {
      font: 500 10px/1.0 monospace;

      white-space: pre;

      height: 200px;
      width: 100px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  .divConsole {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 30px;

    overflow: hidden;

    .divLog {
      margin: 0;
      height: 16px;

      font-family: monospace;
      font-size: 12px;
    }
  }

  .logo {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 96px;

    opacity: 0.2;

    &:hover {
      opacity: 0.4;
    }
  }

  .inspector {
    padding: 0 4px;
    font-size: 14px;

    background: #000;
    color: #fff;
    opacity: 0.8;
  }
}
</style>