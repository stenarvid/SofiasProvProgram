import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import { studyTopics } from "./studyTopics";
import { studyLessons } from "./studyLessons";
import { getExampleWalkthrough, getTheoryExplanation } from "./theoryExplanations";
import { gradePageCode, getPageCodeGradeMode } from "./pageCodeGrader";
import { getStudyPageQuizQuestions } from "./studyPageQuiz";

const pages = studyTopics.flatMap(topic => topic.pages);

describe("worked study lessons", () => {
  it("covers every page with a contextual walkthrough and matching questions", () => {
    expect(Object.keys(studyLessons).sort()).toEqual(pages.map(page => page.id).sort());
    for (const page of pages) {
      const lesson = studyLessons[page.id];
      expect(page.code, page.id).toBe(lesson.code);
      expect(getExampleWalkthrough(page.id), page.id).toHaveLength(3);
      expect([...getTheoryExplanation(page.id, page.intro), ...lesson.walkthrough].join(" ").split(/\s+/).length, page.id).toBeGreaterThan(140);
      expect(page.quiz.explanation, page.id).toBe(lesson.questions[0][5]);
    }
  });

  it("type-checks the examples against the installed libraries, respecting file boundaries", () => {
    const normalize = (path: string) => path.replace(/\\/g, "/");
    const root = normalize(ts.sys.getCurrentDirectory()) + "/src/data/__lesson_examples";
    const files = new Map<string, string>();
    for (const page of pages) {
      const sections = page.code.split(/^\/\/ (\w+\.tsx?)\s*(?:—[^\n]*)?\r?\n/gm);
      if (sections.length === 1) files.set(`${root}/${page.id}/example.tsx`, page.code + "\nexport {};\n");
      else {
        expect(sections[0].trim(), page.id).toBe("");
        for (let i = 1; i < sections.length; i += 2) files.set(`${root}/${page.id}/${sections[i]}`, sections[i + 1] + "\nexport {};\n");
      }
    }
    const directories = new Set<string>();
    for (const file of files.keys()) {
      let directory = file.slice(0, file.lastIndexOf("/"));
      while (directory.includes("/")) {
        directories.add(directory);
        directory = directory.slice(0, directory.lastIndexOf("/"));
      }
    }
    const options: ts.CompilerOptions = {
      noEmit: true, strict: true, skipLibCheck: true,
      jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
      esModuleInterop: true, types: []
    };
    const host = ts.createCompilerHost(options);
    const originalGetSourceFile = host.getSourceFile.bind(host);
    const originalFileExists = host.fileExists.bind(host);
    const originalDirectoryExists = host.directoryExists?.bind(host);
    const originalReadFile = host.readFile.bind(host);
    host.fileExists = file => files.has(normalize(file)) || originalFileExists(file);
    host.directoryExists = directory => directories.has(normalize(directory)) || Boolean(originalDirectoryExists?.(directory));
    host.readFile = file => files.get(normalize(file)) ?? originalReadFile(file);
    host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) => {
      const source = files.get(normalize(file));
      return source === undefined
        ? originalGetSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile)
        : ts.createSourceFile(file, source, languageVersion, true);
    };
    const program = ts.createProgram([...files.keys()], options, host);
    const diagnostics = ts.getPreEmitDiagnostics(program).map(diagnostic => {
      const location = diagnostic.file && diagnostic.start !== undefined
        ? `${diagnostic.file.fileName}:${diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1}`
        : "compiler";
      return `${location}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`;
    });
    expect(diagnostics).toEqual([]);
  }, 30000);

  it("accepts the worked examples for the corresponding automatically graded exercises", async () => {
    const failures: string[] = [];
    for (const page of pages.filter(page => getPageCodeGradeMode(page.id) === "auto")) {
      const result = await gradePageCode(page.id, page.code);
      if (!result.passed) failures.push(`${page.id}: ${result.compileError ?? result.tests.filter(test => !test.passed).map(test => test.details).join(", ")}`);
    }
    expect(failures).toEqual([]);
  });

  it("keeps quiz answers and explanations attached to the page after shuffling", () => {
    for (const topic of studyTopics) for (const page of topic.pages) {
      const questions = getStudyPageQuizQuestions(page, topic, studyTopics);
      const lesson = studyLessons[page.id];
      const answers = (index: number) => questions[index].correctAnswers.map(answer => questions[index].options[answer]);
      expect(answers(0), page.id).toEqual([lesson.questions[0][1]]);
      expect(answers(1).sort(), page.id).toEqual(lesson.statements.slice(0, 2).sort());
      expect(answers(2), page.id).toEqual([lesson.questions[1][1]]);
      expect(questions[1].explanation, page.id).toBe(lesson.statementExplanation);
      expect(getStudyPageQuizQuestions(page, topic, []), page.id).toEqual(questions);
    }
  });
});
