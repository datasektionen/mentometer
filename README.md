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
