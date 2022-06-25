# sparql-pretty-print
a small university project to format sparql queries in a unified way.

### How to run?

```node ./src/index.js```


### How to use in your own project

```import * as sparql from './sparql-parser.js';```

* You can use either the `.parse([STRING])` function which returns true if the syntax is correct or false if the syntax is incorrect; It will also log the reason for failing the syntax test to console

* There is also the `.pretty([STRING])` function which will also test the syntax for correctnis and on top of that return a string with a prettyfied version of the sparql query; will return null if the syntax test failed
