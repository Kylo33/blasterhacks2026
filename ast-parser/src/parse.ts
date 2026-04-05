import { Node, Varia, Identifier } from './types.ts'
import { IfStatementi, Equ, Neq, Gt, Lt, Gte, Lte, CmpType } from './ops.ts'
import './shapes.ts'
import { Context } from './context.ts'

const cmp_map = Record<string, CmpType>;
cmp_map["=="] = Equ;
cmp_map["!="] = Neq;
cmp_map[">"] = Gt;
cmp_map["<"] = Lt;
cmp_map[">="] = Gte;
cmp_map["<="] = Lte;

function parse_dict(ast: Record<string, any>, context: Context): Node {
  if (ast['name'] != undefined) {
    if (ast['name'] == 'have') {
      let content = parse_dict(ast['expr'], context);
      let identifier = new Identifier (ast['id'], content);
      return identifier
    }
    if (ast['name'] == 'if') {
      
      let statement = new IfStatement ()
    }
  }
}

function parse(ast: Array<Record<string, any>>, context: Context) {
  let graph = Array<Node>;
  for (const stmt: Record<string, any> of ast) {
    parse_dict(stmt, context);
  }
}
