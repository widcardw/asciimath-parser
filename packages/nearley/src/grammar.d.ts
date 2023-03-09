import { CompiledRules } from "nearley"
import { Lexer } from "./moo.esm"
declare const initGrammar: (Lexer) => CompiledRules
export default initGrammar