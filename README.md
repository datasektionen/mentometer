# Mentometer

Mentometer är systemet som låter avprickade sektionsmedlemmar rösta i frågor som ställs av administratörerna. Administratör är den som är medlem i gruppen ```mentometer.admin``` i Pls, förslagsvis Drektoratet. Systemet är skrivet i Node.js för backend och React för frontend.

## Miljövariabler

Följande variabler läggs förslagsvis i en .env-fil innan start av server och klient.

```
LOGIN2_API_KEY=<YOUR_KEY_TO_LOGIN2>
LOGIN2_API_URL=https://login2.datasektionen.se
PLS_API_URL=http://pls.datasektionen.se/api
MONGO_URL=mongodb://<HOST>/<DB_NAME>
REACT_APP_THEME_COLOR=red
REACT_APP_WS_URL=http://localhost:8080
```

The ```REACT_APP_THEME_COLOR``` is the default Aurora color (defaults to red) and the ```REACT_APP_WS_URL``` is the URL to the server.

## Körning

Klona detta repo, och kör sedan

```
npm install
```

Alla beroenden installeras då, och frontenden byggs och placeras i build-mappen i root. Du kan sedan köra servern med

```
npm start
```
Programmet servar då frontenden från build-mappen till alla GET-requests. Samtidigt lyssnar den efter websocketanslutningar från klienterna och svarar dem därefter.

### Utveckling

För att förenkla utveckling (av framför allt frontend) så bör istället dev-scriptet användas. Installera fortfarande med ```npm install```, men kör sedan

```
npm run dev
```

för att köra watch-builds av frontenden. Du måste fortfarande köra ```npm start``` för att ha servern på i bakgrunden, så att du kan använda frontenden.

## Systemets uppbyggnad

Servern är både en Node.js-Express-server och en Socket.io-server (websockets). ```index.js``` servar båda dessa. Express-servern servar i stort sett bara React-frontenden. Denna frontend ansluter endast med websockets till servern.

### Databas

Det enda som sparas i databasen är användare och loggar. Användare sparas för att kunna komma ihåg närvaro vid en eventuell krash och slippa förlita sig på att hålla allt i minnet. Samma sak gäller för loggarna. Log och User definieras i ```models.js```. I ```socketAuth``` finns en funktion för att verifiera en användare mot login2 vid första anslutningen till websocketen.
