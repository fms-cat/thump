let Xorshift = class {
  constructor( seed ) {
    this.seed = seed || +new Date();
  }

  gen( _seed ) {
    let seed = _seed || this.seed || 1;
    seed = seed ^ ( seed << 13 );
    seed = seed ^ ( seed >>> 17 );
    seed = seed ^ ( seed << 5 );
    this.seed = seed;
    return seed / Math.pow( 2, 32 ) + 0.5;
  }
}

export default Xorshift;