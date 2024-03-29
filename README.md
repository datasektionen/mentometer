Efter att resultatet till en omröstning blivit nästan bara blanka röster - ett resultat som inte så många trodde var korrekt, försvann allt tillit till mentometer och systemet användes därefter inte mer. 🪦

# Mentometer - Sektionens voteringssystem
[![Build](https://github.com/datasektionen/mentometer/actions/workflows/test.yml/badge.svg)](https://github.com/datasektionen/mentometer/actions/workflows/test.yml)

## Deploying
Systemet kan deployas automatiskt via Github Actions. Navigera till "Deploy"-action:en och klicka på "Run workflow".
## Om Mentometer
Mentometer byggdes av Jonas Dahl i oktober 2017 "på ett SM och en pub". Systemet byggdes efter att sektionen vid Val-SM 2017 beslutade sig att bordlägga ett ärende gällande att köpa in fysiska mentometrar.

Systemet låter avprickade sektionsmedlemmar rösta i frågor som ställs av administratörerna. Administratör är den som är medlem i gruppen ```mentometer.admin``` i [Pls](https://pls.datasektionen.se), förslagsvis Drektoratet. 

# Systemets uppbyggnad

Mentometer är skrivet i Node.js för backend och React för frontend.

Servern är både en Node.js-Express-server och en Socket.io-server (websockets). ```index.js``` servar båda dessa. Express-servern servar i stort sett bara React-frontenden. Denna frontend ansluter endast med websockets till servern.

I ```socketAuth``` finns en funktion för att verifiera en användare mot login2 vid första anslutningen till websocketen.

## Databasen
Det enda som sparas i databasen är användare och loggar. Användare sparas för att kunna komma ihåg närvaro vid en eventuell krash och slippa förlita sig på att hålla allt i minnet. Samma sak gäller för loggarna. Log och User definieras i ```models.js```.

## API endpoints
Mentometer har inga API-endpoints för HTTP.

Dokumentation för socketkommunikationen finns [här](API.md)

## Dependencies
### Sektionens system
- **Login2** - för inloggning med KTH-konto.
- **Pls** - för att kolla om användaren har adminrättigheter.

### Annan mjukvara
För att köra Mentometer krävs [Node](https://nodejs.org/en/) och [npm](https://www.npmjs.com/get-npm). Börja med att installera det.

# Så här kör du Mentometer
## Environment tables

Du behöver dessa environmentvariabler (förslagsvis i en .env-fil) innan du kan köra mentometer.

~~En login2-nyckel fås av systemansvarig (d-sys@d.kth.se)~~

| Variabel              | Beskrivning                           | Exempel                                               | Default-värde |
|-----------------------|---------------------------------------|-------------------------------------------------------|---------------|
| LOGIN2_API_URL   | URL till login2                       | https://login.datasektionen.se                             | -             |
| LOGIN2_API_KEY   | Login2 api-nyckel                     | ~~En token som fås av [systemansvarig](mailto:d-sys@d.kth.se)~~ | -             |
| MONGO_URL        | URL till mongodatabasen               | mongodb://localhost:27017/mentometer                       | -             |
| PLS_API_URL      | URL till pls                          | https://pls.datasektionen.se/api                           | -             |
| REACT_APP_WS_URL | URLen till servern för att förenkla vid utveckling. Om den lämnas tom kommer frontenden försöka ansluta till samma URL som den hostas på, vilket funkar i de fall frontend och backend ligger på samma URL och port.    | http://localhost:8080               | -             |
| REACT_APP_THEME_COLOR | Standardfärgtemat från Aurora    | red                                                        | red           |
| PORT             | Port som servern körs på              | 8080                                                       | 8080          |


## Testning/lokalt
### Server

1. Kör `npm install` för att installera alla dependencies.
2. Kör `npm run dev:server` för att starta servern på port 8080 (om inget annan anges)

Detta kör endast servern.

### Klient

1. Kör `npm install` för att installera alla dependencies.
2. Kör `npm run dev:client` för att starta front end på port 3000 (om inget annat anges)

Detta kör frontenden.

## Produktion

1. Kör `npm install` för att installera alla dependencies.
2. Kör `npm run build` för att bygga frontenden som hamnar i ```build```-mappen
3. Kör `npm start` så startar servern på port 8080, om ingen annan port är angiven.

Programmet servar då frontenden från build-mappen till alla GET-requests. Samtidigt lyssnar den efter websocketanslutningar från klienterna och svarar dem därefter.
