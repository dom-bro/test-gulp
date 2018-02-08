require('colors')

const colors = [
  // text colors
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'grey',
  
  // background colors
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',

  // extras
  'rainbow',
  'zebra',
  'america',
  'trap',
  'random',
]

colors.forEach(item => console.log(item[item]))

console.log('underline'.red.underline)