# Overview
This repo contains implementation for Weather widget component exposed for remote usage in React Module Federation setup.
The UI is built using [Material UI](https://mui.com/material-ui/getting-started/).

# Main Features
* Provides Weather Widget component available in three sizes: small, medium and large
* Allows automatic current location detection based on [Browser's Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), if it is available and allowed, otherwise falls back to IP based geo-location using [GeoJS](https://www.geojs.io/)
* Use open apis for fetching weather and location information such as [open-meteo.com](https://open-meteo.com) and [bigdatacloud.net](https://www.bigdatacloud.com/)

# NPM Tasks
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.


### `npm test`

Launches unit tests

### `npm lint`

Launches eslint check