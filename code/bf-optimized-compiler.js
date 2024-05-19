const prefix = `
#include <iostream>
#include <vector>
  
int const data_size = 10000;

void bf_execution()
{
    std::vector<char> data(data_size, 0);
    auto data_ptr = data.begin();
`;

const suffix = `
}

int main() {
  try
  {
    bf_execution();
    return 0;
  }
  catch (std::exception& e)
  {
    std::cerr << "exception: " << e.what() << '\\n';
    return 1;
  }
  catch (...)
  {
    std::cerr << "Some exception\\n";
    return 2;
  }
}`;

function emit(level, str) {
  let result = "";
  while (level-- > 0) {
    result += "    ";
  }
  result += str;
  result += "\n";
  return result;
}

function emit2(level, str, offset) {
  let result = "";
  while (level-- > 0) {
    result += "    ";
  }
  result += str + offset + ";\n";
  return result;
}

// Adjust the program_ptr within these functions and return it alongside the offset/delta
function get_data_ptr_offset(program_ptr, program) {
  let offset = 0;
  while (program_ptr < program.length && (program[program_ptr] === ">" || program[program_ptr] === "<")) {
    if (program[program_ptr] === ">") {
      offset++;
    } else if (program[program_ptr] === "<") {
      offset--;
    }
    program_ptr++;
  }
  return { offset, program_ptr };  // Return updated program_ptr
}

function get_data_cell_change(program_ptr, program) {
  let delta = 0;
  while (program_ptr < program.length && (program[program_ptr] === "+" || program[program_ptr] === "-")) {
    if (program[program_ptr] === "+") {
      delta++;
    } else if (program[program_ptr] === "-") {
      delta--;
    }
    program_ptr++;
  }
  return { delta, program_ptr };  // Return updated program_ptr
}

// Updated main optimizer function
function bf_optimizer(bf_program) {
  let output = "";
  let level = 0;
  let program_ptr = 0;
  let result;

  output += emit(level, prefix);
  while (program_ptr < bf_program.length) {
    switch (bf_program[program_ptr]) {
      case '>':
      case '<':
        result = get_data_ptr_offset(program_ptr, bf_program);
        output += emit2(level, "data_ptr += ", result.offset);
        program_ptr = result.program_ptr - 1;  // Adjust for loop increment
        break;
      case '+':
      case '-':
        result = get_data_cell_change(program_ptr, bf_program);
        output += emit2(level, "*data_ptr += ", result.delta);
        program_ptr = result.program_ptr - 1;  // Adjust for loop increment
        break;
      case '.':
        output += emit(level, "std::cout << *data_ptr;");
        break;
      case ',':
        output += emit(level, "std::cin >> *data_ptr;");
        break;
      case '[':
        output += emit(level, "while (*data_ptr) {");
        level++;
        break;
      case ']':
        level--;
        output += emit(level, "}");
        break;
    }
    program_ptr++;
  }
  output += emit(level, suffix);
  console.log(output);
  return output;
}

function run_bf_optimized_compiler() {
  const bf_code_textarea2 = document.getElementById('bf-code');
  const optimized_compiled_bf_code_textarea = document.getElementById('optimized-compiled-bf-code-output');
  text = bf_code_textarea2.value;
  compiled_text = bf_optimizer(text);
  optimized_compiled_bf_code_textarea.value = compiled_text;
}