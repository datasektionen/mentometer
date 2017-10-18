# Mentometer

Mentometer är systemet som låter avprickade sektionsmedlemmar rösta i frågor som ställs av administratörerna. Administratör är den som är medlem i gruppen ```mentometer.admin``` i Pls, förslagsvis Drektoratet.

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

