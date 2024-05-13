function emit(output, level, str) {
  while (level-- > 0) {
    output += "    ";
  }
  output += str;
  output += "\n";
  return output;
}

function emit2(output, level, str, offset) {
  while (level-- > 0) {
    output += "    ";
  }
  output += str;
  output += offset;
  output += ";\n";
  return output;
}

// The following function is used to calculate the total 
// movement of the data for a given string of > and < characters.
// This will allow us to move the data pointer to the correct 
// position more efficiently.
// Make sure to increment the program pointer after calling this function.

function get_data_ptr_offset(program_ptr, program)
{
  let offset = 0;
  for (program_ptr = program_ptr; program_ptr < program.length; i++) {
    if (program[i] === ">") {
      offset++;
    } else if (program[i] === "<") {
      offset--;
    } else {
      return offset;
    }
  }
  return offset;
}

// The following function is used to calculate the total
// change (Delta) in the value of the data cell for a given string
// of + and - characters. This will allow us to update the
// data cell value more efficiently.
// Make sure to increment the program pointer after calling this function.
function get_data_cell_change(program_ptr, program)
{
  let delta = 0;
  for (program_ptr = program_ptr; program_ptr < program.length; i++) {
    if (program[i] === "+") {
      delta++;
    } else if (program[i] === "-") {
      delta--;
    } else {
      return delta;
    }
  }
  return delta;
}

function bf_optimizer(bf_program) {
  let level = 0;
  let output = "";
  var program_ptr = 0;
  prefix = `
#include <iostream>
#include <vector>
  
int const data_size = 10000;

void bf_execution()
{
    std::vector<char> data(data_size, 0);
    auto data_ptr = data.begin();
`;

  output += emit(output, level, prefix);
  while (program_ptr < bf_program.length) {
    switch (bf_program[program_ptr]) {
      case ">":
        let offset = get_data_ptr_offset(program_ptr, bf_program);
        output += emit2(output, level, "data_ptr += ", offset);
        program_ptr += offset;
        break;
      case "<":
        let offset = get_data_ptr_offset(program_ptr, bf_program);
        output += emit2(output, level, "data_ptr -= ", offset);
        program_ptr += offset;
        break;
      case "+":
        let delta = get_data_cell_change(program_ptr, bf_program);
        output += emit2(output, level, "*data_ptr += ", delta);
        program_ptr += delta;
        break;
      case "-":
        let delta = get_data_cell_change(program_ptr, bf_program);
        output += emit2(output, level, "*data_ptr -= ", delta);
        program_ptr += delta;
        break;
      case ".":
        output += emit(output, level, "std::cout << *data_ptr;");
        break;
      case ",":
        output += emit(output, level, "std::cin >> *data_ptr;");
        break;
      case "[":
        output += emit(output, level, "while (*data_ptr) {");
        level++;
        break;
      case "]":
        level--;
        output += emit(output, level, "}");
        break;
    }
    program_ptr++;
  }
  suffix = `
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
}