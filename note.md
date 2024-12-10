change id for the cloned node. Clone first and append after
to clear the results use innetHTML = ""

open new tab with the Size quick filter





COMPARE function

easy
change the background and show/activate a button Compare
add name to search param

WAY 1
- add h5 Compare [n] somewhere in the header / near search
- add a p "Compare" to all breed divs
- when p is clicked, add the id to an array and display Compare[n+1] in the header
- when h5 is clicked, open a new tab with the comparison charts

WAY 2
- add h5 Compare somewhere in the header / near search
- when h5 is clicked, add checkboxes to all breed divs
- to do that we need to add a class to all divs?
- checkbox value is breed id
- add it to the comparison array
- when checkbox is checked and array's length is >=2, display a button Compare
- when a button is clicked, open a new tab with comparison