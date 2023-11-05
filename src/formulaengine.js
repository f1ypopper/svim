import { Cell } from "./cell.js";

const tokenType = {
  Cell: "CELL",
  Plus: "PLUS",
  Star: "STAR",
  Minus: "MINUS",
  Slash: "SLASH",
  LeftParen: "LEFT_PAREN",
  RightParen: "RIGHT_PAREN",
  Literal: "LITERAL",
  FuncName: "FUNC_NAME",
  Comma: "COMMA",
  Eof: "EOF",
};
function isLetter(character) {
  var alphabetPattern = /^[a-zA-Z]$/;
  return alphabetPattern.test(character);
}
function isNumber(character) {
  return !isNaN(parseInt(character)) && isFinite(character);
}
class Lexer {
  constructor(source) {
    this.source = source;
    this.start = 0;
    this.current = 0;
    this.length = source.length;
    this.tokens = [];
    this.deps = new Set(); //All the cells this formula depends on
  }

  createToken(tokenType, lexeme) {
    return { type: tokenType, lexeme: lexeme };
  }

  addToken(tokenType) {
    this.tokens.push(this.createToken(tokenType, null));
  }

  addFuncToken(fnName) {
    this.tokens.push({ type: tokenType.FuncName, fnName: fnName });
  }

  addCellToken(row, col) {
    this.tokens.push({ type: tokenType.Cell, row: row, col: col });
  }
  addLiteralToken(value) {
    this.tokens.push({ type: tokenType.Literal, value: value });
  }
  tokenize() {
    while (!this.atEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push({ type: tokenType.Eof });
    return { tokens: this.tokens, deps: this.deps };
  }

  scanInt() {
    //console.log(this.source[this.start]);
    while (isNumber(this.peek()) && !this.atEnd()) {
      this.advance();
    }
    return parseInt(this.source.substring(this.start, this.current));
  }

  scanFloat() {
    while (isNumber(this.peek()) && !this.atEnd()) {
      this.advance();
    }
    if (this.peek() === "." && isNumber(this.peekNext())) {
      this.advance();
      while (isNumber(this.peek())) {
        this.advance();
      }
    }
    return parseFloat(this.source.substring(this.start, this.current));
  }

  scanToken() {
    let c = this.advance();
    switch (c) {
      case "+": {
        return this.addToken(tokenType.Plus);
        break;
      }
      case "-": {
        return this.addToken(tokenType.Minus);
        break;
      }
      case "/": {
        return this.addToken(tokenType.Slash);
        break;
      }
      case "*": {
        return this.addToken(tokenType.Star);
        break;
      }
      case "(": {
        return this.addToken(tokenType.LeftParen);
        break;
      }
      case ")": {
        return this.addToken(tokenType.RightParen);
        break;
      }
      case ",": {
        return this.addToken(tokenType.Comma);
        break;
      }
      case " ": {
        return;
        break;
      }
      default: {
        if (isLetter(c)) {
          while (isLetter(this.peek()) && !this.atEnd()) {
            this.advance();
          }
          let lexeme = this.source.substring(this.start, this.current);
          //Check wether cell cordinate or not
          if (isNumber(this.peek())) {
            //It's a Cell
            this.start = this.current;
            let row = this.scanInt();
            let col = colLabel2Num(lexeme);
            this.addCellToken(row, col);
            this.deps.add(new Cell(row, col));
          } else {
            //It's a Func Name
            this.addFuncToken(lexeme);
          }
        } else if (isNumber(c)) {
          //Number Literal
          let literal = this.scanFloat();
          this.addLiteralToken(literal);
        }
      }
    }
  }

  advance() {
    return this.source[this.current++];
  }
  atEnd() {
    return this.current > this.length - 1;
  }
  peek() {
    return this.source[this.current];
  }
  peekNext() {
    return this.source[this.current + 1];
  }
}

class Expr {
  constructor() {}
}

class BinaryExpr extends Expr {
  constructor(left, operator, right) {
    super();
    this.right = right;
    this.operator = operator;
    this.left = left;
  }

  accept(visitor) {
    return visitor.visitBinary(this);
  }
}

class UnaryExpr extends Expr {
  constructor(operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitUnary(this);
  }
}

class LiteralExpr extends Expr {
  constructor(literal) {
    super();
    this.literal = literal;
  }
  accept(visitor) {
    return visitor.visitLiteral(this);
  }
}

class CallExpr extends Expr {
  constructor(fname, args) {
    super();
    this.fname = fname;
    this.args = args;
  }
  accept(visitor) {
    return visitor.visitCall(this);
  }
}
class GroupExpr extends Expr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
  accept(visitor) {
    return visitor.visitGroup(this);
  }
}
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.length = tokens.length;
    this.current = 0;
    this.start = 0;
  }

  expression() {
    let expr = this.term();
    return expr;
  }

  term() {
    let expr = this.factor();

    while (this.match(tokenType.Plus, tokenType.Minus)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  factor() {
    let expr = this.unary();

    while (this.match(tokenType.Star, tokenType.Slash)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  unary() {
    if (this.match(tokenType.Minus)) {
      let operator = this.previous();
      let right = this.unary();
      return new UnaryExpr(operator, right);
    }
    return this.primary();
  }

  primary() {
    if (this.match(tokenType.LeftParen)) {
      let expr = this.expression();
      this.consume(tokenType.RightParen, "Expect ')' after expression.");
      return new GroupExpr(expr);
    }

    if (this.match(tokenType.Cell, tokenType.Literal)) {
      let literal = this.previous();
      return new LiteralExpr(literal);
    }

    if (this.match(tokenType.FuncName)) {
      let fname = this.previous();
      let args = [];
      this.consume(tokenType.LeftParen, "Expect '(' after function name.");
      if (!this.check(tokenType.RightParen)) {
        do {
          args.push(this.expression());
        } while (this.match(tokenType.Comma));
      }
      this.consume(tokenType.RightParen, "Expect ')' after function name.");
      return new CallExpr(fname, args);
    }
  }

  consume(type, message) {
    if (this.check(type)) {
      return this.advance();
    }
    throw message;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.atEnd()) {
      return false;
    }
    return this.peek().type === type;
  }

  advance() {
    if (!this.atEnd()) {
      this.current++;
    }
    return this.previous();
  }

  atEnd() {
    return this.peek().type === tokenType.Eof;
  }

  peek() {
    return this.tokens.at(this.current);
  }

  previous() {
    return this.tokens.at(this.current - 1);
  }
}

export function parse(source) {
  let lexer = new Lexer(source);
  let tokens_and_deps = lexer.tokenize();
  let parser = new Parser(tokens_and_deps.tokens);
  let expr = parser.expression();
  return { expr: expr, deps: tokens_and_deps.deps };
}

export class Executor {
  constructor(expr) {
    this.expr = expr;
  }

  execute() {
    return this.expr.accept(this);
  }

  visitBinary(binaryExpr) {
    let left = binaryExpr.left.accept(this);
    let operator = binaryExpr.operator;
    let right = binaryExpr.right.accept(this);
    let value = 0;
    switch (operator.type) {
      case tokenType.Plus: {
        value = left + right;
        break;
      }
      case tokenType.Minus: {
        value = left - right;
        break;
      }
      case tokenType.Slash: {
        value = left / right;
        break;
      }
      case tokenType.Star: {
        value = left * right;
        break;
      }
    }
    return value;
  }
  visitGroup(groupExpr) {
    return groupExpr.expr.accept(this);
  }
  visitUnary(unaryExpr) {
    //TODO: Assumed operator
    let right = unaryExpr.right.accept(this);
    let operator = unaryExpr.operator;
    return -right;
  }
  visitCall(callExpr) {
    //TODO
  }
  visitLiteral(literalExpr) {
    //TODO: Cell
    if (literalExpr.literal.type === tokenType.Literal) {
      return literalExpr.literal.value;
    } else if (literalExpr.literal.type === tokenType.Cell) {
      let cell = getInputCell(literalExpr.literal.col, literalExpr.literal.row);
      return parseFloat(cell.value);
    }
  }
}
