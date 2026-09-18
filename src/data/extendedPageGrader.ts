import * as ts from "typescript";
import type { GradeResult, GradeTest } from "./codeGrader";

export const extendedCodePages = ["react-p5", "components-p2", "zod-p4", "forms-p3", "typescript-p5", "hono-p5"];

const parse = (code: string, name = "answer.tsx") => ts.createSourceFile(name, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function nodes(root: ts.Node, predicate: (node: ts.Node) => boolean): ts.Node[] {
  const found: ts.Node[] = [];
  const visit = (node: ts.Node) => { if (predicate(node)) found.push(node); ts.forEachChild(node, visit); };
  visit(root);
  return found;
}
const compact = (node: ts.Node) => ts.createPrinter({ removeComments: true }).printNode(ts.EmitHint.Unspecified, node, node.getSourceFile()).replace(/\s+/g, "");
const functions = (root: ts.Node, name: string) => nodes(root, n => ts.isFunctionDeclaration(n) && n.name?.text === name) as ts.FunctionDeclaration[];
const calls = (root: ts.Node, name: string) => nodes(root, n => ts.isCallExpression(n) && compact(n.expression) === name) as ts.CallExpression[];
function returned(root: ts.Node, predicate: (node: ts.Node) => boolean) {
  return nodes(root, ts.isReturnStatement).some(n => ts.isReturnStatement(n) && n.expression && nodes(n.expression, predicate).length > 0);
}
function property(root: ts.Node, name: string, value: string) {
  return nodes(root, n => ts.isPropertyAssignment(n) && n.name.getText().replace(/["']/g, "") === name && compact(n.initializer) === value).length > 0;
}
type Tag = ts.JsxOpeningElement | ts.JsxSelfClosingElement;
function tags(root: ts.Node, name: string): Tag[] {
  return nodes(root, n => (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && n.tagName.getText() === name) as Tag[];
}
function attr(tag: Tag, name: string) {
  const item = tag.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText() === name);
  if (!item || !ts.isJsxAttribute(item)) return undefined;
  if (!item.initializer) return "true";
  if (ts.isStringLiteral(item.initializer)) return item.initializer.text;
  return ts.isJsxExpression(item.initializer) && item.initializer.expression ? compact(item.initializer.expression) : undefined;
}
function splitFiles(code: string) {
  const sections = code.split(/^\s*\/\/\s*(\w+\.tsx?)\s*(?:—[^\n]*)?\r?\n/gm);
  const files = new Map<string, ts.SourceFile>();
  if (sections.length === 1) return files;
  if (sections[0].trim()) throw new Error("Skriv filnamnen som kommentarer: // Button.tsx, // App.tsx eller // api.ts och // client.ts.");
  for (let i = 1; i < sections.length; i += 2) {
    if (files.has(sections[i])) throw new Error(`Filavsnittet ${sections[i]} finns två gånger.`);
    files.set(sections[i], parse(sections[i + 1], sections[i]));
  }
  return files;
}
function syntaxError(source: ts.SourceFile) {
  const result = ts.transpileModule(source.text, { fileName: source.fileName, reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } });
  const error = result.diagnostics?.find(d => d.category === ts.DiagnosticCategory.Error);
  return error && `${source.fileName}: ${ts.flattenDiagnosticMessageText(error.messageText, " ")}`;
}
function stops(statement: ts.Statement): boolean {
  if (ts.isReturnStatement(statement) || ts.isThrowStatement(statement)) return true;
  return ts.isBlock(statement) && statement.statements.some(s => ts.isReturnStatement(s) || ts.isThrowStatement(s));
}
// Deliberately check the taught early-return form, rather than pretending to prove arbitrary control flow.
function guardedFetch(handler: ts.FunctionDeclaration, condition: string) {
  const statements = handler.body?.statements ?? [];
  const guard = statements.findIndex(s => ts.isIfStatement(s) && compact(s.expression) === condition && stops(s.thenStatement));
  const requests = calls(handler, "fetch");
  return guard >= 0 && requests.length > 0 && requests.every(request => request.pos >= statements[guard].end);
}
function controlledField(root: ts.Node, state: string, setter: string, checkbox = false) {
  return [...tags(root, "input"), ...tags(root, "textarea")].some(tag =>
    attr(tag, checkbox ? "checked" : "value") === state &&
    (!checkbox || attr(tag, "type") === "checkbox" && attr(tag, "required") === "true") &&
    new RegExp(`=>${setter}\\(\\w+\\.(?:target|currentTarget)\\.${checkbox ? "checked" : "value"}\\)`).test(attr(tag, "onChange") ?? "")
  );
}

export function gradeExtendedPage(pageId: string, code: string): GradeResult {
  const tests: GradeTest[] = [];
  const check = (name: string, passed: boolean, details: string) => tests.push({ name: `Tillämpa själv: ${name}`, passed, details });
  try {
    const source = parse(code);
    const files = splitFiles(code);
    for (const file of files.size ? files.values() : [source]) {
      const error = syntaxError(file);
      if (error) return { score: 0, passed: false, tests: [], compileError: error };
    }
    if (pageId === "react-p5") {
      const tokens = nodes(source, n => ts.isVariableDeclaration(n) && n.name.getText() === "tokens") as ts.VariableDeclaration[];
      check("Gemensam radius", tokens.some(n => n.initializer && property(n.initializer, "radius", "16")), "Sätt radius: 16 i tokens-objektet.");
      const button = functions(source, "PrimaryButton")[0];
      check("Återanvänd token", !!button && returned(button, n => (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && n.tagName.getText() === "button" && !!attr(n, "style")?.includes("borderRadius:tokens.radius")), "PrimaryButton ska returnera en button vars borderRadius använder tokens.radius.");
      const app = functions(source, "App")[0];
      check("Tre knappar", !!app && ["Spara", "Fortsätt", "Avbryt"].every(label => returned(app, n => (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && n.tagName.getText() === "PrimaryButton" && attr(n, "label") === label)), "App ska returnera PrimaryButton med etiketterna Spara, Fortsätt och Avbryt.");
    } else if (pageId === "components-p2") {
      const app = files.get("App.tsx");
      for (const [name, label] of [["Button", "Spara"], ["CancelButton", "Avbryt"]]) {
        const file = files.get(`${name}.tsx`);
        const component = file && functions(file, name)[0];
        const defaultExport = component?.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword) || file && nodes(file, n => ts.isExportAssignment(n) && !n.isExportEquals && compact(n.expression) === name).length > 0;
        check(`${name}.tsx`, !!component && !!defaultExport && returned(component, n => ts.isJsxElement(n) && n.openingElement.tagName.getText() === "button" && n.children.some(child => ts.isJsxText(child) && child.text.trim() === label)), `Skapa ${name}.tsx med en standardexporterad ${name} som returnerar knappen ${label}.`);
        const imported = app && app.statements.find(n => ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && n.moduleSpecifier.text.replace(/\.tsx$/, "") === `./${name}`);
        const local = imported && ts.isImportDeclaration(imported) ? imported.importClause?.name?.text : undefined;
        const appFunction = app && functions(app, "App")[0];
        check(`Använd ${name}`, !!local && !!appFunction && returned(appFunction, n => (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && n.tagName.getText() === local), `Importera ${name} som standardimport i App.tsx och använd den i Apps return.`);
      }
    } else if (pageId === "zod-p4") {
      const schema = nodes(source, n => ts.isVariableDeclaration(n) && n.name.getText() === "schema") as ts.VariableDeclaration[];
      check("Meddelandets regel", schema.some(n => n.initializer && property(n.initializer, "message", "z.string().min(10)")), "Lägg message: z.string().min(10) i schema.");
      const states = nodes(source, ts.isVariableDeclaration) as ts.VariableDeclaration[];
      const messageState = states.find(n => ts.isArrayBindingPattern(n.name) && n.name.elements[0]?.getText() === "message" && n.initializer && calls(n.initializer, "useState").length > 0);
      const setter = messageState && ts.isArrayBindingPattern(messageState.name) ? messageState.name.elements[1]?.getText() : "";
      check("Kontrollerat meddelandefält", !!setter && controlledField(source, "message", setter), "Koppla ett input eller textarea till message-state med value och onChange. Använd ett separat state för statusmeddelanden.");
      const handler = functions(source, "handleSubmit")[0];
      const validation = handler && calls(handler, "schema.safeParse").find(n => n.arguments[0] && nodes(n.arguments[0], p => ts.isShorthandPropertyAssignment(p) && p.name.text === "message" || ts.isPropertyAssignment(p) && p.name.getText() === "message" && compact(p.initializer) === "message").length > 0);
      check("Validera före request", !!handler && !!validation && guardedFetch(handler, "!result.success") && calls(handler, "fetch").every(n => validation.end < n.pos), "Skicka message till schema.safeParse och stoppa handleSubmit med if (!result.success) { ...; return; } före fetch.");
      check("Skicka validerad data", !!handler && calls(handler, "fetch").some(n => n.arguments[1] && property(n.arguments[1], "body", "JSON.stringify(result.data)")), "Requestens body ska vara JSON.stringify(result.data).");
    } else if (pageId === "forms-p3") {
      const bindings = nodes(source, n => ts.isVariableDeclaration(n) && ts.isArrayBindingPattern(n.name) && !!n.initializer && calls(n.initializer, "useState").some(call => call.arguments[0]?.kind === ts.SyntaxKind.FalseKeyword)) as ts.VariableDeclaration[];
      const consent = bindings.find(n => ts.isArrayBindingPattern(n.name) && controlledField(source, n.name.elements[0].getText(), n.name.elements[1].getText(), true));
      check("Samtycke som boolean", !!consent, "Skapa boolean-state som börjar på false. Koppla checkboxens checked och onChange till det; använd e.target.checked och required.");
      const state = consent && ts.isArrayBindingPattern(consent.name) ? consent.name.elements[0].getText() : "";
      const handler = functions(source, "handleSubmit")[0];
      check("Stoppa utan samtycke", !!handler && !!state && guardedFetch(handler, `!${state}`), "Lägg if (!samtycke) { ...; return; } före fetch i handleSubmit, med ditt state-namn. Enbart required eller ett felmeddelande räcker inte.");
      check("Formulärets submit", tags(source, "form").some(tag => attr(tag, "onSubmit") === "handleSubmit"), "Formulärets onSubmit ska använda handleSubmit.");
    } else if (pageId === "typescript-p5") {
      const lengthOf = functions(source, "lengthOf")[0];
      const guards = lengthOf ? nodes(lengthOf, ts.isIfStatement) as ts.IfStatement[] : [];
      const returnsLength = (statement: ts.Statement) => nodes(statement, n => ts.isReturnStatement(n) && !!n.expression && compact(n.expression) === "value.length").length > 0;
      check("Arrayens längd", guards.some(n => compact(n.expression) === "Array.isArray(value)" && returnsLength(n.thenStatement)), "Lägg if (Array.isArray(value)) return value.length i lengthOf.");
      check("Sträng och reservvärde", guards.some(n => /^typeofvalue===["']string["']$/.test(compact(n.expression)) && returnsLength(n.thenStatement)) && !!lengthOf?.body?.statements.some(n => ts.isReturnStatement(n) && n.expression && compact(n.expression) === "0"), "Behåll typeof-kontrollen för string och return 0 för övriga värden.");
      const declarations = nodes(source, ts.isVariableDeclaration) as ts.VariableDeclaration[];
      check("Korrekta grundtyper", [["age", "number", "20"], ["active", "boolean", "true"], ["scores", "number[]", "[10,20,30]"]].every(([name, type, value]) => declarations.some(n => n.name.getText() === name && !!n.type && compact(n.type) === type && !!n.initializer && compact(n.initializer) === value)), "Behåll age: number = 20, active: boolean = true och scores: number[] = [10, 20, 30].");
      check("Säker narrowing", !!lengthOf && lengthOf.parameters[0]?.type?.kind === ts.SyntaxKind.UnknownKeyword && nodes(source, n => n.kind === ts.SyntaxKind.AnyKeyword || ts.isAsExpression(n) || ts.isTypeAssertionExpression(n)).length === 0, "Behåll value: unknown och använd typkontroller, utan any eller casts.");
    } else if (pageId === "hono-p5") {
      const server = files.get("api.ts");
      const client = files.get("client.ts");
      const route = server && calls(server, "app.get").find(n => n.arguments[0] && ts.isStringLiteral(n.arguments[0]) && n.arguments[0].text === "/api/products");
      check("Serverns produktpris", !!route && calls(route, "c.json").some(n => n.arguments[0] && property(n.arguments[0], "price", "99") && nodes(n.arguments[0], p => ts.isPropertyAssignment(p) && p.name.getText() === "title").length > 0), "I api.ts: returnera produktens title och price: 99 från GET /api/products.");
      const loader = client && functions(client, "getProducts")[0];
      check("Klientens request", !!loader && calls(loader, "fetch").some(n => n.arguments[0] && ts.isStringLiteral(n.arguments[0]) && n.arguments[0].text === "/api/products") && calls(loader, "response.json").length > 0, "I client.ts: hämta /api/products och läs response.json() i getProducts.");
      check("Visa title och price", !!loader && calls(loader, "console.log").some(n => nodes(n, p => ts.isPropertyAccessExpression(p) && p.name.text === "title").length > 0 && nodes(n, p => ts.isPropertyAccessExpression(p) && p.name.text === "price").length > 0), "Logga varje produkts title och price, exempelvis products.forEach(product => console.log(product.title, product.price)).");
    }
  } catch (error) {
    return { score: 0, passed: false, tests, compileError: error instanceof Error ? error.message : "Kunde inte läsa svaret." };
  }
  const score = tests.length ? Math.round(100 * tests.filter(t => t.passed).length / tests.length) : 0;
  return { score, passed: tests.length > 0 && tests.every(t => t.passed), tests };
}
