console.log(parseSparql("PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX res: <http://dbpedia.org/resource/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> FROM <https://paulgo.io/sparlql> SELECT DISTINCT ?string WHERE { res:Leipzig dbo:areaCode ?string . }"));



function parseSparql(input) {
    //convert to array
    input.replace(/\n/g,' ');
    var tokens = input.split(' ');
    var instructions = [];
    var instructionsIndex = -1;
    var instructionsPosition = 0;

    //tokanize
    for (i = 0; i < tokens.length; i++) {
        if (isDefWord(tokens[i])) {
            instructionsIndex += 1;
            instructionsPosition = 0;
            instructions[instructionsIndex] = [];
        }
        instructions[instructionsIndex][instructionsPosition] = tokens[i];
        instructionsPosition += 1;
    }

    //check syntax
    for (i = 0; i < instructions.length; i++) {
        if (instructions[i][0] == 'PREFIX' && !testPrefix(instructions[i]))
            return null;
        else if (instructions[i][0] == 'SELECT' && !testSelect(instructions[i]))
            return null;
        else if (instructions[i][0] == 'FROM' && !testFrom(instructions[i]))
            return null;
        else if (instructions[i][0] == 'WHERE' && !testWhere(instructions[i]))
            return null;
    }

    //generate formated pretty print output
    //TODO correct newlines and indentation
    var output = '';
    for (i = 0; i < instructions.length; i++) {
        for (n = 0; n < instructions[i].length; n++) {
            output += instructions[i][n] + ' ';
            if (instructions[i][n] == '.' ||  instructions[i][n] == '{')
                output += '\n';
        }
        output += '\n';
    }
    return output;
}

//match instruction keywords
//TODO what about ASK!!!???
function isDefWord(token) {
    switch(token) {
        case 'PREFIX': return true;
        case 'SELECT': return true;
        case 'FROM': return true;
        case 'WHERE': return true;
        default: return false;
    }
}

//check PREFIX syntax
function testPrefix(prefix) {
    if (prefix.length != 3) {
        console.log('Prefix: there are more or less then 3 elements');
        return false;
    }
    if (!/[a-zA-Z].*:/g.test(prefix[1])) {
        console.log('Prefix: The first element does not match: [a-zA-Z]:');
    }
    if (!/<.*>/g.test(prefix[2])) {
        console.log('Prefix: The second element does not match: <.*>');
        return false;
    }

    return true;
}

//check SELECT syntax
//TODO need to support () expressions and {} expressions
function testSelect(select) {
    if (select.length < 2)
        return false;

    for (n = 1; n < select.length; n++) {
        var correct = false;
        if (select[n] == 'DISTINCT')
            correct = true;
        if (/\?[a-zA-z].*/g.test(select[n]))
            correct = true;
        if (!correct)
             return false;
    }

    return true;
}

//check FROM syntax
function testFrom(from) {
    if (from.length != 2)
        return false;
    if (!/<.*>/g.test(from[1]))
        return false;

    return true;
}

//check WHERE syntax
//TODO need to test inside body (valid triples and filter?) {}
//TODO isntructions like ORDER BY or limit at the end
function testWhere(where) {
    if (where.length < 3)
        return false;
    if (where[0] != 'WHERE')
        return false;
    if (where[1] != '{')
        return false;
    if (where[where.length -1] != '}') 
        return false;
    
    return true;
}
