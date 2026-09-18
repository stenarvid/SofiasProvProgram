import { describe, expect, it } from "vitest";
import { gradePageCode, getPageCodeGradeMode } from "./pageCodeGrader";
import { studyLessons } from "./studyLessons";
import { studyTopics } from "./studyTopics";
import { extendedCodePages } from "./extendedPageGrader";
import { applicationQuestions } from "./applicationQuestions";

const example = (id: string) => studyLessons[id].code;
const solutions: Record<string, string> = {
  "react-p5": example("react-p5").replace("radius: 6", "radius: 16").replace('<PrimaryButton label="Fortsätt" />', '<PrimaryButton label="Fortsätt" /><PrimaryButton label="Avbryt" />'),
  "components-p2": example("components-p2").replace('import Button from "./Button";', 'import Button from "./Button";\nimport CancelButton from "./CancelButton";').replace("return <Button />;", "return <><Button /><CancelButton /></>;") + '\n// CancelButton.tsx\nexport default function CancelButton() { return <button>Avbryt</button>; }',
  "zod-p4": example("zod-p4").replace(/\bsetMessage\b/g, "setStatusMessage").replace(/\bmessage\b/g, "statusMessage").replace("result.error.issues[0].statusMessage", "result.error.issues[0].message").replace("error.statusMessage", "error.message")
    .replace("const schema = z.object({", "const schema = z.object({\n  message: z.string().min(10),")
    .replace('const [name, setName]', 'const [message, setMessage] = useState("");\n  const [name, setName]')
    .replace("schema.safeParse({ name, email })", "schema.safeParse({ name, email, message })")
    .replace("<form onSubmit={handleSubmit} noValidate>", "<form onSubmit={handleSubmit} noValidate><textarea value={message} onChange={e => setMessage(e.target.value)} />"),
  "forms-p3": example("forms-p3").replace("const [name, setName]", "const [consent, setConsent] = useState(false);\n  const [name, setName]")
    .replace("e.preventDefault();", "e.preventDefault();\n    if (!consent) { setMessage('Samtycke krävs'); return; }")
    .replace("<form onSubmit={handleSubmit}>", '<form onSubmit={handleSubmit}><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} />'),
  "typescript-p5": example("typescript-p5").replace('if (typeof value === "string")', 'if (Array.isArray(value)) return value.length;\n  if (typeof value === "string")'),
  "hono-p5": example("hono-p5").replace('title: "Bok"', 'title: "Bok", price: 99').replace("console.log(products);", "products.forEach(product => console.log(product.title, product.price));")
};

describe("previously self-assessed applications", () => {
  it("offers automatic code grading or application questions on every page", () => {
    for (const page of studyTopics.flatMap(t => t.pages)) {
      expect(getPageCodeGradeMode(page.id), page.id).toBe(page.guidance?.format === "explanation" ? "quiz" : "auto");
      if (page.guidance?.format === "explanation") expect(applicationQuestions[page.id].length).toBeGreaterThanOrEqual(2);
    }
  });
  it.each(extendedCodePages)("grades a completed %s application and rejects unchanged/comment-only work", async id => {
    expect((await gradePageCode(id, solutions[id])).passed, id).toBe(true);
    expect((await gradePageCode(id, example(id))).passed).toBe(false);
    expect((await gradePageCode(id, "")).passed).toBe(false);
    expect((await gradePageCode(id, example(id) + "\n/*\n" + solutions[id] + "\n*/")).passed).toBe(false);
    expect((await gradePageCode(id, `const solution = ${JSON.stringify(solutions[id])};`)).passed).toBe(false);
  });
  it("does not accept a form that displays an error without stopping the request", async () => {
    const code = solutions["forms-p3"].replace("setMessage('Samtycke krävs'); return;", "setMessage('Samtycke krävs');");
    expect((await gradePageCode("forms-p3", code)).passed).toBe(false);
    expect((await gradePageCode("forms-p3", solutions["forms-p3"].replace("e.target.checked", "e.target.value"))).passed).toBe(false);
  });
  it("requires Zod's message field to be validated and the validated data sent", async () => {
    for (const code of [
      solutions["zod-p4"].replace("min(10)", "min(9)"),
      solutions["zod-p4"].replace("safeParse({ name, email, message })", "safeParse({ name, email })"),
      solutions["zod-p4"].replace("JSON.stringify(result.data)", "JSON.stringify({ name, email, message })"),
      solutions["zod-p4"].replace("return;", "")
    ]) expect((await gradePageCode("zod-p4", code)).passed).toBe(false);
  });
  it("requires separate file sections, a default import and actual component use", async () => {
    for (const code of [
      solutions["components-p2"].replace("// CancelButton.tsx", "// Wrong.tsx"),
      solutions["components-p2"].replace('import CancelButton from', 'import { CancelButton } from'),
      solutions["components-p2"].replace("<CancelButton />", "")
    ]) expect((await gradePageCode("components-p2", code)).passed).toBe(false);
  });
  it("rejects hardcoded radius and an unused third button", async () => {
    expect((await gradePageCode("react-p5", solutions["react-p5"].replace("borderRadius: tokens.radius", "borderRadius: 16"))).passed).toBe(false);
    const unused = solutions["react-p5"].replace('<PrimaryButton label="Avbryt" />', '') + '\nconst unused = <PrimaryButton label="Avbryt" />;';
    expect((await gradePageCode("react-p5", unused)).passed).toBe(false);
  });
  it("rejects incorrect basic types and casts in the narrowing exercise", async () => {
    for (const code of [solutions["typescript-p5"].replace("age: number = 20", 'age: number = "20"'), solutions["typescript-p5"].replace("value: unknown", "value: any")]) {
      expect((await gradePageCode("typescript-p5", code)).passed).toBe(false);
    }
  });
});
