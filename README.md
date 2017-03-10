# Thump

Low-level-like environment for simulating multi paradigm glitch

![](https://i.imgur.com/6RXUQzk.gif)

---

## Try Thump on browser

[https://fms-cat.github.io/thump/dist](https://fms-cat.github.io/thump/dist)

**Deal with Thump is really hard work** as its lowlevelness and I haven't give you enough information 🙀  
If you want to play with Thump, please tell me and cheer me for making pretty docs 😻 → [@FMS_Cat on Twitter](https://twitter.com/FMS_Cat)

Sample code is on `./prgs`.

## Simple introduction

### Program in Thump

Thump is low-level-like environment like assembly.  
In Thump, you can use 1-3 letter(s) instructions and one 8bit parameter like `si 42`.  
There are various instructions, vary from simple one to powerful one...  
Also you can use variables. Variables must start with `$` like `pi $i`.  
There jump instruction (`j`) and you can use labels like `@loop`.  
You can comment out code or explanation using `//` like C or JavaScript.

### Buffer of Thump

Buffer of Thump is made of `Uint8Array` and its length is `256*256*256`.  
Buffer is separated by `256*256`.  

- first 65536 is used by various executing information. belonging information is program counter, variables, position of label, color palettes, etc...
- second 65536 contains program information. If you tweak these value... **GLITCH**!!
- fifth, sixth, and seventh 65536 is used for drawing. Each region corresponds to R, G, B.
- You can use other region for sprite table or other. When you load sprite table initially, don't use regions I explain above.

## Examples

### How to program in thump

```
// Put 4 to `$a`.
// `pi` is used for moving pointer to param
// `$v` is replaced by address of variable when precompiling
// `si` instantly puts param at current pointer
pi $a
si 4

// "$b = $a + 5".
// `s` puts value pointed by param at current pointer
// `add` adds up value of current pointer by value pointed by param
// You cannot add an value instantly so you need to use temporal variable
pi $_
si 5
pi $b
s $a
add $_

// Print out `$a` and `$b`.
// `l` prints the value pointed by param
// You can write two or more instructions in one line using comma
l $a, l $b

// `w` is used for waiting.
// Value pointed by param is used for waiting time (in ms)
pi $_, si 200, w $_
```

### How to drawing in Thump

```
// `pi` can only use for moving pointer in range of 0-255
// You can use `xi`, `yi`, and `zi` to move in range of 0-16777215
// As explained in "Buffer of Thump" above, z=4 is drawing buffer of red
xi 100, yi 100, zi 4

// This `si` will put small red dot on canvas!
si 255

// `w` is also used for refreshing canvas
// After the drawing instructions, you need to `w` to refresh canvas
pi $_, si 100, w $_

// At the end of program, The program counter automatically jumps to start of program
```

### How to loop in Thump

```
// When you want to use constant value frequently, you can do like this:
pi $50, si 50

// `$i` for use of loop, initiate with 160
pi $i, si 160

// It is label. Can use for jumping instruction `j`
@loop

// `y` is non-instant version of `yi`.
// It enables to move pointer using value pointed by param.
// There are also `x` and `z`
// Remember, z=5 is drawing buffer of green
xi $i, y $i, zi 5

// The instructions below draws green line on canvas
// `sf` fills buffer with value of current pointer
// Filled buffer is from current pointer to current pointer + value pointed by param
si 255, sf $50

// wait for 10ms
pi $_, si 10, w $_

// Adds up 1 to `$i`
pi $_, si 1, pi $i, add $_

// `seq` is used for "skipping"
// If value pointed by pointer is same with value pointed by param, `seq` skips next instruction
// In this case, if `$i` equals `$_` (210), program counter skips next instruction `j @loop`
// In other words, if `$i` not equals 210, program counter jumps to @label
pi $_, si 200, pi $i, seq $_, j @loop

// put "D", "o", "n", "e", "!", to console
// `lc` is similar to `l`, but prints char instead of value
pi $_, si 68, lc $_
pi $_, si 111, lc $_
pi $_, si 110, lc $_
pi $_, si 101, lc $_
pi $_, si 33, lc $_
```

### How to glitch in Thump

```
pi $ix, si 0 // $ix = 0
pi $iy, si 0 // $iy = 0
pi $0, si 0 // $0 = 0
pi $1, si 1 // $1 = 1

@beg

// In Thump, z=1 contains program
// So you poke random value at buffer in z=1, the program glitches!
// `rnd` generates random number in range of 0 - value pointed by param
// If you throw 0, it's special case, `rnd` generates random value in range of 0 - 255
pi $x, si 0, rnd $x // $x = random()
pi $y, si 4, rnd $y // $y = random() (in range of 0 - 3)
pi $v, si 0, rnd $v // $v = random()
x $x, y $y, zi 1, s $v // GLITCH!!

// === below is normal Thump code ===
// Changing program drastically changes glitch behaviour

@loop

pi $c, si 0, rnd $c // $c = random()
x $ix, y $iy, zi 4, s $c // set $c to ($ix, $iy, 4 (=red buffer))

pi $ix, add $1 // $ix += 1
pi $ix, seq $0, j @loop // if $ix != 0 then jump to @loop

pi $_, si 10, w $_ // wait for 10ms

pi $iy, add $1 // $iy += 1
j @beg // jump to @beg
```