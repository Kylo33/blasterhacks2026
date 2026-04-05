import { Varia, Identifier } from './types.ts'
import './ops.ts'
import './shapes.ts'
import { Context } from './context.ts'

function parse_dict(ast: Record<string, any>, context: Context): Node {
  if (ast['name'] != undefined) {
    if (ast['name'] == 'have') {
      let content = parse_dict(ast['expr'], context);
      let identifier = new Identifier (ast['id'], content);
      return identifier
    }
  }
}

function parse(ast: Array<Record<string, any>>, context: Context) {
  let graph = Array<Node>;
  for (const stmt: Record<string, any> of ast) {
    parse_dict(stmt, context);
  }
}
