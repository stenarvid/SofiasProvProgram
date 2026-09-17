import React, { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import * as ts from "typescript";
import { z } from "zod";
import { Hono } from "hono";

export type GradeTest = {
  name: string;
  passed: boolean;
  details: string;
};

export type GradeResult = {
  score: number;
  passed: boolean;
  tests: GradeTest[];
  compileError?: string;
};

function prepareSource(code: string) {
  return code
    .replace(/import\s+[\s\S]*?\s+from\s+["'][^"']+["'];?\s*/g, "")
    .replace(/import\s+["'][^"']+["'];?\s*/g, "")
    .replace(/\bexport\s+default\s+(?=(function|class)\b)/g, "")
    .replace(/\bexport\s+default\s+/g, "")
    .replace(/\bexport\s+(?=(const|let|var|function|class|type|interface|enum)\b)/g, "");
}

function transpile(code: string) {
  const source = prepareSource(code);
  const result = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: true
    },
    reportDiagnostics: true
  });

  const errors = (result.diagnostics ?? []).filter(
    (d) => d.category === ts.DiagnosticCategory.Error
  );

  return { source, js: result.outputText, errors };
}

function diagnosticText(diag: ts.Diagnostic) {
  return ts.flattenDiagnosticMessageText(diag.messageText, "\n");
}

function scoreTests(tests: GradeTest[]): GradeResult {
  const passedCount = tests.filter((t) => t.passed).length;
  const score = tests.length ? Math.round((passedCount / tests.length) * 100) : 0;
  return { score, passed: score === 100, tests };
}

function runtimeScope(extra: Record<string, unknown> = {}) {
  return {
    React,
    useState,
    z,
    Hono,
    ...extra
  };
}

function getNamedValue(js: string, name: string, scope: Record<string, unknown> = {}) {
  const merged = runtimeScope(scope);
  const argNames = Object.keys(merged);
  const argValues = Object.values(merged);

  const fn = new Function(
    ...argNames,
    `${js}\nreturn typeof ${name} !== "undefined" ? ${name} : undefined;`
  );

  return fn(...argValues);
}

async function updateReact(callback: () => void) {
  // React's test-only act() throws in production builds.
  if (import.meta.env.PROD) {
    flushSync(callback);
  } else {
    await act(async () => callback());
  }
}

async function renderComponent(
  Component: React.ComponentType<any>,
  props: Record<string, unknown> = {}
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  await updateReact(() => {
    root.render(React.createElement(Component, props));
  });

  return { container, root };
}

async function rerender(
  root: Root,
  Component: React.ComponentType<any>,
  props: Record<string, unknown>
) {
  await updateReact(() => {
    root.render(React.createElement(Component, props));
  });
}

async function click(element: HTMLElement) {
  await updateReact(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

async function typeIntoInput(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set;

  await updateReact(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function cleanup(container: HTMLElement, root: Root) {
  await updateReact(() => {
    root.unmount();
  });
  container.remove();
}

function integersInText(text: string | null | undefined) {
  return ((text ?? "").match(/-?\d+/g) ?? []).map(Number);
}

function counterSequenceWorks(
  before: number[],
  afterOne: number[],
  afterTwo: number[]
) {
  if (before.length !== afterOne.length || before.length !== afterTwo.length) {
    return false;
  }

  return before.some((value, index) =>
    value === 0 &&
    afterOne[index] === 1 &&
    afterTwo[index] === 2
  );
}

function hasStringPropertyType(code: string, propertyName: string) {
  const source = ts.createSourceFile(
    "answer.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const aliases = new Map<string, ts.TypeNode>();

  source.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      aliases.set(node.name.text, node.type);
    }
  });

  const resolvesToString = (node: ts.TypeNode | undefined, seen = new Set<string>()): boolean => {
    if (!node) return false;
    if (node.kind === ts.SyntaxKind.StringKeyword) return true;

    if (ts.isParenthesizedTypeNode(node)) {
      return resolvesToString(node.type, seen);
    }

    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      const name = node.typeName.text;
      if (seen.has(name)) return false;
      const target = aliases.get(name);
      if (!target) return false;
      const nextSeen = new Set(seen);
      nextSeen.add(name);
      return resolvesToString(target, nextSeen);
    }

    return false;
  };

  let found = false;
  const visit = (node: ts.Node) => {
    if (
      ts.isPropertySignature(node) &&
      !node.questionToken &&
      node.name &&
      ((ts.isIdentifier(node.name) && node.name.text === propertyName) ||
        (ts.isStringLiteral(node.name) && node.name.text === propertyName)) &&
      resolvesToString(node.type)
    ) {
      found = true;
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return found;
}

function compileFailure(errors: readonly ts.Diagnostic[]): GradeResult | null {
  if (!errors.length) return null;
  return {
    score: 0,
    passed: false,
    tests: [],
    compileError: diagnosticText(errors[0])
  };
}

async function gradeCounter(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;

  let Component: any;
  try {
    Component = getNamedValue(js, "Counter");
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Koden kunde inte köras."
    };
  }

  if (typeof Component !== "function") {
    return scoreTests([
      { name: "Counter finns", passed: false, details: "Hittade ingen komponent som heter Counter." },
      { name: "Startvärde 0", passed: false, details: "Komponenten kunde inte testas." },
      { name: "Första klicket ger 1", passed: false, details: "Komponenten kunde inte testas." },
      { name: "Andra klicket ger 2", passed: false, details: "Komponenten kunde inte testas." }
    ]);
  }

  let container: HTMLElement | null = null;
  let root: Root | null = null;

  try {
    ({ container, root } = await renderComponent(Component));
    const button = container.querySelector("button") as HTMLButtonElement | null;

    const beforeNumbers = integersInText(button?.textContent);
    let afterOneNumbers: number[] = [];
    let afterTwoNumbers: number[] = [];

    if (button) {
      await click(button);
      afterOneNumbers = integersInText(button.textContent);
      await click(button);
      afterTwoNumbers = integersInText(button.textContent);
    }

    const sequenceWorks = counterSequenceWorks(
      beforeNumbers,
      afterOneNumbers,
      afterTwoNumbers
    );

    return scoreTests([
      { name: "Counter finns", passed: true, details: "Counter hittades och renderades." },
      {
        name: "Startvärde 0",
        passed: !!button && beforeNumbers.includes(0),
        details: !button
          ? "Ingen button hittades."
          : beforeNumbers.includes(0)
            ? `Numeriska värden före klick: ${beforeNumbers.join(", ")}.`
            : "Hittade inget counter-värde som börjar på 0 i knappen."
      },
      {
        name: "Första klicket ger 1",
        passed: sequenceWorks,
        details: `Före: [${beforeNumbers.join(", ")}], efter ett klick: [${afterOneNumbers.join(", ")}].`
      },
      {
        name: "Andra klicket ger 2",
        passed: sequenceWorks,
        details: `Efter två klick: [${afterTwoNumbers.join(", ")}].`
      }
    ]);
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Counter kunde inte testas."
    };
  } finally {
    if (container && root) await cleanup(container, root);
  }
}

async function gradeGreeting(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;

  let Component: any;
  try {
    Component = getNamedValue(js, "Greeting");
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Koden kunde inte köras."
    };
  }

  if (typeof Component !== "function") {
    return scoreTests([
      { name: "Greeting finns", passed: false, details: "Hittade ingen Greeting-komponent." },
      { name: "name är string-typad", passed: false, details: "Kunde inte kontrollera props-typen." },
      { name: "Första prop-värdet renderas", passed: false, details: "Komponenten kunde inte testas." },
      { name: "Nytt prop-värde renderas", passed: false, details: "Komponenten kunde inte testas." }
    ]);
  }

  const first = `Namn_${crypto.randomUUID().slice(0, 8)}`;
  const second = `Namn_${crypto.randomUUID().slice(0, 8)}`;
  let container: HTMLElement | null = null;
  let root: Root | null = null;

  try {
    ({ container, root } = await renderComponent(Component, { name: first }));
    const firstWorks = (container.textContent ?? "").includes(first);

    await rerender(root, Component, { name: second });
    const secondWorks =
      (container.textContent ?? "").includes(second) &&
      !(container.textContent ?? "").includes(first);

    return scoreTests([
      { name: "Greeting finns", passed: true, details: "Greeting hittades och renderades." },
      {
        name: "name är string-typad",
        passed: hasStringPropertyType(code, "name"),
        details: hasStringPropertyType(code, "name")
          ? "En name-property med string-typ hittades."
          : "Kunde inte hitta name: string i props-typen."
      },
      {
        name: "Första prop-värdet renderas",
        passed: firstWorks,
        details: firstWorks ? "Ett slumpat prop-värde syntes i UI:t." : "Det slumpade prop-värdet syntes inte."
      },
      {
        name: "Nytt prop-värde renderas",
        passed: secondWorks,
        details: secondWorks ? "Komponenten reagerade korrekt på ett nytt prop-värde." : "UI:t följde inte ett nytt prop-värde."
      }
    ]);
  } finally {
    if (container && root) await cleanup(container, root);
  }
}

async function gradeNameForm(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;

  let Component: any;
  try {
    Component = getNamedValue(js, "NameForm");
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Koden kunde inte köras."
    };
  }

  if (typeof Component !== "function") {
    return scoreTests([
      { name: "NameForm finns", passed: false, details: "Hittade ingen NameForm-komponent." },
      { name: "Input börjar tomt", passed: false, details: "Komponenten kunde inte testas." },
      { name: "Skrivning uppdaterar input", passed: false, details: "Komponenten kunde inte testas." },
      { name: "Texten visas utanför input", passed: false, details: "Komponenten kunde inte testas." }
    ]);
  }

  const firstValue = `Test_${crypto.randomUUID().slice(0, 8)}`;
  const secondValue = `Nytt_${crypto.randomUUID().slice(0, 8)}`;
  let container: HTMLElement | null = null;
  let root: Root | null = null;

  try {
    ({ container, root } = await renderComponent(Component));
    const input = container.querySelector("input") as HTMLInputElement | null;
    const startsEmpty = !!input && input.value === "";

    if (input) await typeIntoInput(input, firstValue);

    const firstValueUpdated = !!input && input.value === firstValue;
    const firstOutputUpdated = (container.textContent ?? "").includes(firstValue);

    if (input) await typeIntoInput(input, secondValue);

    const secondValueUpdated = !!input && input.value === secondValue;
    const secondText = container.textContent ?? "";
    const secondOutputUpdated =
      secondText.includes(secondValue) && !secondText.includes(firstValue);

    return scoreTests([
      { name: "NameForm finns", passed: true, details: "NameForm hittades och renderades." },
      {
        name: "Input börjar tomt",
        passed: startsEmpty,
        details: !input ? "Inget inputfält hittades." : `Startvärde: "${input.value}".`
      },
      {
        name: "Första skrivningen uppdaterar input",
        passed: firstValueUpdated,
        details: firstValueUpdated ? "Första simulerade värdet syns i inputfältet." : "Inputfältet följde inte första värdet."
      },
      {
        name: "UI följer ett nytt inputvärde",
        passed: firstOutputUpdated && secondValueUpdated && secondOutputUpdated,
        details: firstOutputUpdated && secondValueUpdated && secondOutputUpdated
          ? "Två olika slumpade värden testades och UI:t följde båda."
          : "UI:t följde inte två efterföljande inputvärden korrekt."
      }
    ]);
  } finally {
    if (container && root) await cleanup(container, root);
  }
}

async function gradeFetch(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;

  const successCalls: unknown[][] = [];
  let successJsonCalls = 0;
  const payload = [{ id: crypto.randomUUID(), name: "Test" }];

  const successFetch = async (...args: unknown[]) => {
    successCalls.push(args);
    return {
      ok: true,
      status: 200,
      json: async () => {
        successJsonCalls += 1;
        return payload;
      }
    };
  };

  let successFn: any;
  try {
    successFn = getNamedValue(js, "getUsers", { fetch: successFetch });
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Koden kunde inte köras."
    };
  }

  let successResult: unknown;
  let successThrew = false;
  try {
    if (typeof successFn === "function") successResult = await successFn();
  } catch {
    successThrew = true;
  }

  let errorJsonCalls = 0;
  const errorFetch = async () => ({
    ok: false,
    status: 500,
    json: async () => {
      errorJsonCalls += 1;
      return { bad: true };
    }
  });

  let errorThrew = false;
  try {
    const errorFn = getNamedValue(js, "getUsers", { fetch: errorFetch });
    if (typeof errorFn === "function") await errorFn();
  } catch {
    errorThrew = true;
  }

  return scoreTests([
    {
      name: "getUsers finns",
      passed: typeof successFn === "function",
      details: typeof successFn === "function" ? "Funktionen hittades." : "Hittade ingen getUsers."
    },
    {
      name: "Anropar exakt /api/users",
      passed: successCalls.some((call) => call[0] === "/api/users"),
      details: successCalls.length ? `Första fetch-URL: ${String(successCalls[0]?.[0])}.` : "fetch anropades inte."
    },
    {
      name: "Läser JSON och returnerar datan",
      passed: !successThrew && successJsonCalls === 1 && successResult === payload,
      details: `json() anropades ${successJsonCalls} gång(er).`
    },
    {
      name: "Felresponse hanteras genom att kasta fel",
      passed: errorThrew && errorJsonCalls === 0,
      details: errorThrew
        ? errorJsonCalls === 0
          ? "500-response gav ett fel innan JSON lästes."
          : "Fel kastades, men JSON lästes ändå först."
        : "500-response gav inget kastat fel."
    }
  ]);
}

async function gradeZod(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;

  let schema: any;
  try {
    schema = getNamedValue(js, "formSchema");
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Koden kunde inte köras."
    };
  }

  const validName = `Anna${Math.floor(Math.random() * 10000)}`;
  const validEmail = `anna${Math.floor(Math.random() * 10000)}@test.se`;
  const safe = (value: unknown) => schema?.safeParse?.(value)?.success;

  return scoreTests([
    { name: "formSchema finns", passed: !!schema?.safeParse, details: schema?.safeParse ? "Ett körbart Zod-schema hittades." : "Hittade inget körbart formSchema." },
    { name: "Godkänner giltig data", passed: safe({ name: validName, email: validEmail }) === true, details: "Testade ett slumpat giltigt namn och email." },
    { name: "Name måste ha minst 2 tecken", passed: safe({ name: "A", email: validEmail }) === false, details: "Testade name='A'." },
    { name: "Email måste ha giltigt format", passed: safe({ name: validName, email: "inte-email" }) === false, details: "Testade ett ogiltigt emailformat." },
    { name: "Email krävs", passed: safe({ name: validName }) === false, details: "Testade data utan email." }
  ]);
}

async function gradeHono(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;

  let app: any;
  try {
    app = getNamedValue(js, "app");
  } catch (error) {
    return {
      score: 0,
      passed: false,
      tests: [],
      compileError: error instanceof Error ? error.message : "Koden kunde inte köras."
    };
  }

  let getStatus = 0;
  let body: any = null;
  let postStatus = 0;
  let wrongRouteStatus = 0;

  try {
    if (app?.request) {
      const getResponse = await app.request("/api/hello", { method: "GET" });
      getStatus = getResponse.status;
      body = await getResponse.json().catch(() => null);

      postStatus = (await app.request("/api/hello", { method: "POST" })).status;
      wrongRouteStatus = (await app.request("/api/not-hello", { method: "GET" })).status;
    }
  } catch {}

  return scoreTests([
    { name: "Hono-app finns", passed: !!app?.request, details: app?.request ? "Ett Hono-liknande app-objekt hittades." : "Hittade ingen körbar app." },
    { name: "GET /api/hello ger 200", passed: getStatus === 200, details: getStatus ? `Status: ${getStatus}.` : "Ingen fungerande GET-route hittades." },
    { name: "Returnerar exakt message: 'Hej!'", passed: body?.message === "Hej!", details: body ? `message=${JSON.stringify(body.message)}.` : "Kunde inte läsa JSON-response." },
    { name: "POST matchar inte GET-routen", passed: postStatus >= 400, details: postStatus ? `POST-status: ${postStatus}.` : "Kunde inte testa POST." },
    { name: "Fel route ger inte 200", passed: wrongRouteStatus >= 400, details: wrongRouteStatus ? `Fel route-status: ${wrongRouteStatus}.` : "Kunde inte testa fel route." }
  ]);
}

export async function gradeHello(code: string): Promise<GradeResult> {
  const { js, errors } = transpile(code);
  const failed = compileFailure(errors);
  if (failed) return failed;
  let container: HTMLElement | null = null;
  let root: Root | null = null;
  try {
    const component = getNamedValue(js, "Hello");
    if (typeof component !== "function") return scoreTests([{ name: "Hello finns", passed: false, details: "Skriv en komponent som heter Hello." }]);
    ({ container, root } = await renderComponent(component));
    const heading = container.querySelector("h1");
    return scoreTests([
      { name: "h1 renderas", passed: Boolean(heading), details: "Hello ska returnera en synlig h1-rubrik." },
      { name: "Texten Hej!", passed: heading?.textContent?.trim() === "Hej!", details: "Rubriken ska visa Hej!." }
    ]);
  } catch (error) {
    return { score: 0, passed: false, tests: [], compileError: error instanceof Error ? error.message : "Hello kunde inte köras." };
  } finally {
    if (container && root) await cleanup(container, root);
  }
}

export async function gradeExercise(exerciseId: string, code: string): Promise<GradeResult> {
  if (exerciseId === "counter") return gradeCounter(code);
  if (exerciseId === "greeting") return gradeGreeting(code);
  if (exerciseId === "name-form") return gradeNameForm(code);
  if (exerciseId === "fetch-users") return gradeFetch(code);
  if (exerciseId === "zod-form") return gradeZod(code);
  if (exerciseId === "hono-get") return gradeHono(code);

  return {
    score: 0,
    passed: false,
    tests: [],
    compileError: "Automatisk rättning finns inte för den här uppgiften ännu."
  };
}
