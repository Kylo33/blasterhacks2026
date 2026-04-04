Program
	= TruthLogicExpr

Table
	= "{" _ "}" { return {}; }
    / "{" _ firstDcl:TablePairDcl _ restDcls:(_ "," _ TablePairDcl _)* ","?  _ "}" { return restDcls.length ? { ...firstDcl, ...Object.assign(...restDcls.map(dcl => dcl[3]))} : firstDcl; }

TablePairDcl
	= id:Identifier _ ":" _ expr:Expression { let tab = {}; tab[id] = expr; return tab; }

TableTypeDef
	= "{" _ "}" { return {}; }
    / "{" _ firstDcl:TableTypePairDcl _ restDcls:("," _ TableTypePairDcl _)* ","?  _ "}" { return restDcls.length ? { ...firstDcl, ...Object.assign(...restDcls.map(dcl => dcl[2]))} : firstDcl; }

TableTypePairDcl
	= id:Identifier _ ":" _ type:Type {let tab = {}; tab[id] = type; return tab; }
    
Type "type"
	= "color"
    / "numba"
    / "array"
    / "table"
    / "funct"
    / "shape"
    / "strin"
    / "zilch"
    / "truth"

Identifier "identifier"
	= name:[a-zA-Z_]+ { return name.join(''); }
    
Expression "expression"
	= TruthLogicExpr
    
TruthLogicExpr
	= first:Negation rest:(__ TruthOperator __ Negation)* {
    	if (!rest.length) return first;
        let ans = first;
        for(let i = 0; i < rest.length; i++) {
        	ans = [rest[i][1], ans, rest[i][3]];
        }
        return ans;
    }

TruthOperator
	= "and"
    / "or"

Negation
	= "not" __ rest:Comparison { return ["not", rest] }
    / Comparison
    
Comparison
	= first:Sum rest:(_ CmpOperator _ Sum)? {
    	if (!rest) return first;
        return [rest[1], first, rest[3]];
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
        return ans;
    }

Product "product"
	= first:ExprAtom rest:(_ [*/] _ ExprAtom)* {
    	if (!rest.length) return first;
        let ans = first;
        for(let i = 0; i < rest.length; i++) {
        	ans = [rest[i][1], ans, rest[i][3]];
        }
        return ans;
    }

ExprAtom "expression atom"
    = FunctCall
	/ x:Color { return {type: "color", value: x}; }
    / x:Number { return {type: "numba", value: x}; }
    / x:String { return {type: "strin", value: x}; }
    / x:Array { return {type: "array", value: x}; }
    / x:Funct { return {type: "funct", value: x}; }
    / x:Table { return {type: "table", value: x}; }
    / x:Identifier { return {type: "identifier", value: x}; }
    / x:Truth { return {type: "truth", value: x}; }
    / "(" _ expr: Expression _ ")" { return expr; }
    / "zilch"

Color
	= "#" color:HexDigit|6| { return `#${color.join('')}`; }
	/ "#" color:HexDigit|3| { return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`; }

Truth
	= "true"
    / "false"

Number
	= int:[0-9] + decimal:("." [0-9]+)? { return decimal === null ? parseFloat(`${int.join("")}`) : parseFloat(`${int.join("")}.${decimal[1].join("")}`); }

String
	= '"' chars:Character* '"' { return chars.join(""); }

Character
	= '\\' esc:EscapeSequence { return esc; }
    / [^"]

Array
	= "[" _ "]" { return []; }
	/ "[" _ firstExpr:Expression restExprs:(_ "," _ Expression _)* ","? _ "]" { return [firstExpr, ...restExprs.map(expr => expr[3])]; }

EscapeSequence
  = '"'  { return '"'; }
  / "\\" { return "\\"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  
Stmts
	= (_ Stmt)*

Stmt
    = Paint _ ";"
    / Assignment _ ";"
    / Return _ ";"
    / If _ ";"
  
Funct
	= TableTypeDef _ "->" _ Type _ "{"  __ (Stmts __)? "}"

FunctCall
	= Identifier _ Table
    
Paint
	= "paint" __ Expression

Assignment
	= "have" __ Identifier _ (":" _ Type _)? "=" _ Expression

Return
	= "return" __ Expression
    
If
	= "if" __ Expression _ "{" __ (Stmts __)? "}"

HexDigit = [0-9a-fA-F]
_ "whitespace" = [ \t\n\r]*
__ "mandatory whitespace" = [ \t\n\r]+

