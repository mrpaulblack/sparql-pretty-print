//sparql examples: https://sparql.uniprot.org/.well-known/sparql-examples/

import * as sparqly from './sparqly.js';

//example: sparql queries with incorrect syntax
console.log(sparqly.parse('wrong syntax'));
console.log(sparqly.pretty(''));
console.log(sparqly.type(''));

//example: parse and prettify sparql query
console.log(sparqly.parse("PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX res: <http://dbpedia.org/resource/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT DISTINCT ?string WHERE { res:Leipzig dbo:areaCode ?string . }"));
console.log(sparqly.pretty("PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX res: <http://dbpedia.org/resource/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT DISTINCT ?string WHERE { res:Leipzig dbo:areaCode ?string . }"));
