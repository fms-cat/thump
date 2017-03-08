import Thump from "./thump";

let thump = new Thump();

thump.run( `
#l 2 8 img/msgothic_16x16pn.png
#l 2 13 img/cat_big.png
#l 1 12 img/cat_small.png

@start
pi $_, si 0, rns $_
// pi $_, si 11, zi 4, cp $_
// pi $_, si 8, gzr $_

@loopB
// pi $i, si 0

@loopS

// func poker
pi $_, si 0, pi $x, rnd $_
pi $_, si 16, pi $y, rnd $_
pi $_, si 2, pi $z, rnd $_
pi $_, si 0, pi $v, rnd $_
x $x, y $y, z $z, s $v // poke

// cat, word and line
pi $_, si 16, pi $x, s $i, mul $_
pi $_, si 16, pi $y, s $i, div $_, mul $_
pi $_, si 3, pi $__, si 4, pi $z, rnd $_, add $__
pi $_, si 0, pi $v, rnd $_
pi $_, si 32, pi $l, rnd $_
pi $_, si 64, pi $__, si 166, pi $spr, rnd $_, add $__
pi $_, si 13, spt $_ // set sprite table (cat)
x $x, y $y, zi 4, sp8 $spr // draw sprite
pi $_, si 8, spt $_ // set sprite table (word)
x $x, y $y, z $z, sp $spr // draw sprite
x $x, y $y, z $z, s $v, sf $l // draw line

// another looper
pi $ic, si 0

@loopCS

// cat forward
pi $_, si 16, pi $x, s $ic, mul $_, add $i
pi $_, si 16, pi $y, s $ic, div $_, mul $_
pi $_, si 12, spt $_ // set sprite table
x $x, y $y, zi 17, sp $ic // draw sprite

pi $_, si 1, pi $ic, add $_
pi $_, si 256, pi $ic, seq $_, j @loopCS

pi $_, si 17, zi 4, cp8 $_

pi $_, si 2, w $_

pi $_, si 1, pi $i, add $_
pi $_, si 256, pi $i, seq $_, j @loopS

j @loopB
` );

buttonGood.addEventListener( "click", () => {
  thump.stop();
  thump.redice();
  thump.init();
  // thump.saveMode = true;
} );