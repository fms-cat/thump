import palette256 from "./palette256";
import eightBit from "./eightbit";
import Xorshift from "./xorshift";

let Thump = class {
  constructor() {
    let thump = this;

    // ------

    thump.seed = +new Date();
    thump.xorshift = new Xorshift();

    // ------

    thump.bufLen = 256 * 256 * 256;
    thump.buf = new Uint8Array( thump.bufLen );

    // ------

    thump.canvas = document.getElementById( "canvas" );
    thump.canvas.width = 256;
    thump.canvas.height = 256;

    thump.context = thump.canvas.getContext( "2d" );
    thump.context.fillStyle = "#000";
    thump.context.fillRect( 0, 0, 256, 256 );
    thump.imageData = thump.context.getImageData( 0, 0, 256, 256 );

    // ------

    thump.saveFrameMax = 0;
    thump.saveFrameCount = 0;
    thump.saveAnchor = document.createElement( "a" );

    // ------

    thump.funcs = [];
    thump.funcMap = {};
    require( "./thump-defs" ).default( Thump, thump );

    // ------

    thump.code = "v";
    thump.stopped = true;

    // ------

    thump.update();

    // ------

    let escListener = ( event ) => {
      if ( event.which === 27 ) {
        thump.stopped = true;
      }
    };
    window.addEventListener( "keydown", escListener );

    window.addEventListener( "unload", () => {
      window.removeEventListener( "keydown", escListener );
      delete thump.buf;
      thump = null;
    } );
  }

  get( pointer ) {
    let thump = this;
    return thump.buf[ pointer % thump.bufLen ];
  }

  get16b( pointer ) {
    let thump = this;
    return thump.get( pointer ) + thump.get( pointer + 1 ) * 256;
  }

  set( pointer, value ) {
    let thump = this;
    thump.buf[ pointer % thump.bufLen ] = value;
  }

  set16b( pointer, value ) {
    let thump = this;
    thump.set( pointer, value );
    thump.set( pointer + 1, value / 256 );
  }

  getCnt() {
    let thump = this;
    return thump.get16b( Thump.P_CNT );
  }

  setCnt( cnt ) {
    let thump = this;
    thump.set16b( Thump.P_CNT, cnt );
  }

  pointer() {
    let thump = this;
    return thump.get16b( Thump.P_X ) + thump.get( Thump.P_Z ) * 65536;
  }

  save() {
    let thump = this;
    if (
      thump.saveFrameCount === 0 ||
      thump.saveFrameMax < thump.saveFrameCount
    ) { return; }
    thump.saveAnchor.href = thump.canvas.toDataURL();
    thump.saveAnchor.download = ( "0000" + thump.saveFrameCount ).slice( -5 ) + ".png";
    thump.saveAnchor.click();
    thump.saveFrameCount ++;
  }

  draw() {
    let thump = this;
    for ( let i = 0; i < 65536; i ++ ) {
      thump.imageData.data[ i * 4 + 0 ] = thump.get( thump.get( Thump.P_GZR ) * 65536 + i );
      thump.imageData.data[ i * 4 + 1 ] = thump.get( thump.get( Thump.P_GZG ) * 65536 + i );
      thump.imageData.data[ i * 4 + 2 ] = thump.get( thump.get( Thump.P_GZB ) * 65536 + i );
    }
    thump.context.putImageData( thump.imageData, 0, 0 );
    thump.save();
  }

  def( name, func ) {
    let thump = this;
    thump.funcMap[ name ] = thump.funcs.length;
    thump.funcs.push( ( param ) => {
      // console.log( name, param );
      return func( param );
    } );
  }

  loadBuffer( url, loc, mode, callback ) {
    let thump = this;
    let image = new Image();
    image.onload = () => {
      thump.context.clearRect( 0, 0, 256, 256 );
      thump.context.drawImage( image, 0, 0, 256, 256 );
      let data = thump.context.getImageData( 0, 0, 256, 256 );

      if ( mode === 0 ) {
        for ( let i = 0; i < 65536; i ++ ) {
          thump.buf[ loc * 65536 + i ] = data.data[ i * 4 ];
        }
      } else if ( mode === 1 ) {
        let eightData = eightBit( data.data );
        for ( let i = 0; i < 65536; i ++ ) {
          thump.buf[ loc * 65536 + i ] = eightData[ i ];
        }
      } else if ( mode === 2 ) {
        for ( let i = 0; i < 65536; i ++ ) {
          thump.buf[ ( loc + 0 ) * 65536 + i ] = data.data[ i * 4 + 0 ];
          thump.buf[ ( loc + 1 ) * 65536 + i ] = data.data[ i * 4 + 1 ];
          thump.buf[ ( loc + 2 ) * 65536 + i ] = data.data[ i * 4 + 2 ];
          thump.buf[ ( loc + 3 ) * 65536 + i ] = data.data[ i * 4 + 3 ];
        }
      }
      
      if ( typeof callback === "function" ) { callback(); }
    };
    image.src = url;
  }

  interpret( str, callback ) {
    let thump = this;
    let prgEnd = 0;
    let addPrg = ( name, param ) => {
      thump.set( Thump.Z_PRG * 65536 + prgEnd, thump.funcMap[ name ] );
      thump.set( Thump.Z_PRG * 65536 + prgEnd + 1, param );
      prgEnd += 2;
    };

    let rows = str.split( /\n/ );
    rows = rows.map( row => row.replace( /\/\/.*/, "" ) );
    let words = rows.reduce( ( prev, cur ) => {
      return prev.concat( cur.split( /,/ ) );
    }, [] );
    words = words.map( row => row.replace( /^\s+/, "" ) );
    words = words.map( row => row.replace( /\s+$/, "" ) );

    let labelCount = 0;
    let labels = {};

    let varCount = 0;
    let vars = {};

    let prgs = [];

    let loads = [];

    words.map( ( word, line ) => {
      word.replace( /^([a-zA-Z0-9]+)\s+\$((\$)?[a-zA-Z0-9-_]+)/, ( ...match ) => { // set instructions with variable
        let name = match[ 2 ];
        if ( typeof vars[ name ] !== "number" ) {
          vars[ name ] = varCount;
          varCount += match[ 3 ] ? 2 : 1;
        }
        prgs.push( [ match[ 1 ], vars[ name ] ] );
        word = "";
      } );

      word.replace( /^([a-zA-Z0-9]+)\s+@([a-zA-Z0-9-_]+)$/, ( ...match ) => { // jump macro
        let name = match[ 2 ];
        if ( !labels[ name ] ) {
          labels[ name ] = { i: labelCount };
          labelCount ++;
        }
        prgs.push( [ match[ 1 ], labels[ name ].i ] );
        word = "";
      } );

      word.replace( /^([a-zA-Z0-9]+)(\s+([0-9]+))?/, ( ...match ) => { // set instructions
        prgs.push( [ match[ 1 ], parseInt( match[ 3 ] ) || 0 ] );
        word = "";
      } );

      word.replace( /^#l\s+(\d+)\s+(\d+)\s+(.+)$/, ( ...match ) => { // buffer loader
        let flag = parseInt( match[ 1 ] );
        let loc = parseInt( match[ 2 ] );
        let url = match[ 3 ];
        loads.push( [ flag, loc, url ] );
        word = "";
      } );

      word.replace( /^@([a-zA-Z0-9-_]+)$/, ( ...match ) => { // inspect label position
        let name = match[ 1 ];
        if ( !labels[ name ] ) {
          labels[ name ] = { i: labelCount };
          labelCount ++;
        }
        labels[ name ].p = prgs.length * 2;
        thump.set16b( Thump.P_JMP + labels[ name ].i * 2, labels[ name ].p );
        word = "";
      } );
    } );

    prgs.map( prg => {
      addPrg( prg[ 0 ], prg[ 1 ] );
    } );

    let loadRemain = loads.length;
    let loadDone = () => {
      loadRemain --;
      if ( loadRemain === 0 ) {
        if ( typeof callback === "function" ) { callback(); }
      }
    };
    loads.map( ( load ) => {
      thump.loadBuffer( load[ 2 ], load[ 1 ], load[ 0 ], loadDone );
    } );
  }

  redice( seed ) {
    let thump = this;
    thump.seed = seed || +new Date();
    thump.xorshift.gen( thump.seed );
  }

  init() {
    let thump = this;

    thump.stopped = true;
    thump.saveFrameCount = 0;

    thump.buf.fill( 0 );

    thump.set( Thump.P_PRG, Thump.Z_PRG );
    thump.set( Thump.P_GZR, Thump.Z_GZR );
    thump.set( Thump.P_GZG, Thump.Z_GZG );
    thump.set( Thump.P_GZB, Thump.Z_GZB );
    thump.set16b( Thump.P_CNT, 65536 - 2 );

    for ( let i = 0; i < 256; i ++ ) {
      thump.set( Thump.P_SIN + i, ~~( 127.5 + 127.5 * Math.sin( i / 128.0 * Math.PI ) + 0.5 ) );
    }

    for ( let i = 0; i < 768; i ++ ) {
      thump.set( Thump.P_PLT + i, ( palette256[ i % 256 ] >> ( ( ~~( i / 256 ) ) * 8 ) ) & 255 );
    }

    thump.xorshift.gen( thump.seed );

    thump.interpret( thump.code, () => {
      thump.stopped = false;
    } );

    thump.context.fillStyle = "#000";
    thump.context.fillRect( 0, 0, 256, 256 );
  };

  update() {
    let thump = this;
    let waited = false;

    if ( !thump.stopped ) {
      for ( let i = 0; i < 1E4; i ++ ) {
        let funchead = thump.get( Thump.P_PRG ) * 65536 + thump.get16b( Thump.P_CNT );
        let funcp = thump.get( funchead );
        let param = thump.get( funchead + 1 );
        let w = thump.funcs[ funcp % thump.funcs.length ]( param );
        thump.set16b( Thump.P_CNT, thump.get16b( Thump.P_CNT ) + 2 );
        if ( w ) {
          thump.draw();
          setTimeout( () => { thump.update() }, w );
          waited = true;
          break;
        }
      }
    }

    if ( !waited ) {
      setTimeout( () => { thump.update() }, 1 );
    }
  }

  stop() {
    let thump = this;
    thump.stopped = true;
  }

  run( code ) {
    let thump = this;
    thump.code = code;
    thump.init();
  }
};

// ------

Thump.P_CNT = 256; // 16bit
Thump.P_PRG = 258;
Thump.P_X = 259;
Thump.P_Y = 260;
Thump.P_Z = 261;
Thump.P_GZR = 262;
Thump.P_GZG = 263;
Thump.P_GZB = 264;
Thump.P_SPR = 265;
Thump.P_SIN = 512;
Thump.P_PLT = 768;

Thump.P_JMP = 32768;

// ------

Thump.Z_PRG = 1;
Thump.Z_GZR = 4;
Thump.Z_GZG = 5;
Thump.Z_GZB = 6;

// ------

export default Thump;