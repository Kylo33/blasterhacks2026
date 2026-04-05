Program
	= stmts:Stmts

Stmts
	= stmts:(_ Stmt _)|0..,_| { return {type: "stmts", value: stmts.map(s=>s[1])}; }

Stmt
    = x:Paint _ ";" {return x;}
    / x:Assignment _ ";" {return x;}
    / x:Return _ ";" {return x;}
    / x:If _ ";" {return x;}

// --- STATEMENTS ---

Paint
	= "paint" __ expr:Expression { return {type: "paint", expr}; }

Assignment
	= "have" __ id:Identifier _ "=" _ expr:Expression {return {type: "have", id, expr}; }

Return
	= "return" expr:(__ Expression)? { return !expr ? {type: "return"} : {type: "return", expr: expr[1]}; }

If
	= "if" __ expr:Expression _ "{" _ stmts:Stmts _ "}" {return {type: "if", expr, stmts};}

Identifier "identifier"
	= name:[a-zA-Z_]+ { return {type: "identifier", value: name.join('')}; }

// --- TABLES ---

Table
	= "{" _ "}" { return {type: "table", value: {}}; }
    / "{" _ firstDcl:TablePairDcl _ restDcls:(_ "," _ TablePairDcl _)* ","?  _ "}" { return restDcls.length ? {type: "table", value: [firstDcl, ...restDcls.map(r=>r[3])]} : {type: "table", value: [firstDcl]}; }

TablePairDcl
	= id:Identifier _ ":" _ expr:Expression { return {type: "tablePairDcl", id, expr}; }

// --- EXPRESSIONS ---

Expression "expression"
	= OrExpr
    
OrExpr
	= first:AndExpr rest:(__ "or" __ AndExpr)* {
    	if (!rest.length) return first;
        let ans = first;
        for(let i = 0; i < rest.length; i++) {
        	ans = [rest[i][1], ans, rest[i][3]];
        }
        
        return {type: "infix", operator: "||", values: ans.slice(1)};
    }
    
AndExpr
	= first:Negation rest:(__ "and" __ Negation)* {
    	if (!rest.length) return first;
        let ans = first;
        for(let i = 0; i < rest.length; i++) {
        	ans = [rest[i][1], ans, rest[i][3]];
        }
        return {type: "infix", operator: "&&", values: ans.slice(1)};
    }
    
Negation
	= "not" __ value:Comparison { return {type: "negation", value}; }
    / Comparison
    
Comparison
	= first:Sum rest:(_ CmpOperator _ Sum)? {
    	if (!rest) return first;
        return {type: "infix", operator: rest[1], values: [first, rest[3]]};
    }

CmpOperator
	= ">="
    / "<="
    / "<"
    / ">"
    / "=="
    / "!="

Sum "sum"
	= first:Product rest:(_ [+-] _ Product)* {
    	if (!rest.length) return first;
        let ans = first;
        for(let i = 0; i < rest.length; i++) {
        	ans = [rest[i][1], ans, rest[i][3]];
        }
        return {type: "operation", operator: ans[0], values: ans.slice(1)};
    }

Product "product"
	= first:ExprAtom rest:(_ [*/] _ ExprAtom)* {
    	if (!rest.length) return first;
        let ans = first;
        for(let i = 0; i < rest.length; i++) {
        	ans = [rest[i][1], ans, rest[i][3]];
        }
        return {type: "operation", operator: ans[0], values: ans.slice(1)};
    }

ExprAtom "expression atom"
    = Funct
    / FunctCall
    / Number
    / String
    / Table
    / Truth
    / "(" _ expr:Expression _ ")" {return expr;}
    / Identifier

// --- PRIMATIVES/LITERALS ---

Truth
	= "true" {return {type: "truth", value: true};}
    / "false" {return {type: "truth", value: false};}

Number
	= int:[0-9] + decimal:("." [0-9]+)? { return {type: "number", value: decimal === null ? parseFloat(`${int.join("")}`) : parseFloat(`${int.join("")}.${decimal[1].join("")}`)}; }

String
	= '"' chars:Character* '"' { return {type: "string", value: chars.join("")}; }

Character
	= '\\' esc:EscapeSequence { return esc; }
    / [^"]

EscapeSequence
  = '"'  { return '"'; }
  / "\\" { return "\\"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }

// --- FUNCTIONS ---

Funct
	= args:Args _ "{" _ stmts:Stmts _ "}" { return {type: "function", args, stmts}; }

Args
    = "|" _ "|" { return {type: "args", value: []}; }
    / "|" _ first:Identifier _ rest:(_ "," _ Identifier _)* ","?  _ "|" { return {type: "args", value: [first, ...rest.map(r=>r[3])]}; }

FunctCall
	= id:Identifier _ args:Table { return {type: "call", id, args} }

_ "whitespace" = [ \t\n\r]*
__ "mandatory whitespace" = [ \t\n\r]+

