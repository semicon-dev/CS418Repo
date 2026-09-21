echo "Begin Test Compiling . . ." 
clang++ -o ./outputs/run.out main.cpp ./libs/uselibpng.cpp parse.cpp draw.cpp operations.cpp -lpng
echo "Compilation Done"
# Run with "$ bash comp.bash"
# Added -lpng flag to compiler. Why? Idk bro
# Main plan here is to use this for quick updates without consistently
# needing to channge the makefile during development