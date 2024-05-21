//The following code takes a string of code and interprets
//it based on the Brainfuck language. The code is then
//output to the terminal and the corresponding HTML box that I will
//make later.

//Current bugs: need to implement input with comma

function bf_interpreter(bf_code, output_textarea) {
  var data_size = 65535;
  var data_array = new Uint8Array(data_size).fill(0);
  var data_ptr = 0;
  var program_ptr = 0;
  var output = '';
  let input = '0';
  
  while (program_ptr < bf_code.length) {
      switch (bf_code[program_ptr]) {
          case '>':
              data_ptr++;
              break;
          case '<':
              data_ptr--;
              break;
          case '+':
              data_array[data_ptr] += 1;
              break;
          case '-':
              data_array[data_ptr] -= 1;
              break;
          case '.':
                output += String.fromCharCode(data_array[data_ptr]);
              break;
          case ',':
              data_array[data_ptr] = input.charCodeAt(0);
              break;
          case '[':
              if (data_array[data_ptr] === 0) {
                  let loop_depth = 1;
                  while (loop_depth > 0) {
                      program_ptr++;
                      if (bf_code[program_ptr] === '[') loop_depth++;
                      if (bf_code[program_ptr] === ']') loop_depth--;
                  }
              }
              break;
          case ']':
              if (data_array[data_ptr] !== 0) {
                  let loop_depth = 1;
                  while (loop_depth > 0) {
                      program_ptr--;
                      if (bf_code[program_ptr] === ']') loop_depth++;
                      if (bf_code[program_ptr] === '[') loop_depth--;
                  }
              }
              break;
      }
      program_ptr++;
  }
  return output;
}

function run_bf_interpreter() {
  const bf_code_textarea = document.getElementById("bf-code");
  const interpreted_bf_code_textarea = document.getElementById("interpreted-bf-code-output");
  const text = bf_code_textarea.value;
  const output = bf_interpreter(text);
  interpreted_bf_code_textarea.value = output;
}

class InlineLogger {
  constructor() {
      this.buffer = '';
  }

  write(message) {
      this.buffer += message;
  }

  flush() {
      console.log(this.buffer);
      this.buffer = '';
  }
}

function ends_with(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Example usage
const bf_code1 = '++++++++[>+>++++<<-]>++>>+<[-[>>+<<-]+>>]>+[-<<<[->+[-]+>++>>>-<<]<[<]>>++++++[<<+++++>>-]+<<++.[-]<<]>.>+[>>]>+';
const message1 = bf_interpreter(bf_code1);
const logger = new InlineLogger();
logger.write(message1);
logger.flush();
