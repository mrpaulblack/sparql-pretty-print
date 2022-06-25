import * as sparql from './sparql-parser.js';

//example: parse and prettify sparql query
console.log(sparql.parse("PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX res: <http://dbpedia.org/resource/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> FROM <https://paulgo.io/sparlql> SELECT DISTINCT ?string WHERE { res:Leipzig dbo:areaCode ?string . }"));
console.log(sparql.pretty("PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX res: <http://dbpedia.org/resource/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> FROM <https://paulgo.io/sparlql> SELECT DISTINCT ?string WHERE { res:Leipzig dbo:areaCode ?string . }"));
