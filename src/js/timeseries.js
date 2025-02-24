import {transpose} from './common'

function determineYAxesColumns(data, metadata) {
  if (metadata['attrs']['y-axes-columns'].length === 0) {
    let yCols = [...Array(data[0].length).keys()] // count up to number of coloumns
    yCols.splice(metadata['attrs']['x-axis-column'], 1)
    metadata['attrs']['y-axes-columns'] = yCols
  }
}

export function toPlotly(data, metadata, supplementalData) {
  // console.log('Timeseries to plotly:')
  // console.log(data)
  // console.log('metadata in:')
  // console.log(metadata)
  // Need data in row major format for this part.
  const xAxisLabel = data[0][metadata['attrs']['x-axis-column']]
  let traceNames = []
  if (!metadata['attrs']['no-header']) {
    traceNames = data[0]
    data = data.slice(1)
  } else if (supplementalData && supplementalData['header-info']) {
    traceNames = supplementalData['header-info'][0]
  }

  determineYAxesColumns(data, metadata)

  // Need data in column major format for this part.
  const transposedData = transpose(data)
  const xAxis = transposedData[metadata['attrs']['x-axis-column']]
  // console.log('Post transpose.')
  // console.log(data)
  // console.log(traceNames)
  // console.log(metadata['attrs']['y-axes-columns'])
  let plotly_data = []
  for (let col of metadata['attrs']['y-axes-columns']) {
    plotly_data.push({
      x: xAxis,
      y: transposedData[col],
      name: traceNames[col],
      mode: 'lines'
    })
  }

  const plotly_layout = {
    xaxis: {
      title: {
        text: xAxisLabel
      }
    }
  }

  const plotly_options = {}

  return {plotly_data, plotly_layout, plotly_options}
}

export function applyFilter(plotly_data, filter) {
  plotly_data.value.forEach(element => {
    element.visible = filter.x.length == 0 || filter.x.includes(element.name)
  })

  return undefined
}

export function extractTitles(plotly_data, titles) {
  let new_titles = {x: [], y: []}
  plotly_data.value.forEach(element => {
    if (element.name) {
      new_titles.x.push(element.name)
    }
  })
  // Assign to inner Arrays so as not to break reactivity.
  titles.value.x = new_titles.x
  titles.value.y = new_titles.y
}
