export default ( Thump, thump ) => {
  thump.def( "v", ( param ) => { // void
    thump.set16b( Thump.P_CNT, 65536 - 2 );
    return 1;
  } );

  thump.def( "w", ( param ) => { // wait a while
    return thump.get( param );
  } );

  thump.def( "pi", ( param ) => { // set pointer immediately
    thump.set( Thump.P_X, param );
    thump.set( Thump.P_Y, 0 );
    thump.set( Thump.P_Z, 0 );
  } );

  thump.def( "p", ( param ) => { // set pointer
    thump.set( Thump.P_X, thump.get( param ) );
    thump.set( Thump.P_Y, 0 );
    thump.set( Thump.P_Z, 0 );
  } );

  thump.def( "x", ( param ) => { // set x
    thump.set( Thump.P_X, thump.get( param ) );
  } );

  thump.def( "xi", ( param ) => { // set x immediately
    thump.set( Thump.P_X, param );
  } );

  thump.def( "y", ( param ) => { // set y
    thump.set( Thump.P_Y, thump.get( param ) );
  } );

  thump.def( "yi", ( param ) => { // set y immediately
    thump.set( Thump.P_Y, param );
  } );

  thump.def( "z", ( param ) => { // set z
    thump.set( Thump.P_Z, thump.get( param ) );
  } );

  thump.def( "zi", ( param ) => { // set z immediately
    thump.set( Thump.P_Z, param );
  } );

  thump.def( "l", ( param ) => { // console log pointer
    thump.log( thump.get( param ) );
  } );

  thump.def( "lc", ( param ) => { // console log pointer (char)
    thump.log( String.fromCharCode( thump.get( param ) ) );
  } );

  thump.def( "li", ( param ) => { // console log immediately
    console.log( param );
  } );

  thump.def( "lp", () => { // console log pointer
    console.log( thump.get( thump.pointer() ) );
  } );

  thump.def( "g", ( param ) => { // get
    thump.set( param, thump.get( thump.pointer() ) );
  } );

  thump.def( "s", ( param ) => { // set
    thump.set( thump.pointer(), thump.get( param ) );
  } );

  thump.def( "si", ( param ) => { // set immediately
    thump.set( thump.pointer(), param );
  } );

  thump.def( "sf", ( param ) => { // fill pointer value to length value
    let v = thump.get( thump.pointer() );
    let l = thump.get( param ) || 256;
    for ( let i = 0; i < l; i ++ ) {
      thump.set( thump.pointer() + i, v );
    }
  } );

  thump.def( "cp", ( param ) => { // copy buffer
    let dz = thump.get( Thump.P_Z ) * 65536;
    let sz = thump.get( param ) * 65536;
    for ( let i = 0; i < 65536; i ++ ) {
      thump.buf[ dz + i ] = thump.buf[ sz + i ];
    }
  } );

  thump.def( "cp8", ( param ) => { // copy buffer with 8bit palette
    let sz = thump.get( param ) * 65536;
    for ( let z = 0; z < 3; z ++ ) {
      let dz = ( thump.get( Thump.P_Z ) + z ) * 65536;
      for ( let i = 0; i < 65536; i ++ ) {
        let v = thump.buf[ sz + i ];
        if ( v !== 0 ) {
          thump.buf[ dz + i ] = thump.buf[ Thump.P_PLT + v + z * 256 ];
        }
      }
    }
  } );

  thump.def( "cpa", ( param ) => { // copy buffer rgba
    let az = ( thump.get( param ) + 3 ) * 65536;
    for ( let z = 0; z < 3; z ++ ) {
      let dz = ( thump.get( Thump.P_Z ) + z ) * 65536;
      let sz = ( thump.get( param ) + z ) * 65536;
      for ( let i = 0; i < 65536; i ++ ) {
        let a = thump.buf[ az + i ] / 255.0;
        thump.buf[ dz + i ] = ( 1.0 - a ) * thump.buf[ dz + i ] + a * thump.buf[ sz + i ];
      }
    }
  } );

  thump.def( "sp", ( param ) => { // sprite
    let sp = thump.get( param );
    sp = ( sp % 16 ) * 16 + ~~( sp / 16 ) * 4096;
    let pos = thump.get16b( Thump.P_X );

    let sz = thump.get( Thump.P_SPR ) * 65536;
    let dz = ( thump.get( Thump.P_Z ) ) * 65536;
    for ( let y = 0; y < 16; y ++ ) {
      for ( let x = 0; x < 16; x ++ ) {
        let p = x + y * 256;
        let s = p + sp + sz;
        let d = p + pos + dz;
        thump.buf[ d ] = thump.buf[ s ];
      }
    }
  } );

  thump.def( "sp8", ( param ) => { // sprite
    let sp = thump.get( param );
    sp = ( sp % 16 ) * 16 + ~~( sp / 16 ) * 4096;
    let pos = thump.get16b( Thump.P_X );

    let sz = thump.get( Thump.P_SPR ) * 65536;
    for ( let z = 0; z < 3; z ++ ) {
      let dz = ( thump.get( Thump.P_Z ) + z ) * 65536;
      for ( let y = 0; y < 16; y ++ ) {
        for ( let x = 0; x < 16; x ++ ) {
          let p = x + y * 256;
          let s = p + sp + sz;
          let d = p + pos + dz;
          let v = thump.buf[ s ];
          if ( v !== 0 ) {
            thump.buf[ d ] = thump.buf[ Thump.P_PLT + v + z * 256 ];
          }
        }
      }
    }
  } );

  thump.def( "spa", ( param ) => { // sprite rgba
    let sp = thump.get( param );
    sp = ( sp % 16 ) * 16 + ~~( sp / 16 ) * 4096;
    let pos = thump.get16b( Thump.P_X );

    let az = ( thump.get( Thump.P_SPR ) + 3 ) * 65536;
    for ( let z = 0; z < 3; z ++ ) {
      let sz = ( thump.get( Thump.P_SPR ) + z ) * 65536;
      let dz = ( thump.get( Thump.P_Z ) + z ) * 65536;
      for ( let y = 0; y < 16; y ++ ) {
        for ( let x = 0; x < 16; x ++ ) {
          let p = x + y * 256;
          let s = p + sp + sz;
          let d = p + pos + dz;
          let a = thump.buf[ p + sp + az ] / 255.0;
          thump.buf[ d ] = ( 1.0 - a ) * thump.buf[ d ] + a * thump.buf[ s ];
        }
      }
    }
  } );

  thump.def( "add", ( param ) => { // add value
    thump.set( thump.pointer(), thump.get( thump.pointer() ) + thump.get( param ) );
  } );

  thump.def( "sub", ( param ) => { // sub value
    thump.set( thump.pointer(), thump.get( thump.pointer() ) - thump.get( param ) );
  } );

  thump.def( "mul", ( param ) => { // mul value
    thump.set( thump.pointer(), thump.get( thump.pointer() ) * thump.get( param ) );
  } );

  thump.def( "div", ( param ) => { // div value
    thump.set( thump.pointer(), thump.get( thump.pointer() ) / thump.get( param ) );
  } );

  thump.def( "mod", ( param ) => { // mod value
    thump.set( thump.pointer(), thump.get( thump.pointer() ) % thump.get( param ) );
  } );

  thump.def( "sin", ( param ) => { // sin value
    thump.set( thump.pointer(), thump.get( thump.get( param ) + Thump.P_SIN ) );
  } );

  thump.def( "rnd", ( param ) => { // set value random
    let v = thump.get( param );
    thump.set( thump.pointer(), thump.xorshift.gen() * ( v ? v : 256 ) );
  } );

  thump.def( "rns", ( param ) => { // set random seed
    thump.xorshift.gen( thump.get( param ) );
  } );

  thump.def( "j", ( param ) => { // jump to pointer
    thump.set16b( Thump.P_CNT, thump.get16b( Thump.P_JMP + param * 2 ) + 65536 - 2 );
  } );

  thump.def( "seq", ( param ) => { // skip if pointer equals param
    if ( thump.get( thump.pointer() ) === thump.get( param ) ) {
      thump.set16b( Thump.P_CNT, thump.get16b( Thump.P_CNT ) + 2 );
    }
  } );

  thump.def( "sne", ( param ) => { // skip if pointer not equals param
    if ( thump.get( thump.pointer() ) !== thump.get( param ) ) {
      thump.set16b( Thump.P_CNT, thump.get16b( Thump.P_CNT ) + 2 );
    }
  } );

  thump.def( "srt", ( param ) => { // sort
    let index = ~~( thump.pointer() / 256 ) * 256;
    for ( let ii = 0; ii < thump.get( param ); ii ++ ) {
      for ( let i = 0; i < 255; i ++ ) {
        let a = thump.buf[ index + i ];
        let b = thump.buf[ index + i + 1 ];
        if ( b < a ) {
          thump.buf[ index + i + 1 ] = a;
          thump.buf[ index + i ] = b;
        }
      }
    }
  } );

  thump.def( "gzr", ( param ) => { // set gzr
    thump.set( Thump.P_GZR, thump.get( param ) );
  } );

  thump.def( "gzg", ( param ) => { // set gzg
    thump.set( Thump.P_GZG, thump.get( param ) );
  } );

  thump.def( "gzb", ( param ) => { // set gzb
    thump.set( Thump.P_GZB, thump.get( param ) );
  } );

  thump.def( "spt", ( param ) => { // set sprite table
    thump.set( Thump.P_SPR, thump.get( param ) );
  } );

  thump.def( "jpg", ( param ) => { // jpegize!!
    thump.stopped = true;
    let z = thump.get( Thump.P_Z );
    let d = thump.bgContext.getImageData( 0, 0, 256, 256 );
    for ( let i = 0; i < 65536; i ++ ) {
      d.data[ i * 4 + 0 ] = thump.get( z * 65536 + i );
      d.data[ i * 4 + 1 ] = thump.get( ( z + 1 ) * 65536 + i );
      d.data[ i * 4 + 2 ] = thump.get( ( z + 2 ) * 65536 + i );
      d.data[ i * 4 + 3 ] = 255;
    }
    thump.bgContext.putImageData( d, 0, 0 );
    let url = thump.bgCanvas.toDataURL( "image/jpeg", thump.get( param ) / 256.0 );
    let i = new Image();
    i.onload = () => {
      thump.bgContext.fillRect( 0, 0, 256, 256 );
      thump.bgContext.drawImage( i, 0, 0 );
      let d = thump.bgContext.getImageData( 0, 0, 256, 256 );
      for ( let i = 0; i < 65536; i ++ ) {
        thump.set( z * 65536 + i, d.data[ i * 4 + 0 ] );
        thump.set( ( z + 1 ) * 65536 + i, d.data[ i * 4 + 1 ] );
        thump.set( ( z + 2 ) * 65536 + i, d.data[ i * 4 + 2 ] );
      }
      thump.stopped = false;
    };
    i.src = url;
  } );
};