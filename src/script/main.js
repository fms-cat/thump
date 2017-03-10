import Thump from "./thump";

let thump = new Thump( document.getElementById( "canvas" ) );

textareaCode.value = `\
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
j @loop // jump to @loop
`;

thump.run( textareaCode.value );

// ------

thump.setLogFunc( ( num ) => {
  if ( 15 === divConsole.childElementCount ) {
    divConsole.removeChild( divConsole.firstChild );
  }

  let d = document.createElement( "div" );
  d.classList.add( "divLog" );
  d.innerText = num;
  divConsole.appendChild( d );
} );

// ------

let escListener = ( event ) => {
  if ( event.which === 27 ) {
    thump.stop();
  }
};
window.addEventListener( "keydown", escListener );

// ------

buttonRun.addEventListener( "click", () => {
  while ( 0 !== divConsole.childElementCount ) {
    divConsole.removeChild( divConsole.firstChild );
  }

  thump.run( textareaCode.value );
  thump.init();
  thump.saveFrameMax = 0;
} );

buttonRedice.addEventListener( "click", () => {
  while ( 0 !== divConsole.childElementCount ) {
    divConsole.removeChild( divConsole.firstChild );
  }

  thump.redice();
  thump.init();
  thump.saveFrameMax = 0;
} );

buttonSave.addEventListener( "click", () => {
  while ( 0 !== divConsole.childElementCount ) {
    divConsole.removeChild( divConsole.firstChild );
  }

  thump.init();
  thump.saveFrameMax = 300;
} );