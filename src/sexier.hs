tanga = ["lol", "No Way", "dafaq", "befehl\nlol", "prove\n"]
untanga = "lol\nNo Way\ndafaq\n"
testString = "PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX res: <http://dbpedia.org/resource/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"

removeN xs = [ x | x <- xs, not (x `elem` "\n")]

--test

