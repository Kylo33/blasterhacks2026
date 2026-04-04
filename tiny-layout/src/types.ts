export type TinyType =
  | "color"
  | "numba"
  | "array"
  | "table"
  | "funct"
  | "shape"
  | "strin"
  | "zilch"
  | "truth";

export type Table = Record<string, Expression>;
export type TableTypeDef = Record<string, TinyType>;

export interface Funct {
  args: TableTypeDef;
  ret: TinyType;
  stmts: Stmt[];
}

export interface FunctCall {
  id: string;
  param: Table;
}

export type ExprAtom =
  | { type: "funct"; value: Funct }
  | { type: "call"; value: FunctCall }
  | { type: "color"; value: string }
  | { type: "numba"; value: number }
  | { type: "strin"; value: string }
  | { type: "array"; value: Expression[] }
  | { type: "table"; value: Table }
  | { type: "identifier"; value: string }
  | { type: "truth"; value: boolean }
  | { type: "zilch"; value: "zilch" };

export type BinaryOp = "+" | "-" | "*" | "/" | "and" | "or" | ">=" | "<=" | "<" | ">" | "==" | "!=";
export type BinaryExpr = [BinaryOp, Expression, Expression];
export type NotExpr = ["not", Expression];

export type Expression = ExprAtom | BinaryExpr | NotExpr;

export interface PaintStmt {
  name: "paint";
  expr: Expression;
}

export interface AssignmentStmt {
  name: "have";
  id: string;
  expr: Expression;
}

export interface ReturnStmt {
  name: "return";
  expr: Expression;
}

export interface IfStmt {
  name: "if";
  cond: Expression;
  stmts: Stmt[];
}

export type Stmt = PaintStmt | AssignmentStmt | ReturnStmt | IfStmt;

export type Program = Stmt[];
