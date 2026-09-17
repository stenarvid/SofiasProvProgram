import * as ts from "typescript";
import type { GradeResult, GradeTest } from "./codeGrader";
import { gradeHello } from "./codeGrader";
import { studyGuidance } from "./studyGuidance";
import { transferPractice } from "./transferPractice";

type Rule = {
  name: string;
  details: string;
  test: (code: string, clean: string) => boolean;
};

type PageGradeSpec = {
  kind: "auto" | "self";
  rules?: Rule[];
  guidance?: string;
};

const rx = (pattern: RegExp) => (_code: string, clean: string) => pattern.test(clean);
const rawRx = (pattern: RegExp) => (code: string) => pattern.test(code);

function matchingNodes(code: string, predicate: (node: ts.Node) => boolean) {
  const source = ts.createSourceFile("answer.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const matches: ts.Node[] = [];
  const visit = (node: ts.Node) => {
    if (predicate(node)) matches.push(node);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return matches;
}

function unwrap(expression: ts.Expression): ts.Expression {
  return ts.isParenthesizedExpression(expression) ? unwrap(expression.expression) : expression;
}

function functionalIncrementCount(code: string) {
  return matchingNodes(code, node => {
    if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression) || !/^set\w+/.test(node.expression.text)) return false;
    const callback = node.arguments[0] && unwrap(node.arguments[0]);
    if (!callback || !ts.isArrowFunction(callback) || callback.parameters.length !== 1) return false;
    const parameter = callback.parameters[0].name;
    if (!ts.isIdentifier(parameter)) return false;
    const body = callback.body;
    const returned = ts.isBlock(body)
      ? body.statements.length === 1 && ts.isReturnStatement(body.statements[0]) ? body.statements[0].expression : undefined
      : body;
    if (!returned) return false;
    const expression = unwrap(returned);
    if (!ts.isBinaryExpression(expression) || expression.operatorToken.kind !== ts.SyntaxKind.PlusToken) return false;
    const left = unwrap(expression.left);
    const right = unwrap(expression.right);
    return ts.isIdentifier(left) && left.text === parameter.text && ts.isNumericLiteral(right) && Number(right.text) === 1;
  }).length;
}

function hasPasswordSchema(code: string, requireMinimum: boolean) {
  return matchingNodes(code, node => {
    if (!ts.isPropertyAssignment(node) || !ts.isObjectLiteralExpression(node.parent)) return false;
    if (!(ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) || node.name.text !== "password") return false;
    const objectCall = node.parent.parent;
    if (!ts.isCallExpression(objectCall) || !ts.isPropertyAccessExpression(objectCall.expression) ||
        objectCall.expression.name.text !== "object" || !ts.isIdentifier(objectCall.expression.expression) ||
        objectCall.expression.expression.text !== "z") return false;
    let expression = unwrap(node.initializer);
    let hasMinimum = false;
    while (ts.isCallExpression(expression) && ts.isPropertyAccessExpression(expression.expression)) {
      const method = expression.expression;
      if (method.name.text === "min") {
        const minimum = expression.arguments[0] && unwrap(expression.arguments[0]);
        hasMinimum ||= !!minimum && ts.isNumericLiteral(minimum) && Number(minimum.text) === 8;
      }
      if (method.name.text === "string" && ts.isIdentifier(method.expression) && method.expression.text === "z") return !requireMinimum || hasMinimum;
      expression = unwrap(method.expression);
    }
    return false;
  }).length > 0;
}

function isRoleUnion(code: string) {
  return matchingNodes(code, node => {
    if (!ts.isTypeAliasDeclaration(node) || node.name.text !== "Role") return false;
    let type = node.type;
    while (ts.isParenthesizedTypeNode(type)) type = type.type;
    if (!ts.isUnionTypeNode(type) || type.types.length !== 2) return false;
    const values = type.types.map(member => {
      while (ts.isParenthesizedTypeNode(member)) member = member.type;
      return ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal) ? member.literal.text : undefined;
    });
    return values.includes("admin") && values.includes("user");
  }).length > 0;
}

function stripComments(code: string) {
  const source = ts.createSourceFile("answer.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  // A parser preserves URLs and comment markers inside strings/JSX.
  return ts.createPrinter({ removeComments: true }).printFile(source);
}

function syntaxError(code: string) {
  const result = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      strict: true
    },
    reportDiagnostics: true,
    fileName: "answer.tsx"
  });

  const error = (result.diagnostics ?? []).find(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );

  return error
    ? ts.flattenDiagnosticMessageText(error.messageText, "\n")
    : null;
}

function resultFromRules(rules: Rule[], code: string): GradeResult {
  const clean = stripComments(code);
  const tests: GradeTest[] = rules.map((rule) => {
    const passed = rule.test(clean, clean);
    return {
      name: rule.name,
      passed,
      details: passed ? `✓ ${rule.details}` : `Saknas: ${rule.details}`
    };
  });

  const count = tests.filter((test) => test.passed).length;
  const score = tests.length ? Math.round((count / tests.length) * 100) : 0;
  return { score, passed: score === 100, tests };
}

const r = (name: string, details: string, pattern: RegExp): Rule => ({
  name,
  details,
  test: rx(pattern)
});

const raw = (name: string, details: string, pattern: RegExp): Rule => ({
  name,
  details,
  test: rawRx(pattern)
});

const specs: Record<string, PageGradeSpec> = {
  "react-p1": {
    kind: "auto",
    rules: [
      r("Hello-komponent", "en komponent/funktion som heter Hello", /\bfunction\s+Hello\b|\bconst\s+Hello\s*=/),
      raw("h1-element", "ett <h1>-element", /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i),
      raw("Texten Hej!", "texten Hej! i h1-elementet", /<h1(?:\s[^>]*)?>\s*Hej!\s*<\/h1>/i)
    ]
  },
  "react-p2": {
    kind: "auto",
    rules: [
      r("name-variabel", "en variabel som heter name", /\b(?:const|let)\s+name\s*=/),
      raw("p-element", "ett <p>-element", /<p(?:\s[^>]*)?>[\s\S]*?<\/p>/i),
      raw("JSX-uttryck", "name visas med {name}", /<p(?:\s[^>]*)?>[\s\S]*?\{\s*name\s*\}[\s\S]*?<\/p>/i)
    ]
  },
  "react-p3": {
    kind: "auto",
    rules: [
      raw("Header", "Header finns lokalt eller importeras", /\b(?:function|const)\s+Header\b|import\s+Header\s+from\s+["'][^"']+["']/),
      raw("Footer", "Footer finns lokalt eller importeras", /\b(?:function|const)\s+Footer\b|import\s+Footer\s+from\s+["'][^"']+["']/),
      r("App", "en App-komponent", /\b(?:function|const)\s+App\b/),
      raw("Komposition", "App renderar både <Header /> och <Footer />", /<Header\s*\/>[\s\S]*<Footer\s*\/>|<Footer\s*\/>[\s\S]*<Header\s*\/>/)
    ]
  },
  "react-p4": {
    kind: "auto",
    rules: [
      r("Profile", "en Profile-komponent", /\b(?:function|const)\s+Profile\b/),
      raw("Namn", "namn som text i en rubrik eller via name/namn", /\bname\b|namn|<h[1-6](?:\s[^>]*)?>\s*[^<\s][\s\S]*?<\/h[1-6]>/i),
      raw("Titel", "titel som text i ett p-element eller via title/titel", /\btitle\b|titel|<p(?:\s[^>]*)?>\s*[^<\s][\s\S]*?<\/p>/i),
      raw("Knapp", "ett <button>-element", /<button(?:\s[^>]*)?>[\s\S]*?<\/button>/i)
    ]
  },

  "state-p1": {
    kind: "auto",
    rules: [
      r("useState", "useState används", /\buseState\s*\(/),
      r("isOpen", "state heter isOpen", /\[\s*isOpen\s*,\s*\w+\s*\]\s*=\s*useState/),
      r("false", "startvärdet är false", /useState(?:<[^>]+>)?\s*\(\s*false\s*\)/)
    ]
  },
  "state-p2": {
    kind: "auto",
    rules: [
      r("Startvärde 5", "useState startar på 5", /useState(?:<[^>]+>)?\s*\(\s*5\s*\)/),
      r("Setter", "en state-setter används", /\[\s*\w+\s*,\s*(\w+)\s*\]\s*=\s*useState/),
      raw("+1", "knappen/handlern ökar state med 1", /set\w+\s*\(\s*(?:\w+\s*=>\s*\w+\s*\+\s*1|\w+\s*\+\s*1)\s*\)/)
    ]
  },
  "state-p3": {
    kind: "auto",
    rules: [
      { name: "Functional update", details: "functional update använder parameterns föregående värde", test: code => functionalIncrementCount(code) > 0 },
      {
        name: "Två uppdateringar",
        details: "två funktionella +1-uppdateringar",
        test: code => functionalIncrementCount(code) >= 2
      }
    ]
  },
  "state-p4": {
    kind: "auto",
    rules: [
      r("name-state", "name skapas med useState", /\[\s*name\s*,\s*\w+\s*\]\s*=\s*useState/),
      raw("Controlled value", "input har value={name}", /<input[^>]*\bvalue\s*=\s*\{\s*name\s*\}[^>]*>/i),
      raw("onChange", "input uppdaterar state i onChange", /onChange\s*=\s*\{[\s\S]*?set\w+\s*\([\s\S]*?target\.value[\s\S]*?\}/i)
    ]
  },
  "state-p5": {
    kind: "auto",
    rules: [
      r("State", "counter använder useState", /\buseState\s*\(/),
      raw("+1", "en setter ökar med 1", /set\w+\s*\(\s*(?:\w+\s*=>\s*\w+\s*\+\s*1|\w+\s*\+\s*1)\s*\)/),
      raw("-1", "en setter minskar med 1", /set\w+\s*\(\s*(?:\w+\s*=>\s*\w+\s*-\s*1|\w+\s*-\s*1)\s*\)/),
      {
        name: "Ingen direkt mutation",
        details: "state muteras inte med ++, -- eller direkt tilldelning",
        test: (_code, clean) => !/\bcount\s*(?:\+\+|--|=(?!=))/.test(clean)
      }
    ]
  },

  "components-p1": {
    kind: "auto",
    rules: [r("ProductCard", "en ProductCard-komponent", /\b(?:function|const)\s+ProductCard\b/)]
  },
  "components-p2": {
    kind: "self"
  },
  "components-p3": {
    kind: "auto",
    rules: [
      r("Header", "Header-komponent", /\b(?:function|const)\s+Header\b/),
      r("MainContent", "MainContent-komponent", /\b(?:function|const)\s+MainContent\b/),
      r("Footer", "Footer-komponent", /\b(?:function|const)\s+Footer\b/)
    ]
  },

  "router-p1": {
    kind: "auto",
    rules: [
      raw("/ route", "Route med path=\"/\"", /<Route[^>]*path\s*=\s*["']\/["'][^>]*>/),
      raw("/about route", "Route med path=\"/about\"", /<Route[^>]*path\s*=\s*["']\/about["'][^>]*>/)
    ]
  },
  "router-p2": {
    kind: "auto",
    rules: [
      raw("Link /", "Link till /", /<Link[^>]*to\s*=\s*["']\/["'][^>]*>/),
      raw("Link /contact", "Link till /contact", /<Link[^>]*to\s*=\s*["']\/contact["'][^>]*>/)
    ]
  },
  "router-p3": {
    kind: "auto",
    rules: [raw("Dynamisk route", "path /products/:id", /path\s*=\s*["']\/products\/:id["']/)]
  },
  "router-p4": {
    kind: "auto",
    rules: [
      raw("path", "Route använder path, inte url", /<Route[^>]*\bpath\s*=/),
      raw("element", "Route använder element, inte component", /<Route[^>]*\belement\s*=/),
      { name: "Ingen url/component", details: "de äldre propsen url och component är borttagna", test: (_c, clean) => !/<Route[^>]*\b(?:url|component)\s*=/.test(clean) }
    ]
  },

  "fetch-p1": {
    kind: "auto",
    rules: [
      r("getUsers", "funktionen getUsers", /\b(?:async\s+)?function\s+getUsers\b|\bconst\s+getUsers\s*=/),
      raw("fetch", "fetch('/api/users')", /fetch\s*\(\s*["']\/api\/users["']/)
    ]
  },
  "fetch-p2": {
    kind: "auto",
    rules: [
      raw("response.ok", "response.ok kontrolleras", /(?:if\s*\(\s*!?\s*\w+\.ok|\.ok\b)/),
      raw("json()", "JSON läses med json()", /\.json\s*\(\s*\)/)
    ]
  },
  "fetch-p3": {
    kind: "auto",
    rules: [
      raw("POST", "method: 'POST'", /method\s*:\s*["']POST["']/i),
      raw("/api/posts", "anrop till /api/posts", /fetch\s*\(\s*["']\/api\/posts["']/),
      raw("JSON.stringify", "body använder JSON.stringify", /body\s*:\s*JSON\.stringify\s*\(/),
      raw("title Hej", "payload innehåller title: 'Hej'", /title\s*:\s*["']Hej["']/)
    ]
  },
  "fetch-p4": {
    kind: "auto",
    rules: [
      r("Users state", "state för users", /\[\s*users\s*,\s*\w+\s*\]\s*=\s*useState/),
      raw("Fetch", "fetch används", /\bfetch\s*\(/),
      raw("Loading", "UI hanterar loading/Laddar", /\bloading\b|Laddar/i)
    ]
  },
  "fetch-p5": {
    kind: "auto",
    rules: [
      raw("json()", "response.json anropas med parenteser", /response\.json\s*\(\s*\)/),
      { name: "Inte funktionsreferensen", details: "return response.json; används inte", test: (_c, clean) => !/return\s+response\.json\s*;/.test(clean) }
    ]
  },

  "query-p1": {
    kind: "auto",
    rules: [
      raw("useQuery", "useQuery används", /\buseQuery\s*\(/),
      raw("queryKey", "queryKey finns", /\bqueryKey\s*:/),
      raw("queryFn", "queryFn finns", /\bqueryFn\s*:/)
    ]
  },
  "query-p2": {
    kind: "auto",
    rules: [
      raw("Products key", "queryKey är ['products']", /queryKey\s*:\s*\[\s*["']products["']\s*\]/),
      raw("queryFn", "queryFn finns", /\bqueryFn\s*:/)
    ]
  },
  "query-p3": {
    kind: "auto",
    rules: [
      raw("Pending/loading", "isPending eller isLoading hanteras", /\bisPending\b|\bisLoading\b/),
      raw("Error", "isError eller error hanteras", /\bisError\b|\berror\b/),
      raw("Data", "data används", /\bdata\b/),
      raw("Lista", "users/data renderas med map", /\.map\s*\(/)
    ]
  },
  "query-p4": {
    kind: "self",
    guidance: "Nämn t.ex. server-state, cache, loading/error, refetch och att React Query passar när serverdata ska delas/återanvändas."
  },

  "jotai-p1": {
    kind: "auto",
    rules: [
      raw("themeAtom", "themeAtom deklareras", /\bthemeAtom\s*=/),
      raw("atom()", "atom('dark') används", /atom(?:<[^>]+>)?\s*\(\s*["']dark["']\s*\)/)
    ]
  },
  "jotai-p2": {
    kind: "auto",
    rules: [
      raw("useAtom", "useAtom(themeAtom) används", /useAtom\s*\(\s*themeAtom\s*\)/),
      raw("Knapp", "en button finns", /<button(?:\s[^>]*)?>/i),
      raw("Setter", "atomens setter används", /set\w+\s*\(/)
    ]
  },
  "jotai-p3": {
    kind: "self",
    guidance: "Beskriv ett konkret delat state som flera avlägsna komponenter behöver och hur Jotai minskar prop drilling."
  },

  "zod-p1": {
    kind: "auto",
    rules: [
      raw("z.object", "ett z.object-schema", /z\.object\s*\(/),
      raw("username", "username: z.string()", /username\s*:\s*z\.string\s*\(\s*\)/)
    ]
  },
  "zod-p2": {
    kind: "auto",
    rules: [
      { name: "password", details: "password är en string i schema", test: code => hasPasswordSchema(code, false) },
      { name: "min(8)", details: "password-fältets z.string() har min(8)", test: code => hasPasswordSchema(code, true) }
    ]
  },
  "zod-p3": {
    kind: "auto",
    rules: [
      raw("safeParse", "safeParse används", /\.safeParse\s*\(/),
      raw("success", "result.success kontrolleras/används", /\.success\b/)
    ]
  },
  "zod-p4": {
    kind: "self"
  },

  "forms-p1": {
    kind: "auto",
    rules: [
      raw("form", "ett <form>-element", /<form(?:\s[^>]*)?>/i),
      raw("onSubmit", "form har onSubmit", /<form[^>]*\bonSubmit\s*=/i),
      raw("submit", "submit-knapp", /<button[^>]*type\s*=\s*["']submit["'][^>]*>|<input[^>]*type\s*=\s*["']submit["'][^>]*>/i)
    ]
  },
  "forms-p2": {
    kind: "auto",
    rules: [
      raw("value", "input har value={name}", /<input[^>]*value\s*=\s*\{\s*name\s*\}/i),
      raw("onChange", "input har onChange", /<input[^>]*onChange\s*=/i),
      raw("Setter", "onChange uppdaterar state från target.value", /set\w+\s*\([\s\S]*?target\.value/)
    ]
  },
  "forms-p3": {
    kind: "self"
  },
  "forms-p4": {
    kind: "auto",
    rules: [
      raw("value name", "input har value={name}", /<input[^>]*value\s*=\s*\{\s*name\s*\}/i),
      raw("onChange", "input har onChange", /<input[^>]*onChange\s*=/i)
    ]
  },

  "props-p1": {
    kind: "auto",
    rules: [
      r("Greeting", "Greeting-komponent", /\b(?:function|const)\s+Greeting\b/),
      raw("name prop", "name tas emot som prop", /\bname\b/)
    ]
  },
  "props-p2": {
    kind: "auto",
    rules: [
      raw("Props", "type/interface Props finns", /\b(?:type|interface)\s+Props\b/),
      raw("title:string", "title är string", /\btitle\s*:\s*string\b/),
      raw("price:number", "price är number", /\bprice\s*:\s*number\b/)
    ]
  },
  "props-p3": {
    kind: "self",
    guidance: "Ge ett exempel där parent äger datan och child bara får den som read-only prop. Jämför med lokal ändringsbar state."
  },

  "databinding-p1": {
    kind: "auto",
    rules: [
      r("city-state", "city skapas med useState", /\[\s*city\s*,\s*\w+\s*\]\s*=\s*useState/),
      raw("value", "input visar city via value={city}", /<input[^>]*value\s*=\s*\{\s*city\s*\}/i),
      raw("onChange", "input uppdaterar city", /onChange\s*=[\s\S]*?set\w+\s*\([\s\S]*?target\.value/)
    ]
  },
  "databinding-p2": {
    kind: "auto",
    rules: [
      raw("setEmail", "onChange använder setEmail", /onChange\s*=[\s\S]*?setEmail\s*\(/),
      raw("target.value", "värdet kommer från e.target.value", /target\.value/)
    ]
  },
  "databinding-p3": {
    kind: "auto",
    rules: [
      raw("value", "input är bundet till name", /<input[^>]*value\s*=\s*\{\s*name\s*\}/i),
      raw("onChange", "input uppdaterar name", /onChange\s*=[\s\S]*?set\w+\s*\(/),
      raw("p", "name visas i ett p-element", /<p(?:\s[^>]*)?>[\s\S]*?\{\s*name\s*\}[\s\S]*?<\/p>/i)
    ]
  },

  "typescript-p1": {
    kind: "auto",
    rules: [
      raw("name:string", "name är typad string", /\bname\s*:\s*string\b/),
      raw("age:number", "age är typad number", /\bage\s*:\s*number\b/),
      raw("active:boolean", "active är typad boolean", /\bactive\s*:\s*boolean\b/)
    ]
  },
  "typescript-p2": {
    kind: "auto",
    rules: [
      raw("numbers:number[]", "numbers är number[]", /\bnumbers\s*:\s*(?:number\[\]|Array<\s*number\s*>)/),
      {
        name: "Tre tal",
        details: "arrayen innehåller minst tre tal",
        test: (_c, clean) => {
          const match = clean.match(/\bnumbers\s*:\s*(?:number\[\]|Array<\s*number\s*>)\s*=\s*\[([^\]]*)\]/);
          return !!match && (match[1].match(/-?\d+(?:\.\d+)?/g) ?? []).length >= 3;
        }
      }
    ]
  },
  "typescript-p3": {
    kind: "auto",
    rules: [
      raw("Product type", "type/interface Product", /\b(?:type|interface)\s+Product\b/),
      raw("id", "id finns", /\bid\s*:\s*(?:number|string)\b/),
      raw("title", "title:string", /\btitle\s*:\s*string\b/),
      raw("price", "price:number", /\bprice\s*:\s*number\b/),
      raw("optional description", "description är optional", /\bdescription\s*\?\s*:\s*string\b/)
    ]
  },
  "typescript-p4": {
    kind: "auto",
    rules: [
      { name: "Role union", details: "Role är exakt unionen 'admin' | 'user'", test: isRoleUnion }
    ]
  },
  "typescript-p5": {
    kind: "self",
    guidance: "Kontrollera typfelen i editorn och jämför med facit: age: number = 20, active: boolean = true och scores: number[] = [10, 20, 30]. Behåll typerna och undvik any och casts. Syntaxkontroll ensam upptäcker inte felaktiga typer."
  },

  "hono-p1": {
    kind: "auto",
    rules: [
      raw("Hono", "new Hono() används", /\bnew\s+Hono\s*\(\s*\)/),
      raw("app", "resultatet sparas i app", /\b(?:const|let)\s+app\s*=\s*new\s+Hono/)
    ]
  },
  "hono-p2": {
    kind: "auto",
    rules: [
      raw("GET", "app.get används", /\bapp\.get\s*\(/),
      raw("/api/hello", "route är /api/hello", /app\.get\s*\(\s*["']\/api\/hello["']/),
      raw("Hej!", "JSON innehåller message: 'Hej!'", /message\s*:\s*["']Hej!["']/),
      raw("c.json", "svaret returneras med c.json", /\bc\.json\s*\(/)
    ]
  },
  "hono-p3": {
    kind: "auto",
    rules: [
      raw("POST", "app.post används", /\bapp\.post\s*\(/),
      raw("/api/users", "route är /api/users", /app\.post\s*\(\s*["']\/api\/users["']/),
      raw("req.json", "request body läses med c.req.json()", /\bc\.req\.json\s*\(\s*\)/)
    ]
  },
  "hono-p4": {
    kind: "auto",
    rules: [
      raw("JSON", "c.json används", /\bc\.json\s*\(/),
      raw("201", "status 201 returneras", /c\.json\s*\([\s\S]*?,\s*201\s*\)/)
    ]
  },
  "hono-p5": {
    kind: "self"
  },

  "server-p1": {
    kind: "self",
    guidance: "Beskriv kedjan från klick/event till fetch/request, server-route, response, state och ny render."
  },
  "server-p2": {
    kind: "self",
    guidance: "Ta med metod (ofta POST), URL, headers/content-type och JSON-body."
  },
  "server-p3": {
    kind: "self",
    guidance: "Jämför varje situation med rätt status: lyckad GET med data → 200 OK; skapad resurs → 201 Created; saknad resurs → 404 Not Found. Det räcker inte att nämna koderna; kopplingen måste vara rätt."
  },
  "server-p4": {
    kind: "self",
    guidance: "Förklara GET /api/users från frontend-request till matchad server-route och tillbaka via HTTP-response till UI."
  }
};

export function getPageCodeGradeMode(pageId: string) {
  return specs[pageId]?.kind ?? "self";
}

export function getSelfAssessmentGuidance(pageId: string) {
  return studyGuidance[pageId]?.checks.join(" ") ?? specs[pageId]?.guidance ?? "Jämför ditt svar med teorin och kontrollera att du använder rätt begrepp.";
}

export async function gradePageCode(pageId: string, code: string): Promise<GradeResult> {
  const spec = specs[pageId];

  if (!spec || spec.kind === "self") {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: "Den här uppgiften självbedöms med bedömningsstödet i stället för automatisk kodrättning."
    };
  }

  const error = syntaxError(code);
  if (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error
    };
  }

  const base = pageId === "react-p1" ? await gradeHello(code) : resultFromRules(spec.rules ?? [], code);
  if (base.compileError) return base;
  const extension = transferPractice[pageId];
  if (!extension?.pattern) return base;
  const pattern = extension.pattern;
  const clean = stripComments(code);
  const matches = matchingNodes(clean, node => {
    const eligible = extension.kind === "jsx" ? ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)
      : extension.kind === "call" ? ts.isCallExpression(node)
      : extension.kind === "declaration" ? ts.isVariableDeclaration(node) || ts.isPropertySignature(node)
      : ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node);
    return eligible && pattern.test(node.getText());
  });
  const tests = [...base.tests, {
    name: "Tillämpa själv",
    passed: matches.length > 0,
    details: extension.check
  }];
  const passed = tests.every(test => test.passed);
  const score = Math.round(100 * tests.filter(test => test.passed).length / tests.length);
  return { score, passed, tests };
}
