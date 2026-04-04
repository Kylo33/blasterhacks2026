Program
	= Stmts

Table
	= "{" _ "}" { return []; }
    / "{" _ firstDcl:TablePairDcl _ restDcls:(_ "," _ TablePairDcl _)* ","?  _ "}" { return restDcls.length ? { ...firstDcl, ...Object.assign(...restDcls.map(dcl => dcl[2]))} : firstDcl; }

TablePairDcl
	= id:Identifier _ ":" _ expr:Expression { let tab = {}; tab[id] = expr; return tab; }

TableTypeDef
	= "{" _ "}" { return []; }
    / "{" _ firstDcl:TableTypePairDcl _ restDcls:("," _ TableTypePairDcl _)* ","?  _ "}" { return restDcls.length ? { ...firstDcl, ...Object.assign(...restDcls.map(dcl => dcl[2]))} : firstDcl; }

TableTypePairDcl
	= id:Identifier _ ":" _ type:Type {let tab = {}; tab[id] = type; return tab; }
    
Type
	= "color"
    / "numba"
    / "array"
    / "table"
    / "funct"
    / "shape"
    / "strin"
    / "nil"

Identifier "identifier"
	= color:[a-zA-Z_]+ { return color.join(''); }
    
Expression
    = FunctCall
	/ Color
    / Number
    / String
    / Array
    / Funct
    / Table
    / Identifier
    / "nil"

Color
	= "#" color:HexDigit|6| { return `#${color.join('')}`; }
	/ "#" color:HexDigit|3| { return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`; }

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
  
Funct
	= TableTypeDef _ "->" _ Type _ "{"  __ (Stmts __)? "}"

FunctCall
	= Identifier _ Table
    
Paint
	= "paint" __ Expression

Assignment
	= "let" __ Identifier _ (":" _ Type _)? "=" _ Expression

Return
	= "return" __ Expression

HexDigit = [0-9a-fA-F]
_ "whitespace" = [ \t\n\r]*
__ "mandatory whitespace" = [ \t\n\r]+

