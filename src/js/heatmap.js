
export function toPlotly(data, metadata, supplementalData) {
  let headers = [...data[metadata['attrs']['column-header-index']]]
  const columnHeaders = headers.slice(metadata['attrs']['row-header-size'])
  headers = data.map(row => {
    return row[metadata['attrs']['row-header-index']]
  })
  const rowHeaders = headers.slice(metadata['attrs']['column-header-size'])
  const dataValues = data.slice(metadata['attrs']['column-header-size']).map(row => {
    return row.slice(metadata['attrs']['row-header-size'])
  })
  // const transposedDataValues = transpose(dataValues)

  if (metadata?.attrs?.logScale) {
    dataValues.forEach(r => {
      r.forEach((c, j) => {
        r[j] = Math.log10(c)
      })
    })
  }


  const plotly_data = [
    {
      x: columnHeaders,
      y: rowHeaders,
      z: dataValues,
      type: 'heatmap'
    }
  ]

  const plotly_layout = {}
  const plotly_options = {}
  return {plotly_data, plotly_layout, plotly_options}
}
export function applyFilter(plotly_data, filter) {
  const plot_data = plotly_data.value[0]

  let x_indexes = findIndexes(filter.x, plot_data.x)
  let y_indexes = findIndexes(filter.y, plot_data.y)

  let working_data = []
  plot_data.z.forEach(row => {
    working_data.push([...row])
  })

  let z_filtered = []
  y_indexes.forEach(row => {
    const y_filtered = working_data[row]
    let x_filtered = []
    x_indexes.forEach(col => {
      x_filtered.push(y_filtered[col])
    })

    z_filtered.push(x_filtered)
  })

  return [
    {
      x: filter.x.length ? filter.x : plot_data.x,
      y: filter.y.length ? filter.y : plot_data.y,
      z: z_filtered,
      type: 'heatmap'
    }
  ]
}

function findIndexes(filter, all_elements) {
  let indexes = []
  if (filter.length > 0) {
    filter.forEach(item => {
      indexes.push(all_elements.indexOf(item))
    })
  } else {
    indexes = [...Array(all_elements.length).keys()]
  }

  return indexes
}

export function extractTitles(plotly_data, titles) {
  function validTitle(t) {
    return !!t
  }

  // Assign to inner Arrays so as not to break reactivity.
  titles.value.x = plotly_data.value[0].x.filter(validTitle)
  titles.value.y = plotly_data.value[0].y.filter(validTitle)
}
