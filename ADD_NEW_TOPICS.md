# Lägg till nya ämnen

Från version 21 behöver du normalt **inte ändra någon React-komponent** när du lägger till ett ämne.

## Filen du ändrar

`src/data/studyTopics.ts`

Alla ämnen som visas under **Lär dig** finns i arrayen:

```ts
export const studyTopics: StudyTopic[] = [
  // ämnen här
];
```

## Snabbaste sättet

1. Öppna `src/data/NEW_TOPIC_TEMPLATE.ts`.
2. Kopiera objektet `newTopicTemplate`.
3. Klistra in objektet som ett nytt objekt i `studyTopics`-arrayen.
4. Ändra:
   - `slug`
   - `title`
   - `summary`
   - `pages`
5. Spara.

Klart.

Du behöver inte lägga till:
- menyknapp
- route
- sidräknare
- föregående/nästa
- cheat sheet-komponent
- sidquiz-komponent
- kodövningskomponent

Allt detta skapas automatiskt från datan.

## Varierande antal sidor

Ett ämne kan ha 1 sida:

```ts
pages: [
  { ... }
]
```

eller 8 sidor:

```ts
pages: [
  { ... },
  { ... },
  { ... },
  { ... },
  { ... },
  { ... },
  { ... },
  { ... }
]
```

UI:t visar automatiskt till exempel `1 / 8`.

## Viktigt om id:n

Varje sida måste ha ett unikt `id`.

Bra:

```ts
id: "redux-p1"
id: "redux-p2"
```

Då kan progress/historik skilja sidorna åt.

## Quiz answer

`answer` är indexet för rätt alternativ:

```ts
options: [
  "A", // 0
  "B", // 1
  "C", // 2
  "D"  // 3
],
answer: 2
```

Då är `"C"` rätt.

## Automatisk progress

Nya teorisidor använder redan samma system för:
- frågeprogress
- ämnesprogress
- testhistorik
- kodprogress

Du behöver inte skapa nya localStorage-nycklar.

## Validering

`studyTopics.ts` innehåller också:

```ts
validateStudyTopics()
```

Den kan kontrollera vanliga datafel, exempelvis:
- duplicerade slugs
- duplicerade page-id:n
- ämne utan sidor
- quiz som inte har fyra alternativ
- ogiltigt answer-index

## Vad påverkar INTE den här filen?

Det stora fristående quizet under **Testa dig → Quiz** använder fortfarande sin egen frågebank.
Om du vill att ett helt nytt ämne även ska dyka upp där behöver quizbanken få frågor för ämnet.

Däremot fungerar sidquizet under **Lär dig** direkt för nya ämnen.
