echo "Begin Test Compiling . . ." 
g++ -o init_testing.out main.cpp uselibpng.cpp parser.cpp -lpng
echo "Compilation Done"
# Run with "$ bash comp.bash"
# Added -lpng flag to compiler. Why? Idk bro