export type ApplicationQuestion = { question: string; options: string[]; answer: number; explanation: string };
const q = (question: string, correct: string, wrong1: string, wrong2: string, explanation: string): ApplicationQuestion =>
  ({ question, options: [correct, wrong1, wrong2], answer: 0, explanation });

// These questions assess the application task, independently of the theory-page quiz.
export const applicationQuestions: Record<string, ApplicationQuestion[]> = {
  "server-p5": [
    q("React-sidan på shop.example.test kör fetch('/api/orders'). Vilken adress använder webbläsaren?", "https://shop.example.test/api/orders", "http://127.0.0.1:4000/api/orders på användarens dator", "Databasens interna adress", "Den relativa URL:en använder sidans origin. Det är proxyn som känner till ordertjänstens interna adress."),
    q("Vilken returväg har ordertjänstens svar i detta exempel?", "Ordertjänst → reverse proxy → webbläsare", "Ordertjänst → React-state direkt utan ett HTTP-svar", "Ordertjänst → webbläsaren måste byta till port 4000", "Proxyn förmedlar svaret tillbaka. Klientens kod måste fortfarande läsa datan och uppdatera gränssnittet."),
    q("Två ordertjänster kan hantera samma slags anrop. Vad innebär lastbalansering?", "Proxyn fördelar anrop mellan backend-instanserna enligt sin konfiguration", "Varje klient måste känna till båda servrarnas interna adresser", "Alla anrop körs automatiskt i React i stället för backend", "Lastbalansering kan fördela belastning. Den förutsätter konfiguration och att tjänsterna kan hantera anropen."),
    q("Vad är skillnaden mellan proxyns vidarebefordran och en redirect?", "Proxyn kontaktar backend själv; en redirect ber klienten göra ett nytt anrop", "Båda kräver alltid att webbläsaren byter till den interna adressen", "En redirect ersätter backendens behörighetskontroll", "Vid vanlig reverse proxying behåller klienten den publika adressen. En redirect skickar en hänvisning till klienten.")
  ],
  "query-p4": [
    q("Två ProductList använder ['products'] under samma QueryClient. Vad delar de?", "Samma cachepost för produktlistan", "Alla lokala useState-värden", "Var sin cachepost eftersom komponenterna är olika", "Samma klient och queryKey ger samma cache-identitet, men lokalt komponent-state delas inte automatiskt."),
    q("Den ena byter nyckel till ['products', 'sale']. Vad händer?", "Den får en annan cachepost; queryFn måste själv hämta reaprodukterna", "React Query lägger automatiskt till ett reafilter i HTTP-anropet", "Den delar fortfarande samma cachepost som ['products']", "Nyckeln identifierar data. Den ändrar inte hur queryFn bygger sin request.")
  ],
  "jotai-p3": [
    q("Header och Checkout ska visa samma varukorg. Var bör innehållet finnas?", "I gemensamt state, till exempel en delad atom", "I två oberoende lokala states", "I en vanlig lokal variabel i Header", "Båda behöver läsa och uppdatera samma data; oberoende kopior riskerar att skilja sig åt."),
    q("En varukorgspanels öppet/stängt-läge används bara i panelen. Vad passar?", "Lokalt boolean-state i panelen", "Samma atomvärde som varukorgens produktlista", "Ingen state behövs för att minnas läget", "Panelens visningsläge kan vara lokalt även när innehållet delas med andra komponenter.")
  ],
  "props-p3": [
    q("CounterButton och CounterLabel ska följa samma count. Vem äger state?", "Deras gemensamma parent", "Varje syskon äger var sin separat räknare", "CounterLabel ändrar direkt i CounterButtons props", "Lyft upp state till närmaste gemensamma parent så finns en källa för räknaren."),
    q("Vilka props gör att knappen kan ändra värdet och etiketten visa det?", "Knappen får en callback och etiketten får count", "Etiketten får setCount som synlig text", "Knappen muterar etikettens count-prop direkt", "Parent skickar en funktion som uppdaterar state; nya props gör sedan att etiketten visar det nya värdet.")
  ],
  "server-p1": [
    q("Vad händer vid GET /api/products när servern fungerar?", "Klienten skickar requesten och serverns route returnerar produktdata", "Servern kör klientens React-rendering automatiskt", "Klienten skapar serverns route genom att skriva URL:en", "Klient och server har olika ansvar och möts genom en HTTP-request och ett response."),
    q("Servern är avstängd och går inte att nå. Vad skiljer det från HTTP 404?", "fetch kan avvisas med nätverksfel utan något HTTP-response", "fetch ger alltid ett Response med status 404", "Requesten lyckas med en tom lista", "404 är ett faktiskt HTTP-svar från en server. Ett nätverksfel kan inträffa innan något response finns.")
  ],
  "server-p2": [
    q("Vilken request skapar produkten Penna med pris 15?", "POST /api/products med JSON-body { title: 'Penna', price: 15 }", "GET /api/users med status 201 i request body", "POST /api/products med price: '15' som text", "Metoden är POST, URL:en pekar på produkter och priset skickas som ett JSON-tal."),
    q("Vad är lika jämfört med POST /api/users med JSON?", "Metoden POST och Content-Type: application/json", "Sökvägen och alla body-fält", "Serverns statuskod är en request-header", "Resursens adress och datafält ändras. Metod och innehållstyp kan vara samma.")
  ],
  "server-p3": [
    q("Vilka statuskoder passar ogiltig användardata respektive oväntat internt serverfel?", "400 respektive 500", "500 respektive 400", "200 respektive 201", "400 beskriver en felaktig request. 500 beskriver ett oväntat internt serverfel."),
    q("Vad är response.ok för status 400 och 500?", "false för båda", "true för 400, false för 500", "true för båda om body är JSON", "ok är true för status 200–299. JSON-formatet ändrar inte det.")
  ],
  "server-p4": [
    q("Vilken kedja visar produkter efter klick på Ladda produkter?", "Klick → GET /api/products → serverns JSON → läs JSON → setProducts → rendera id/title", "Klick → serverns c.json ändrar React-state direkt", "Klick → setProducts utan att läsa svaret → servern renderar listan", "Klienten måste läsa svaret och uppdatera sitt eget state innan React visar de nya produkterna."),
    q("Servern ger 200 med []. Hur ska det skiljas från ett HTTP-fel?", "Visa en tom lista eller en tom-vy; response.ok är true", "Behandla alltid [] som status 404", "JSON-läsningen kastar fel eftersom listan är tom", "En tom array är giltig data. Kontrollera response.ok för HTTP-fel och listans längd för tom-vyn.")
  ]
};
