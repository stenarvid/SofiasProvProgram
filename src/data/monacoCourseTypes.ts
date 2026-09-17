/**
 * Small ambient type surface for the APIs used in this study app.
 *
 * Monaco runs its own TypeScript worker in the browser and does not automatically
 * read this project's node_modules. These declarations stop correct course examples
 * from being marked as "Cannot find module ..." while keeping normal TS diagnostics on.
 */
export const COURSE_MONACO_TYPES = `
declare module "react" {
  export type ReactNode = any;
  export type SetStateAction<T> = T | ((previous: T) => T);
  export type Dispatch<T> = (value: T) => void;

  export function useState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly unknown[]): T;

  const React: {
    Fragment: any;
  };
  export default React;
}

declare module "react/jsx-runtime" {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare namespace JSX {
  type Element = any;
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "react-router-dom" {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
  export const NavLink: any;
  export const Outlet: any;

  export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T;
  export function useNavigate(): (to: string | number, options?: any) => void;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  };
  export function useSearchParams(): [
    URLSearchParams,
    (next: URLSearchParams | Record<string, string> | string, options?: { replace?: boolean }) => void
  ];
}

declare module "@tanstack/react-query" {
  export type QueryKey = readonly unknown[];

  export type UseQueryOptions<TData = unknown> = {
    queryKey: QueryKey;
    queryFn: () => Promise<TData> | TData;
    enabled?: boolean;
    staleTime?: number;
  };

  export type UseQueryResult<TData = unknown, TError = Error> = {
    data: TData | undefined;
    error: TError | null;
    isPending: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    isSuccess: boolean;
    refetch: () => Promise<any>;
  };

  export function useQuery<TData = unknown>(
    options: UseQueryOptions<TData>
  ): UseQueryResult<TData>;

  export class QueryClient {
    invalidateQueries(options?: { queryKey?: QueryKey }): Promise<void>;
  }

  export const QueryClientProvider: any;
}

declare module "jotai" {
  export type Atom<Value> = { readonly __value?: Value };
  export type WritableAtom<Value> = Atom<Value> & { readonly __writable?: true };

  export function atom<Value>(initialValue: Value): WritableAtom<Value>;

  export function useAtom<Value>(
    anAtom: WritableAtom<Value>
  ): [Value, (value: Value | ((previous: Value) => Value)) => void];

  export function useAtomValue<Value>(anAtom: Atom<Value>): Value;
  export function useSetAtom<Value>(
    anAtom: WritableAtom<Value>
  ): (value: Value | ((previous: Value) => Value)) => void;
}

declare module "zod" {
  type SafeParseSuccess<T> = { success: true; data: T };
  type SafeParseError = { success: false; error: { issues: any[]; message: string } };
  type SafeParseReturn<T> = SafeParseSuccess<T> | SafeParseError;

  interface ZodType<T = any> {
    parse(input: unknown): T;
    safeParse(input: unknown): SafeParseReturn<T>;
    optional(): ZodType<T | undefined>;
  }

  interface ZodString extends ZodType<string> {
    min(length: number, message?: string): ZodString;
    max(length: number, message?: string): ZodString;
    email(message?: string): ZodString;
  }

  interface ZodNumber extends ZodType<number> {
    min(value: number, message?: string): ZodNumber;
    max(value: number, message?: string): ZodNumber;
    int(message?: string): ZodNumber;
  }

  type InferObject<T extends Record<string, ZodType<any>>> = {
    [K in keyof T]: T[K] extends ZodType<infer V> ? V : never;
  };

  export const z: {
    string(): ZodString;
    number(): ZodNumber;
    boolean(): ZodType<boolean>;
    object<T extends Record<string, ZodType<any>>>(shape: T): ZodType<InferObject<T>>;
    array<T>(schema: ZodType<T>): ZodType<T[]>;
    enum<T extends readonly [string, ...string[]]>(values: T): ZodType<T[number]>;
    literal<T extends string | number | boolean>(value: T): ZodType<T>;
  };

  export namespace z {
    type infer<T extends ZodType<any>> = T extends ZodType<infer V> ? V : never;
  }
}

declare module "hono" {
  export type Context = {
    req: {
      json<T = unknown>(): Promise<T>;
      param(name: string): string;
      query(name: string): string | undefined;
    };
    json<T>(data: T, status?: number): any;
    text(text: string, status?: number): any;
  };

  export type Handler = (c: Context) => any | Promise<any>;

  export class Hono {
    get(path: string, handler: Handler): this;
    post(path: string, handler: Handler): this;
    put(path: string, handler: Handler): this;
    patch(path: string, handler: Handler): this;
    delete(path: string, handler: Handler): this;
  }
}
`;

export function configureCourseMonaco(monaco: any) {
  const ts = monaco.languages.typescript;

  ts.typescriptDefaults.setCompilerOptions({
    jsx: ts.JsxEmit.ReactJSX,
    allowNonTsExtensions: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    strict: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true
  });

  ts.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  });

  ts.typescriptDefaults.addExtraLib(
    COURSE_MONACO_TYPES,
    "file:///provtraning-course-types.d.ts"
  );
}


let courseCompletionProviderRegistered = false;

type CourseSnippet = {
  label: string;
  detail: string;
  insertText: string;
};

export const COURSE_SNIPPETS: CourseSnippet[] = [
  { label: "h1", detail: "JSX <h1>", insertText: "<h1>${1:Rubrik}</h1>" },
  { label: "h2", detail: "JSX <h2>", insertText: "<h2>${1:Rubrik}</h2>" },
  { label: "p", detail: "JSX <p>", insertText: "<p>${1:Text}</p>" },
  { label: "div", detail: "JSX <div>", insertText: "<div${1: className=\"\"}>\\n\\t${2}\\n</div>" },
  { label: "button", detail: "JSX <button>", insertText: "<button type=\"button\"${1}>${2:Knapp}</button>" },
  { label: "input", detail: "JSX <input>", insertText: "<input type=\"${1:text}\" value={${2:value}} onChange={${3:onChange}} />" },
  { label: "form", detail: "JSX <form>", insertText: "<form onSubmit={${1:handleSubmit}}>\\n\\t${2}\\n</form>" },
  { label: "frag", detail: "React Fragment", insertText: "<>\\n\\t${1}\\n</>" },

  { label: "rfc", detail: "React function component", insertText: "function ${1:Component}() {\\n\\treturn (\\n\\t\\t${2:<div />}\\n\\t);\\n}" },
  { label: "us", detail: "React useState", insertText: "const [${1:value}, set${2:Value}] = useState(${3:initialValue});" },
  { label: "controlled", detail: "Controlled React input", insertText: "const [${1:name}, set${2:Name}] = useState(\"\");\\n\\n<input value={${1:name}} onChange={(e) => set${2:Name}(e.target.value)} />" },

  { label: "route", detail: "React Router Route", insertText: "<Route path=\"${1:/path}\" element={<${2:Page} />} />" },
  { label: "link", detail: "React Router Link", insertText: "<Link to=\"${1:/path}\">${2:Länk}</Link>" },
  { label: "params", detail: "React Router useParams", insertText: "const { ${1:id} } = useParams();" },

  { label: "query", detail: "TanStack React Query useQuery", insertText: "const { data, isPending, isError, error } = useQuery({\\n\\tqueryKey: [\"${1:key}\"],\\n\\tqueryFn: ${2:fetchData}\\n});" },
  { label: "qclient", detail: "React Query QueryClient", insertText: "const queryClient = new QueryClient();" },

  { label: "atom", detail: "Jotai atom", insertText: "const ${1:countAtom} = atom(${2:0});" },
  { label: "useatom", detail: "Jotai useAtom", insertText: "const [${1:value}, set${2:Value}] = useAtom(${3:myAtom});" },

  { label: "zobj", detail: "Zod object schema", insertText: "const ${1:schema} = z.object({\\n\\t${2:name}: z.string()\\n});" },
  { label: "zsafe", detail: "Zod safeParse", insertText: "const result = ${1:schema}.safeParse(${2:data});\\nif (!result.success) {\\n\\t${3}\\n}" },

  { label: "hono", detail: "Create Hono app", insertText: "const app = new Hono();" },
  { label: "hget", detail: "Hono GET route", insertText: "app.get(\"${1:/api/hello}\", (c) => {\\n\\treturn c.json({ ${2:message}: \"${3:Hej!}\" });\\n});" },
  { label: "hpost", detail: "Hono POST route", insertText: "app.post(\"${1:/api/items}\", async (c) => {\\n\\tconst body = await c.req.json();\\n\\t${2}\\n\\treturn c.json(body, 201);\\n});" },

  { label: "fetchget", detail: "fetch GET + response.ok + JSON", insertText: "const response = await fetch(\"${1:/api/items}\");\\nif (!response.ok) throw new Error(\"Request failed\");\\nconst data = await response.json();" },
  { label: "fetchpost", detail: "fetch POST JSON", insertText: "const response = await fetch(\"${1:/api/items}\", {\\n\\tmethod: \"POST\",\\n\\theaders: { \"Content-Type\": \"application/json\" },\\n\\tbody: JSON.stringify(${2:data})\\n});" }
];

export const COURSE_MONACO_EDITOR_OPTIONS = {
  minimap: { enabled: false },
  automaticLayout: true,
  quickSuggestions: {
    other: true,
    comments: false,
    strings: true
  },
  suggestOnTriggerCharacters: true,
  parameterHints: { enabled: true },
  tabCompletion: "on" as const,
  snippetSuggestions: "top" as const,
  wordBasedSuggestions: "matchingDocuments" as const,
  suggestSelection: "first" as const,
  acceptSuggestionOnEnter: "on" as const,
  fixedOverflowWidgets: true
};

export function configureCourseEditor(editor: any, monaco: any) {
  configureCourseMonaco(monaco);
  editor.updateOptions(COURSE_MONACO_EDITOR_OPTIONS);

  if (courseCompletionProviderRegistered) return;
  courseCompletionProviderRegistered = true;

  monaco.languages.registerCompletionItemProvider("typescript", {
    triggerCharacters: ["<", ".", " "],
    provideCompletionItems(model: any, position: any) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      return {
        suggestions: COURSE_SNIPPETS.map((snippet) => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: snippet.detail,
          documentation: `Provträning: ${snippet.detail}`,
          insertText: snippet.insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          sortText: `0-${snippet.label}`
        }))
      };
    }
  });
}
