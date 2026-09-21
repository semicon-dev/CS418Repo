# BASE MAKEFILE - - - 
#.PHONEY: build, run

# COMPILER FLAGS - - -
COMP_FLAGS = -Wall -g

build: program

run: program
	./program $(file)

program: main.cpp ./libs/uselibpng.cpp parser.cpp
	clang++ -O3 -I. main.cpp parser.cpp ./libs/uselibpng.cpp -lpng $(COMP_FLAGS) -o program 

# CLEANING
clean: 
	rm -r simple.png messy1.png messy2.png program