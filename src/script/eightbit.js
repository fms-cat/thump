let ditherPattern = [
   0,  8,  2, 10,
  12,  4, 14,  6,
   3, 11,  1,  9,
  15,  7, 13,  5,
];

let dither = ( v, m, x, y ) => {
  let p = ditherPattern[ x % 4 + ( y % 4 ) * 4 ] / 16.0;
  return ~~( v * m + p );
};

export default ( data ) => {
  let ret = new Uint8Array( 65536 );
  for ( let i = 0; i < 65536; i ++ ) {
    let x = i % 256;
    let y = ( ~~( i / 256 ) );

    ret[ i ] = ( data[ i * 4 + 3 ] < 127 ) ? (
      0
    ) : (
      16 +
      dither( data[ i * 4 + 0 ] / 255.0, 5, x, y ) * 1 +
      dither( data[ i * 4 + 1 ] / 255.0, 5, x, y ) * 6 +
      dither( data[ i * 4 + 2 ] / 255.0, 5, x, y ) * 36
    );
  }
  return ret;
};