# Plot Data Helpers

[![npm version](https://badge.fury.io/js/%40abi-software%2Fplotdatahelpers.svg)](https://badge.fury.io/js/%40abi-software%2Fplotdatahelpers)

This project is for providing helper functions to transform data into a form consumable by the plotly.js library.
This project makes use of the [papaparse](https://www.papaparse.com/) package to read de-limited data files from resources available on the web.
It is designed to take metadata information gathered from [SCICRUNCH](https://sparc.science/tools-and-resources/ncnLaJM7nMt053Zjv9XHy) and use this information to duplicate a figure from a [SPARC](https://sparc.science) dataset.
This package can format de-limited data into scatter plots or heatmap plots.

## Project installation
```
npm i @abi-software/plotdatahelpers
```

### Compiles and minifies for production
```
npm run build-package
```

## How to use
Include the package in your script.
```javascript
import { applyFilter, extractTitles, convertToPlotlyData } from '@abi-software/plotdatahelpers'
```
