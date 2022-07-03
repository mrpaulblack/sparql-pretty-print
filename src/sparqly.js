export {parse, type, pretty};

/*
SparQL query parser
Input: a sparql query as string
Output: true if the syntax test passed and false if the syntax test failed
=> It will also console.log and print the failed test if syntax mismatch
*/
function parse(input) {
    //create instructions array
    var instructions  = tokanize(input);
    var i;

    //basic check if there are any instructions
    if (instructions == null)
        return false;

    //check syntax
    for (i = 0; i < instructions.length; i++) {
        var correct = true;
        if (instructions[i][0] == 'SELECT' && !testSelect(instructions[i]))
            correct = false;
        else if (instructions[i][0] == 'ASK' && !testAsk(instructions[i]))
            correct = false;
        else if (instructions[i][0] == 'CONSTRUCT' && !testConstruct(instructions[i]))
            correct = false;
        else if (instructions[i][0] == 'DESCRIBE' && !testDescribe(instructions[i]))
            correct = false;
        else if (instructions[i][0] == 'PREFIX' && !testPrefix(instructions[i]))
            correct = false;
        else if (instructions[i][0] == 'FROM' && !testFrom(instructions[i]))
            correct = false;
        else if (instructions[i][0] == 'WHERE' && !testWhere(instructions[i]))
            correct = false;

        if (!correct) {
            console.log(instructions[i]);
            return false;
        }
    }

    //check query type
    if (testType(instructions) == null)
        return false;

    return true;
}


/*
SparQL query type
Input: a sparql query as string
Output: the type of the query or null if there is no type or multple types defined
=> It will also console.log and print the failed test if syntax mismatch
*/
function type(input) {
    //check if syntax is correct
    if (!parse(input))
        return null;

    //create instructions array and type of function
    var instructions  = tokanize(input);

    //return type of query or null if there is no type or there are multiple types defined
    return testType(instructions);
}

/*
SparQL query prettyfier
Input: a sparql query as string
Output: Formated SparQL or null if it failed the syntax check
=> It will also console.log and print the failed test if syntax mismatch
*/
function pretty(input) {
    //check if syntax is correct
    if (!parse(input))
        return null;

    //create instructions array
    var instructions  = tokanize(input);
    var i, n;

    //generate formated pretty print output
    //TODO FILTER, ORDER BY and so on
    var output = '';
    var inlines = '';
    for (i = 0; i < instructions.length; i++) {
        for (n = 0; n < instructions[i].length; n++) {
            //revert indent when closing braket
            if (instructions[i][n] == '}') {
                inlines = inlines.slice(0, inlines.length -2);
                output = output.slice(0, output.length -2);
            }
            //add instruction to output
            output += instructions[i][n] + ' ';
            //increase indent when opening braket
            if (instructions[i][n] == '{')
                inlines += '  ';
            //add newline and indent when line ending tokens or when next char is closing braket
            if ((instructions[i][n] == '.' || instructions[i][n] == ';' ||  instructions[i][n] == '{' || instructions[i][n] == '}')
                || n < instructions[i].length -1 && instructions[i][n +1] == '}')
                output += '\n' + inlines;
        }
        output += '\n';
    }
    return output;
}

//TODO fix new line \n replacement
//transform tokens in 2d instructions array each first index is one instruction and 2nd index is the tokens for that instruction
function tokanize (input) {
    input.replace(/\n/g,' ');
    var tokens = input.split(' ');
    var instructions = [];
    var instructionsIndex = -1, instructionsPosition = 0;
    var i;

    //return null if there is no input
    if (tokens.length <= 0)
        return null;

    //tokanize
    for (i = 0; i < tokens.length; i++) {
        if (isDefWord(tokens[i]) || isKeyWord(tokens[i]) || i == 0) {
            instructionsIndex += 1;
            instructionsPosition = 0;
            instructions[instructionsIndex] = [];
        }
        instructions[instructionsIndex][instructionsPosition] = tokens[i];
        instructionsPosition += 1;
    }

    //return null if there are no base instructions
    if ((instructionsIndex <= 0 && (!isDefWord(instructions[0][0]))) || (instructionsIndex <= 0 && !isKeyWord(instructions[0][0])))
        return null;

    return instructions;
}

//match query defining keywords
//see: //https://www.iro.umontreal.ca/~lapalme/ift6281/sparql-1_1-cheat-sheet.pdf
function isKeyWord(token) {
    switch(token) {
        case 'SELECT': return true;
        case 'CONSTRUCT': return true;
        case 'ASK': return true;
        case 'DESCRIBE': return true;
        default: return false;
    }
}

//match instruction keywords that do not define the query type
//TODO what about DEFINE????
function isDefWord(token) {
    switch(token) {
        case 'PREFIX': return true;
        case 'FROM': return true;
        case 'WHERE': return true;
        default: return false;
    }
}

//return type of query or null if there is no type or multiple types defines
function testType(instructions) {
    var type = null;
    var i;

    for (i = 0; i < instructions.length; i++) {
        if (isKeyWord(instructions[i][0])) {
            if (type != null) {
                console.log('Type: There are multiple types defined in one query:');
                console.log(instructions[i]);
                return null;
            }
            type = instructions[i][0];
        }
    }

    return type;
}

//check PREFIX syntax
function testPrefix(prefix) {
    if (prefix.length != 3) {
        console.log('Prefix: there are more or less then 3 statements in the instruction');
        return false;
    }
    if (!/[a-zA-Z]*:/g.test(prefix[1])) {
        console.log('Prefix: The first element does not match: [a-zA-Z]*:');
        return false;
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
    var n;
    if (select.length < 2) {
        console.log('Select: There are less then 2 statements in the instruction')
        return false;
    }

    for (n = 1; n < select.length; n++) {
        var correct = false;
        if (select[n] == 'DISTINCT')
            correct = true;
        if (/\?[a-zA-Z]*/g.test(select[n]))
            correct = true;
        if (!correct) {
            console.log('Select: Statement did not match \'DISTINCT\' or \?[a-zA-Z]*');
            return false;
        }
    }

    return true;
}

//check ASK syntax
function testAsk(ask) {
    if (ask.length != 1) {
        console.log('Ask: There is not exaclty one statement in the instruction')
        return false;
    }

    return true;
}

//check DESCRIBE syntax
//TODO write actual test!!!
function testDescribe(describe) {
    return true;
}

//check CONSTRUCT syntax
//TODO write actual test!!!
function testConstruct(consctruct) {
    return true;
}

//check FROM syntax
function testFrom(from) {
    if (from.length != 2) {
        console.log('From: There are more or less then 2 statements in the instruction');
        return false;
    }
    if (!/<.*>/g.test(from[1])) {
        console.log('From: The second statement does not match <.*>');
        return false;
    }

    return true;
}

//check WHERE syntax
//TODO need to test inside body (valid triples and filter?) {}
//TODO isntructions like ORDER BY or limit at the end
function testWhere(where) {
    if (where.length < 3) {
        console.log('Where: There are less the 3 statements in the instruction');
        return false;
    }
    if (where[1] != '{') {
        console.log('Where: The second statement is not a {');
        return false;
    }
    if (where[where.length -1] != '}') {
        console.log('Where: The last statement in the isntruction is not a }');
        return false;
    }

    return true;
}
