# SparQLy
a small university project to format SparQL queries in a unified way.



### How to test

* Clone this repo: ```git clone https://github.com/mrpaulblack/sparqly.git```

* Change into the cloned directory: ```cd sparqly```

* Run the examples: ```node ./src/examples.js```



### How to use in your own project

* Install the dependency in your project: ```npm -i https://github.com/mrpaulblack/sparqly```

* In a new js file: ```import * as sparqly from './sparqly.js';```

* You can use either the `sparqly.parse([STRING])` function which returns true if the syntax is correct or false if the syntax is incorrect; It will also log the reason for failing the syntax test to console

* There is also the `sparqly.pretty([STRING])` function which will also test the syntax for correctnis and on top of that return a string with a prettyfied version of the sparql query; will return null if the syntax test failed

* Ther is the `sparqly.type([STRING])` function that will return the type of the SparQL query
