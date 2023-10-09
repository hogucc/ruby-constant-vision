# RubyConstantVision

Ruby Constant Vision is a Visual Studio Code extension designed to enhance navigation and understanding of constants within your Ruby projects, utilizing the [ConstantVision](https://github.com/hogucc/constant_vision) Ruby gem.

## Note: This project is currently under development.

While we are working hard to provide a stable experience, please be aware that functionality might be subject to change and some features may exhibit unstable behavior. We appreciate your patience and welcome feedback and contributions to enhance the project.

## Features

- **Constant Origin Identification**: Display the referenced constant in your Ruby code to understand its originating module/class.
- **Constant Usage Insights**: Display a list of potential reference candidates for a particular constant within your codebase.

## Requirements

- [ConstantVision Ruby Gem](https://github.com/hogucc/constant_vision)
- [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
  
Ensure the `ConstantVision` gem is installed in your Ruby environment:

```shell
$ gem install constant_vision
```

## Usage
### Finding the Origin of a Constant and Locating a Constant
Select a constant in your Ruby file within VSCode to view its origin information and usage insights, displayed inline in the editor.

## Contributing
Please fork the repository and submit a pull request.

## Issues
Submit the issues if you find any bug or have any suggestion.

## License
This extension is available as open source under the terms of the MIT License.
