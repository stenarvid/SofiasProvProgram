# React + TypeScript – Provträning

Det här är ett riktigt React + TypeScript-projekt byggt med Vite.

## Aktuella förbättringar för provträning

- Alla 56 siduppgifter har nu en obligatorisk del ”Tillämpa själv” som kräver en ändring eller ett nytt scenario utöver kodexemplet. De 44 automatiska sidrättarna kontrollerar även ändringen; inget oförändrat lektions­exempel ger godkänt. De övriga uppgifterna självbedöms med utökade kontrollpunkter. Tidigare sparade poäng och lösningar finns kvar och har inte ombedömts.

- Snabbfel har 116 frågor och Kodläsning 116 frågor. Båda täcker alla 14 ämnen och ger två frågor per lektionssida utöver de tidigare frågorna. Förklara koden, Förklara och Flashcards använder också alla 56 sidor. Sidanknutna uppgifter visar referenskoden och länkar till lektionen. De nya Snabbfel-frågorna ber dig hitta ett felaktigt påstående om ett korrekt referensexempel.

- Alla 15 övningslägen under Träna har ämnesval och ett tydligt avslut med knappen ”Starta ny omgång”. Visade uppgifter upprepas inte inom samma omgång, även vid ämnesbyte. Omstart eller ett nytt besök på sidan börjar en ny omgång. Begreppskartan och felboken har ämnesfilter; kodbanken har redan ämnesflikar.

- Alla 56 lektionssidor har granskats mot exempel, frågor och uppgifter. Varje sida har nu ett lärandemål, förkunskapslänkar, en tydlig uppgift och två kontroller av resultatet. Alla 14 ämnen har grundförklaringar. Se [sidgranskningen](PAGE_BY_PAGE_REVIEW.md) för detaljer, studieordning och avgränsningar.

- Den gemensamma quizbanken innehåller 168 frågor: 56 grundfrågor och 112 frågor med kodexempel från lektionerna.
- Svarsalternativ blandas på nytt i quiz, slutprov, checkpoints, sidquiz och repetition. Ordningen ligger still medan du svarar. Slumpning kan ibland ge samma ordning igen.
- Slutprovet visar dina svar, rätta teorisvar, förklaringar och bedömningsstöd för alla praktiska delar. Counter och fetch kan testas direkt efter provet. Övriga praktiska svar jämför du själv med bedömningsstödet.
- Provläget behåller dina svar synliga och låser redigering när tiden är slut.
- Kommentarer kan inte längre uppfylla sidkodens kontroller. Hello-övningen kontrollerar faktisk rendering. Övriga sidkodskontroller söker kodmönster och är inte fullständiga funktions- eller typkontroller.
- React-kodrättningen fungerar även i produktionsbygget, där Reacts testfunktion `act()` inte är tillgänglig.

Tidigare versionsanteckningar nedan beskriver hur projektet har utvecklats; äldre frågeantal gäller inte den aktuella versionen.

## Starta projektet

Öppna terminalen i projektmappen och kör:

```bash
npm install
npm run dev
```

Öppna sedan adressen som Vite visar, oftast:

```text
http://localhost:5173
```

## Vad projektet innehåller

- React-komponenter
- Props
- State / useState
- TypeScript-grunder
- Databinding
- Bundling / Vite
- React Router
- fetch
- React Query / TanStack Query
- Hono
- Jotai
- Forms och Zod
- Kodövningar
- Quiz

## Tips

Försök först förklara varje område med egna ord.

Skriv sedan kodövningarna utan att visa lösningen.

Kör quizet sist.


## Quiz-läge

Quizet visar en fråga i taget.

1. Välj ett svar.
2. Klicka på `Rätta svar`.
3. Du får direkt veta om det var rätt eller fel.
4. En förklaring visas.
5. Klicka på `Nästa fråga`.
6. Frågorna blandas så att ordningen varierar.


## Praktisk programmering med IntelliSense

Kodövningarna använder Monaco Editor.

- TypeScript/TSX-editor
- syntax highlighting
- IntelliSense/autocomplete
- felmarkeringar
- parameter hints
- 10 praktiska övningar
- ledtrådar och facit

Tryck `Ctrl + Space` för IntelliSense.


## Quizbank

Quizet innehåller 50 frågor.

Du kan välja att köra 5, 10, 15, 20, 25, 30, 40 eller 50 frågor.
Varje gång du startar eller gör om testet slumpas både vilka frågor du får och ordningen.


## Provområden
React, State, Comp, Router, Fetch, query, Jotai, Zod, Forms, Props, Databindning, Typescript, Hono och Server.

Quizbanken innehåller 56 frågor, fyra per område.


## Monaco JSX fix

Monaco-editorn innehåller nu lokala typdefinitioner för både `react` och
`react/jsx-runtime`, så JSX/TSX-övningar ska inte ge det falska felet
"react/jsx-runtime could not be found".


## Live preview

De visuella kodövningarna har nu en live-preview under Monaco-editorn.

Exempel:
- Props-komponenten visar den renderade texten.
- `useState`-countern visar en riktig klickbar knapp.
- Databindningsövningen visar ett riktigt inputfält.
- Jotai-countern går att klicka på.

Previewen uppdateras automatiskt när koden ändras.

Fetch-, query-, Zod-, Hono- och andra serverorienterade övningar visar istället
att de inte har någon visuell preview.


## Version 8 – komplett provträningsläge

Nytt i denna version:

- Hjälpnivå på kodövningar:
  - Lätt = detaljerad steg-för-steg-instruktion och kommentarer
  - Normal = kortare instruktion och lite startkod
  - Svår = bara målet och minimal hjälp
- Debug-övningar
- Mini-projekt som kombinerar flera områden
- Provläge med timer
- Statistik över rätt/fel per ämne
- Svaga områden visas automatiskt
- API/server-simulator
- Live preview finns kvar på visuella React-uppgifter
- IntelliSense/Monaco finns kvar


## Version 9 – study suite

Tillagt:

- Ämnesfilter i quiz
- Spaced repetition: områden med fler fel får högre chans att dyka upp
- Testhistorik
- "Förklara med egna ord"
- Begreppskoppling
- "Vad är fel här?"-snabbfrågor
- Kodkomplettering med IntelliSense
- Kedjeuppgifter som kombinerar flera områden
- Sista-minuten cheat sheet
- Alla funktioner från version 8 finns kvar
- IntelliSense är fortfarande aktiverat


## Version 10 – progress & full exam

Nytt:

- Progress per enskild quizfråga
- Sparar antal gånger sedd, rätt, fel och felprocent i localStorage
- Progressen finns kvar mellan sessioner i samma webbläsare
- "Öva på alla missade frågor"
- Mastery per ämne
- Flashcards
- Kodläsning
- HTTP-träning
- TypeScript-feltolkning
- Dagens blandade träning
- Vanliga misstag per ämne
- Simulerat slutprov med:
  - 10 teori
  - 2 kodläsning
  - 2 debug
  - 3 programmeringsuppgifter
  - 1 kedjeuppgift
  - 2 frågor att förklara med egna ord
- Spaced repetition väger nu både ämnesstatistik och statistik per fråga

Antal frågor i frågebanken: 56


## Version 11 – backup & progressfil

Progress sparas på tre nivåer:

1. `localStorage` uppdateras direkt i webbläsaren.
2. `Exportera progress` laddar ner all progress som en JSON-fil.
3. Om webbläsaren stöder File System Access API kan `Koppla progressfil`
   välja en JSON-fil på datorn som därefter försöker autosparas när
   progress ändras.

JSON-backupen är normalt mycket liten (oftast bara några KB eller tiotals KB).

Direkt autosave till vald fil beror på webbläsarens stöd och filbehörigheter.
Export/import fungerar även när direkt filskrivning inte stöds.


## Version 12 – automatisk kodrättning

Kodövningarna har nu `Rätta min kod`.

Rättningen försöker kontrollera funktion/beteende istället för exakt text:

- Counter renderas och klick testas
- Props-komponent renderas med test-prop
- Controlled input kontrolleras
- Fetch körs mot mockad fetch
- Zod-schema testas med giltig/ogiltig data
- Hono-route anropas med app.request

Varje uppgift kan ge delpoäng, t.ex. 75% om 3 av 4 tester klaras.

Kodprogress sparar:

- antal försök
- antal godkända försök
- bästa resultat
- senaste resultat
- antal använda hints
- antal facitvisningar

Kodprogress ingår även i JSON-backup/export.

## Version 13 – verifierad kodrättning

Kodrättaren är omskriven för att minska falska positiva och falska negativa resultat:

- React-hooks injiceras korrekt i testmiljön efter att imports tagits bort.
- React-rendering och events körs med `act()`.
- Counter testas över två riktiga klick: 0 → 1 → 2.
- Props testas med två slumpade namn så hårdkodade svar inte passerar.
- Controlled input testas med ett riktigt input-event och slumpat värde.
- Fetch testas både med lyckad response och `ok: false`; kommentarer kan inte lura testet.
- Zod testas med flera slumpade giltiga/ogiltiga datafall.
- Hono testas med GET, fel HTTP-metod, fel route och exakt JSON-värde.
- `export default app` stöds i Hono-övningen.
- Quizens svarsalternativ slumpas, så rätt svar ligger inte alltid på samma plats.
- Automatiska Vitest/jsdom-regressionstester finns i projektet (`npm test`).

Ingen automatisk rättare kan bevisa korrekthet för godtycklig kod, men den här versionen är verifierad mot både korrekta lösningar och medvetna edge-case/fellösningar för de övningar som har automatisk rättning.


## Version 13 verified – extra edge-case pass

Kodrättningen har stärkts ytterligare:

- React `act` används direkt från React.
- Counter accepterar extra statiska siffror i knappen men kräver en faktisk 0 → 1 → 2-sekvens.
- Props-typkontrollen accepterar lokala string-type aliases men underkänner optional `name?`.
- Controlled input testas med två olika slumpade värden i följd.
- Fetch testas både mot korrekt endpoint, JSON-return och en 500-response.
- Hono testas för GET-metod, exakt route, exakt JSON-message samt fel metod/fel route.
- Quiz-alternativ slumpas utan att tappa vilket svar som är korrekt.
- Kodprogress ingår i backup/export.

Det finns även automatiska Vitest-fall för både korrekta och medvetet felaktiga lösningar.


## Version 14 – grupperad navigation

Huvudnavigationen är nu uppdelad i fyra logiska huvudgrupper:

- Lär dig
  - Ämnen & teori
  - Cheat sheet
  - Vanliga fel
  - Begrepp
  - Förklara
- Träna
  - Kodövningar
  - Debug
  - Kodkomplettering
  - Snabbfel
  - Mini-projekt
  - Kedjeuppgifter
  - Flashcards
  - Kodläsning
  - HTTP
  - TypeScript-fel
  - Server-simulator
- Test & prov
  - Dagens träning
  - Quiz
  - Provläge
  - Slutprov
- Min progress
  - Progress
  - Kodprogress
  - Ämnesstatistik
  - Testhistorik
  - Backup

Ingen funktion har tagits bort; bara navigationen har organiserats.


## Version 15 – Ämnen & teori fixad

`/topics` är nu en riktig sida med samtliga provområden:

- React
- State
- Components
- React Router
- Fetch
- React Query
- Jotai
- Zod
- Forms
- Props
- Databindning
- TypeScript
- Hono
- Server

Varje ämne visar kort teori/nyckelpunkter och länkar vidare till quiz,
kodövningar och cheat sheet.


## Version 16 – mer detaljerad teori

Ämnen & teori har nu:

- Utförligare förklaringar för alla provområden
- "Det här bör du kunna på provet"
- Kodexempel direkt på varje ämne
- Expanderbara kort så sidan inte blir för lång
- Samma länkar vidare till quiz, kodövningar och cheat sheet


## Version 17 – öppna/stäng alla ämnen

Ämnen & teori har nu två globala knappar:

- Visa alla detaljer
- Dölj alla detaljer

De öppnar eller stänger samtliga teori- och kodexempel samtidigt.


## Version 18 – Ämnen som kursbok

Ämnen & teori är nu ombyggd till ett bok-/kursläge:

- Fast ämnesmeny till vänster
- Ett ämne visas i taget
- Varje ämne har 5 separata teorisidor
- Föregående / Nästa längst ned
- Sidnummer visas som t.ex. 2 / 5
- Sidnumret går att skriva i för direkt hopp
- Mer teori, kodexempel, vanliga misstag och repetition per ämne
- Menyn ligger kvar medan innehållet byts


## Version 19 – sidanpassad träning

Ämnen har nu olika antal teorisidor beroende på hur mycket material som faktiskt behövs.

Varje teorisida innehåller dessutom:
- ett cheat sheet bara för den aktuella sidan
- ett sidquiz bara på innehållet på den aktuella sidan
- en kodövning bara för den aktuella sidan

Sidquiz sparas i samma ämnesprogress, frågeprogress och testhistorik som övriga quiz.
Kodförsök sparas i den befintliga kodprogressen.

Exempel:
State → Functional updates kan tränas separat utan att blanda in forms eller props.


## Version 20 – streamlined

Huvudnavigationen är reducerad till fem val:

- Start
- Lär dig
- Träna
- Testa dig
- Progress

Start är nu en dashboard med dagens träning, snabbstatus och svaga ämnen.

Träna och Testa dig är hubbar med tydliga kort istället för stora dropdown-menyer.

Progress samlar översikt, ämnesstatistik, kodprogress, historik och backup
som interna flikar på samma sida.

På teorisidorna visas bara teorin först. Cheat sheet, sidquiz och sidkodövning
ligger bakom en enda "Öva på sidan"-knapp.


## Version 21 – modulära ämnen

Alla ämnen under Lär dig har flyttats ur React-komponenten till:

`src/data/studyTopics.ts`

För ett nytt ämne behöver du bara lägga till ett dataobjekt.
Menyer, sidnavigation, sidantal, cheat sheet, sidquiz, kodövning och progresskoppling
genereras automatiskt.

En kopiera/klistra-in-mall finns i:

`src/data/NEW_TOPIC_TEMPLATE.ts`

Mer detaljerade instruktioner finns i:

`ADD_NEW_TOPICS.md`


## Version 22 – UI polish

Funktionaliteten och progressdatan från v21 är bevarad, men gränssnittet har
gjorts renare och mer kurslikt:

- kompakt sticky header
- fem tydliga huvudval
- lugnare färgpalett och konsekvent spacing
- smalare sticky ämnesmeny
- tydligare aktivt ämne
- ämne + sidnummer visas tillsammans
- sticky Föregående / sida / Nästa längst ned
- "Öva på sidan" är en enda tydlig CTA
- Cheat sheet / Quiz / Kod visas som tabs, en i taget
- förbättrade quizalternativ och kodeditor-layout
- bättre mobilnavigation
- samma progress-, historik- och backupdata som tidigare


## Version 23 – klickbar logotyp

Logotyp-/titelblocket i headern är nu en länk till startsidan (`/`).


## Version 24 – bättre studieflöde

Nya kvalitetsfunktioner utan fler huvudmenyer:

- "Fortsätt där du slutade" på startsidan
- URL sparar valt ämne + sida
- teorisidor kan markeras som klara
- ämnesmenyn visar `klara / totalt`
- teorisidor kan bokmärkas
- snabbknapp till bara missade quizfrågor
- efter sidquiz visas rekommenderat nästa steg
- nya studieflödesdata inkluderas i JSON-backup/autosave

All befintlig quiz-, kod-, historik- och progressdata använder samma nycklar som tidigare.


## Version 25 – smartare provträning

Tre nya studieverktyg:

### Spaced repetition
Frågor får nu ett nästa repetitionsdatum.
- fel svar: kommer tillbaka snabbt
- rätt svar: 1 dag → 3 dagar → 7 dagar → 14 dagar → 30 dagar
- frågor som är aktuella visas som "Repetera nu" på startsidan
- aktuella frågor får även högre vikt i vanliga quiz

### Checkpoint per ämne
Varje ämne har en Checkpoint-knapp.
Checkpointen bygger ett test från sidquizet för varje sida i just det ämnet.
Resultatet sparas i vanlig progress, frågeprogress och historik.

### Sök i teorin
Lär dig-sidan har sökfält.
Sökningen letar i:
- ämnesnamn och beskrivning
- sidtitel och introduktion
- viktiga punkter
- cheat sheets
- kodexempel
- koduppgifter

En träff hoppar direkt till rätt ämne och sida.


## Version 26 – provberedskap, anteckningar och smart nästa steg

### Provberedskap
Finns under Progress → Provberedskap och visar bara konkreta sparade mått:
- tränade ämnen / totalt
- klara teorisidor / totalt
- due-frågor
- klarade kodövningar / försökta
- tidigare fel som ännu inte stabiliserats
- ämnen med lägst träffsäkerhet

Det är medvetet inte ett betyg eller en prognos.

### Egna anteckningar
Varje teorisida har nu ett fält för egna anteckningar.
Anteckningar sparas automatiskt i samma study-flow-data och följer därför med
befintlig JSON-backup/autosave.

### Smart "Vad ska jag göra nu?"
Startsidan väljer ett rekommenderat nästa steg i denna ordning:
1. due spaced-repetition-frågor
2. tidigare missade frågor
3. svagaste tränade ämnet
4. första ofärdiga teorisidan
5. kodövning

Det skapar inga nya huvudmenyer.


## Version 27 – dagliga mål, sparat, smart slumpning och genvägar

### Dagliga mål
Startsidan visar nu:
- quizfrågor
- teorisidor
- kodövningar

Standardmål är 10 frågor, 2 teorisidor och 1 kodövning.
Målen kan ändras direkt på startsidan och nollställs automatiskt nästa dag.
Frågor räknas via vanlig quizprogress, teorisidor när en ny sida markeras klar
och kodövningar när ett kodförsök registreras.

### Sparat
Progress → Sparat samlar:
- alla teorisidor med egna anteckningar
- alla bokmärkta teorisidor

Varje post länkar tillbaka direkt till rätt ämne och sida.

### Slumpa smart träning
Startsidan har en ny "Slumpa smart träning"-knapp.
Den prioriterar:
1. due-frågor
2. missade frågor
3. ett av de tre svagaste tränade ämnena
4. slumpad ofärdig teorisida
5. kodträning

### Tangentbordsgenvägar under Lär dig
- ← = föregående sida
- → = nästa sida
- Q = öppna Quiz
- C = öppna Kod
- H = öppna Cheat sheet
- B = bokmärk/ta bort bokmärke
- M = markera/avmarkera sidan som klar
- O = öppna/stäng "Öva på sidan"

Genvägar ignoreras när du skriver i input, textarea, select eller Monaco-editorn.


## Version 28 – global sök, kommandopalett, streak och UI-polish

### Global sök / kommandopalett
Öppna från headern eller med:
- `Ctrl + K` / `Cmd + K`
- `/` när du inte skriver i ett fält

Sökningen hittar:
- navigation och träningslägen
- teorisidor och deras innehåll
- quizområden och frågor

Använd `↑` / `↓` och `Enter` för att navigera utan mus.

### Genvägshjälp
Tryck `?` för att öppna en översikt över alla genvägar.
I Lär dig finns dessutom:
- `S` = fokusera teorisök
- `N` = fokusera anteckningar
- `Esc` = stäng Öva på sidan
- befintliga Q/C/H/B/M/O och piltangenter är kvar

Globalt:
- `R` = smart träning
- `Ctrl/Cmd + K` = global sök
- `/` = global sök
- `?` = genvägshjälp

### Streak och veckovy
Startsidan visar nu:
- antal studiedagar i rad
- vilka av de senaste sju dagarna som haft faktisk aktivitet

En studiedag räknas när du:
- svarar på quiz
- registrerar ett kodförsök
- markerar en ny teorisida som klar

### Senast använda
Startsidan sparar de senaste teorisidorna och träningslägena du besökt
och låter dig hoppa direkt tillbaka.

### UI-polish
- mer sammanhållen header
- global sökknapp i headern
- tydligare fokus- och hover-states
- snyggare overlays för sök och genvägar
- bättre dashboard-hierarki
- förbättrad responsiv layout
- stöd för `prefers-reduced-motion`

Streak och senaste aktivitet ingår i JSON-backupen.


## Version 29 – förklarande teori + punktläge

Teorin under **Lär dig** använder nu två lägen:

### Förklaringsläge (standard)
Alla 56 teorisidor har fått egna lättlästa förklaringar i löpande text.
Texterna förklarar inte bara *vad* något är utan försöker även förklara:
- hur det fungerar
- hur syntaxen ska läsas
- varför man använder det
- hur det hänger ihop med kodexemplet
- vanliga mentala modeller inför provet

Exempelvis förklarar React-sidan nu uttryckligen att:

`function Hello() { return <h1>Hej!</h1>; }`

är en React-komponent, varför den räknas som en komponent och hur den används
som `<Hello />`.

### Punktläge
Med knappen **Punkter** kan du byta tillbaka till de korta bullet pointsen när
du vill repetera snabbt.

Valet sparas lokalt så att sidan kommer ihåg vilket teoriläge du föredrar.


## Version 30 – content audited

The study content has been reviewed for factual accuracy and consistency.
See `CONTENT_AUDIT_V30.md` for the scope and corrections.

A new Vitest file, `src/data/contentAudit.test.ts`, also guards the structure of
the 14 subjects, 56 theory pages and 56 global quiz questions so future edits
are less likely to silently break the study material.


## Version 31 – roligare studier + aktiva provlägen

### Ljud och celebration
Headern har nu en `♪`-knapp för:
- rätt/fel-ljud
- volym
- små celebration-effekter

Ljud skapas lokalt med Web Audio API, så inga externa ljudfiler behövs.
Allt kan stängas av.

Dagens tre mål ger också en liten achievement-feedback när alla är klara.

### Nya studielägen
- **Muntligt prov** – svara högt innan stöd/facit visas. Frågan kan läsas upp med webbläsarens speech synthesis.
- **Förklara koden** – skriv med egna ord och jämför med en referensförklaring.
- **Vad blir output?** – förutse kodresultat innan rättning.
- **Mina misstag** – automatisk felbok från missade quizfrågor med egna minnesregler.
- **Provchecklista** – markera vad du faktiskt kan förklara utan hjälp.
- **Begreppskarta** – visar viktiga flöden mellan React, state, Zod, fetch, Hono och server.
- **Kodjämförelse** – kodövningarnas facit visar nu din kod bredvid exempellösningen.

### Fokusläge
Klicka **Fokus** i headern eller tryck `F`.
Header och distraherande element tonas bort/döljs.
En flytande knapp avslutar fokusläget.

### Offline / PWA
Projektet innehåller nu:
- `manifest.webmanifest`
- service worker
- offline-cache efter första produktionsbesöket
- appikon

Service workern registreras endast i production build.

### Backup
Ljudinställningar, felboksanteckningar, provchecklista och fokusinställning ingår i backupen.


## Version 32 – fixes from real npm test/build

v32 fixes the failures reported from v31's local test/build:
- QuestionProgress `questionId` typing in Mina misstag
- Vite `import.meta.env` typing
- content-audit minimums for cheat sheets/bullets/explanations
- React `act(...)` environment configuration for grader tests

See `VERIFICATION_V32.md`.


## Version 33 – sidspecifik kodträning fixad

Fixar problemet där React-övningen bad om `Welcome` samtidigt som sidan lärde ut
`Hello`, samt de röda JSX-markeringarna i den sidspecifika Monaco-editorn.

Den editorn kör nu korrekt TSX-konfiguration med React JSX-stöd.


## Version 34 – Monaco-stöd för hela kursstacken

Båda Monaco-editorerna använder nu samma kursanpassade TypeScript-konfiguration.

Editorn känner till de API:er som används i kursen för:
- React + TSX (`useState`, hooks, JSX)
- React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`, `useNavigate`)
- TanStack React Query (`useQuery`, `queryKey`, `queryFn`, statusfält, `QueryClient`)
- Jotai (`atom`, `useAtom`, `useAtomValue`, `useSetAtom`)
- Zod (`z.string`, `z.number`, `z.object`, `safeParse`, `z.infer` m.m.)
- Hono (`Hono`, GET/POST/PUT/PATCH/DELETE, `c.req.json`, `c.json`)
- vanlig TypeScript/DOM/fetch via Monacos inbyggda TypeScript-lib

Detta är små utbildningsanpassade ambient declarations. De ersätter inte bibliotekens
riktiga typer i själva projektets build; syftet är att Monaco i browsern inte ska visa
falska `Cannot find module`-fel för korrekt kurskod.


## Version 35 – Monaco även i mock/slutprov

Nu använder även provlägena Monaco där användaren faktiskt ska skriva kod.

### Provläge
De fem slumpade praktiska uppgifterna får varsin Monaco-editor.

### Simulerat slutprov
Monaco används nu i:
- debug-delen
- programmeringsdelen
- kedjeuppgiften

Kodläsning använder fortfarande vanligt svarsfält eftersom du ska förklara svaret,
och muntliga frågor använder fortfarande textareas för resonemang.

Alla prov-editorer använder samma `configureCourseMonaco()` som övriga sidan och
har därför TSX + React Router + React Query + Jotai + Zod + Hono-stöd.


## Version 36 – riktig rättning av sidspecifika kodövningar

Den gamla sidspecifika Kod-fliken sparade bara ett icke-tomt svar som 100%.
Det är nu borttaget.

### Automatisk rättning
Koduppgifter får nu:
- knappen **Rätta kod**
- verklig poäng baserad på uppgiftens krav
- delpoäng
- checklista med godkända/missade krav
- syntaxfel visas separat
- riktig score/pass sparas i Kodprogress
- rätt/fel-ljud använder samma feedbacksystem som övriga sidan

Det finns en grading-spec för samtliga 56 teorisidor.

### Förklaringsuppgifter
Öppna resonemangsfrågor (t.ex. när React Query passar bättre, prop vs state och
request/server/response) automatbedöms inte med låtsaslogik. De visar i stället:
- vanligt textfält
- vad svaret bör ta upp
- tydlig självbedömningsknapp

### Regressionstest
Ett test använder exakt typen av svar från skärmbilden:
`const name = "Anna"; return <p>{name}</p>;`
och kräver 100%.


## Version 37 – sparad kod + kodbank per ämne

Kodprogress sparar nu även:
- senaste kod du skickade in
- koden från ditt bästa resultat

Gamla progressposter utan sparad kod fortsätter fungera.

Ny route: `/code-library`.

Kodbanken låter dig:
- välja ett ämne, t.ex. React
- se alla ämnets sidspecifika koduppgifter på samma sida
- se försök, senaste poäng och bästa poäng
- visa senaste sparade kod
- fortsätta arbeta på senaste kod i den riktiga editorn
- öppna bästa lösningen om den skiljer sig från den senaste
- hoppa tillbaka till teorisidan

Kodprogress-sidan kan också visa senaste sparade koden.

React-sidan "Komponenter och komposition" har samtidigt justerats så exemplet
och uppgiften båda använder Header + Footer. Rättaren accepterar nu antingen
lokalt definierade eller importerade Header/Footer-komponenter.


## Version 38 – permanent 'Markera sidan som klar'

Knappen för att markera en teorisida som klar ligger nu alltid längst ner på sidan
och är inte längre beroende av Quiz-fliken.

Nederdelen visar:
- Föregående / Nästa
- aktuellt sidnummer
- permanent klar/avmarkera-kontroll

Högst upp bredvid sidnumret visas också `✓ Klar` eller `Inte klar`.

Quizresultat och sidans klar-status är nu separata saker.


## Version 39 – IntelliSense överallt + större sidquiz

### IntelliSense / Monaco
Alla Monaco-editorer använder nu samma centrala editor-konfiguration:
- teorisidornas kodövningar
- vanliga kodövningar
- debug
- kodkomplettering
- tidsbaserat provläge
- simulerat slutprov

Tab completion och snippets är aktiverade. Exempel:
- `h1` + Tab → JSX-h1
- `div`, `p`, `button`, `input`, `form`
- `rfc` → React-komponent
- `us` → useState
- `route`, `link`, `params`
- `query` → React Query
- `atom`, `useatom`
- `zobj`, `zsafe`
- `hono`, `hget`, `hpost`
- `fetchget`, `fetchpost`

Vanlig TypeScript/TSX IntelliSense och bibliotekstyperna från v34 finns kvar.

### Fler frågor per teorisida
Varje av de 56 teorisidorna har nu tre sidquizfrågor:
1. den ursprungliga frågan
2. en flervalsfråga där flera alternativ kan vara rätt
3. en repetitionsfråga

Det ger totalt 168 sidfrågor, varav 56 är flervalsfrågor.
Varje fråga sparas separat i progress-systemet.


## Version 40 – Quiz först

När `Öva på den här sidan` öppnas är ordningen nu:

1. Quiz
2. Kod
3. Cheat sheet

Quiz är standardfliken. Cheat sheet ligger sist så att du inte ser hjälpen innan du försökt själv.


## Version 42 – rätt sidrättare + synlig IntelliSense

Två rapporterade problem är fixade:

### 1. Rätt kodrättare per sida
Rättningsresultat är nu hårt bundet till aktuell `page.id`.
Om användaren byter sida medan rättningen körs ignoreras det gamla resultatet.
Ett resultat visas endast när dess page-id matchar sidan som är öppen.

React p4 (`Profile`) har regressionstest som verifierar reglerna:
`Profile`, `Namn`, `Titel`, `Knapp`.

### 2. IntelliSense får gå utanför editorfönstret
Monaco använder nu `fixedOverflowWidgets: true`.
Editor-containrarna klipper inte längre autocomplete-, hover- och parameterfönster.
När editorn har fokus höjs dess z-index så förslagslistan kan visas över innehåll under editorn.

Det gör till exempel att en lång IntelliSense-lista kan fortsätta nedanför den synliga
Monaco-rutan i stället för att skäras av vid dess nederkant.


## Version 43 – Missade frågor synkade

Fixar en inkonsekvens där startsidan kunde visa t.ex. `1 missad fråga`,
men `/quiz?mode=wrong` samtidigt sa att det inte fanns några frågor.

Orsaken var att startsidan räknade alla poster i questionProgress,
inklusive sidspecifika quiz-ID:n som inte finns i globala questionBank.

Nu använder både startsidan och Missade frågor samma filtrerade källa:
endast globala quizfrågor som faktiskt går att öppna i `/quiz?mode=wrong`
räknas där.

Sidspecifika quizresultat finns fortfarande kvar i progressdata; de raderas inte.


## Version 44 – Missade frågor direkt på startsidan

Startsidan har nu ett eget huvudval för `Missade frågor`.

- Länken går direkt till `/quiz?mode=wrong`
- antal missade frågor visas när det finns några
- om listan är tom förklarar kortet vad som kommer visas där
- den gamla extra `Öva missade`-rutan längre ner har tagits bort för att undvika dubletter


## Version 45 – alla missade frågor på samma sida

`Missade frågor` är nu en egen sida (`/missed-questions`) som samlar:

- vanliga globala quizfrågor
- sidspecifika quizfrågor från `Lär dig`
- sidspecifika flervalsfrågor

Startsidan räknar nu samma fullständiga lista som Missade frågor-sidan visar.
Det betyder att ett fel på t.ex. React → JSX och rendering faktiskt dyker upp där.

Den nya sidan visar också var frågan kommer ifrån, tidigare antal fel,
och kan rätta både single-select och multi-select.


## Version 46 – exakt missad fråga sparas

Fixar fallet där en sidspecifik fråga kunde registreras som fel men ändå inte visas i
`Missade frågor`.

Nu sparas en `reviewSnapshot` tillsammans med varje frågeförsök:
- exakt frågetext
- alla svarsalternativ
- rätt svar/rätta svar
- single- eller multi-select
- förklaring
- teorisidans titel

`Missade frågor` läser först denna snapshot. För äldre progress utan snapshot finns
bakåtkompatibel fallback via både question-id och exakt frågetext.

Om mycket gammal data inte längre går att rekonstruera döljs den inte längre; den visas
som en äldre missad fråga med länk tillbaka till teorin.


## Version 47 – klarade missade frågor tas bort

`Missade frågor` betyder nu olösta frågor, inte alla frågor som någon gång blivit fel.

Regler:
- fel svar -> frågan läggs i Missade frågor
- rätt svar på den missade frågan -> den tas bort ur repetitionskön
- `Gör om de missade frågorna` laddar om kön och visar bara frågor som fortfarande är olösta
- om samma fråga blir fel igen senare -> den läggs tillbaka

Detta bygger på senaste svarsstreak (`consecutiveCorrect`): en fråga med tidigare fel
är bara "missad" när senaste försöket fortfarande är fel.
