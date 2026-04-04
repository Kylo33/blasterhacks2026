Table
    = "{" _ TableLine* _ "}"
    
TableLine
	= TableDcl _ ","
    
TableDcl
	= Identifier _ ":" _ Expression
    
Identifier
	= [a-zA-Z_]+
    
Expression
	= Color
    
Color
	= "#" color:HexDigit|6| { return `#${color.join('')}`; }
	/ "#" color:HexDigit|3| { return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`; }
    
    
HexDigit = [0-9a-fA-F]
_ "whitespace" = [ \t\n\r]*
__ "mandatory whitespace" = [ \t\n\r]+
