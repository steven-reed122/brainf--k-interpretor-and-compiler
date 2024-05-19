// This is a simple brainfuck compiler that takes a string of
// commands in brainfuck and creates C++ code from it
// that will execute the brainfuck code

function emit(level, str) {
  let indent = '';
  while (level-- > 0) {
    indent += "    ";
  }
  return indent + str + "\n";
}

function run_bf_compiler() {
  const bf_code_textarea = document.getElementById('bf-code');
  const compiled_bf_code_textarea = document.getElementById('compiled-bf-code-output');
  text = bf_code_textarea.value;
  compiled_text = bf_compiler(text);
  compiled_bf_code_textarea.value = compiled_text;
}

function bf_compiler(bf_code) {
  let output = '';
  let level = 1;
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

  output += prefix;

  for (const char of bf_code) {
    switch (char) {
      case '>':
        output += emit(level, "++data_ptr;");
        break;
      case '<':
        output += emit(level, "--data_ptr;");
        break;
      case '+':
        output += emit(level, "++*data_ptr;");
        break;
      case '-':
        output += emit(level, "--*data_ptr;");
        break;
      case '.':
        output += emit(level, "std::putchar(*data_ptr);");
        break;
      case ',':
        output += emit(level, "*data_ptr = std::getchar();");
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
  }

  output += suffix;

  console.log(output);
  return output;
}