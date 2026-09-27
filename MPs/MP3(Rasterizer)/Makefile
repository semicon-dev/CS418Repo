# BASE MAKEFILE - - - 
#.PHONEY: build, run

# COMPILER FLAGS - - -
COMP_FLAGS = -Wall -g

build: program

run: program
	./program $(file)

program: main.cpp ./libs/uselibpng.cpp ./operations.cpp ./parse.cpp ./draw.cpp
	clang++ -O3 -I. main.cpp ./libs/uselibpng.cpp ./operations.cpp ./parse.cpp ./draw.cpp -lpng $(COMP_FLAGS) -o program 

# CLEANING
clean: 
	rm -r program