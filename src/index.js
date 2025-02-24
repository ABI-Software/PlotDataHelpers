import Papa from 'papaparse'

import {inflateMetadata} from './js/common'
import {toPlotly as toTimeseriesPlotly, applyFilter as applyTimeseriesFilter, extractTitles as extractTimeseriesTitles} from './js/timeseries'
import {toPlotly as toHeatmapPlotly, applyFilter as applyHeatmapFilter, extractTitles as extractHeatmapTitles} from './js/heatmap'

const KNOWN_VERSIONS = ['1.2.0', '1.1.0']
const KNOWN_PLOT_TYPES = ['timeseries', 'heatmap']

function isValidMetadataVersion(metadata) {
  return metadata.version && KNOWN_VERSIONS.includes(metadata.version)
}

function isValidMetadataPlot(metadata) {
  return metadata.type && metadata.type === 'plot' && metadata.attrs && KNOWN_PLOT_TYPES.includes(metadata.attrs.style)
}

function isValidPlotMetaData(metadata) {
  return isValidMetadataVersion(metadata) && isValidMetadataPlot(metadata)
}

function makeTitle(source_uri) {
  const filename = source_uri.split('\\').pop().split('/').pop()
  return filename.split('.')[0]
}

export function convertToPlotlyData(source_uri, metadata, supplemental_data, plotly_data, plotly_layout, plotly_options, error_handler = undefined) {
  let retrievedSupplementalData = {}

  function dataError(error) {
    if (error_handler) {
      error_handler(error)
    } else {
      console.log(`Encountered this error => ${error}`)
    }
  }

  function dataReady(retrievedContent) {
    const full_metadata = inflateMetadata(metadata)
    if (isValidPlotMetaData(full_metadata)) {
      let output = {}
      switch (full_metadata.attrs.style) {
        case KNOWN_PLOT_TYPES[0]:
          output = toTimeseriesPlotly(retrievedContent.data, full_metadata, retrievedSupplementalData)
          break
        case KNOWN_PLOT_TYPES[1]:
          output = toHeatmapPlotly(retrievedContent.data, full_metadata, retrievedSupplementalData)
          break
      }

      if (output) {
        plotly_data.value = output.plotly_data
        plotly_layout.value = {showlegend: true, title: {text: makeTitle(source_uri)}, ...output.plotly_layout}
        plotly_options.value = output.plotly_options
      }
    }
  }

  function headerDataReady(retrievedContent) {
    retrievedSupplementalData['header-info'] = retrievedContent.data
    Papa.parse(source_uri, {download: true, complete: dataReady, error: dataError})
  }

  if (source_uri) {
    const supplementalDataArray = supplemental_data
    if (supplementalDataArray && supplementalDataArray.length > 0 && supplementalDataArray[0].uri) {
      Papa.parse(supplementalDataArray[0].uri, {download: true, complete: headerDataReady, error: dataError})
    } else {
      Papa.parse(source_uri, {download: true, complete: dataReady, error: dataError})
    }
  }
}

export function applyFilter(plotly_data, metadata, filter) {
  const full_metadata = inflateMetadata(metadata)
  let filtered_plot_data = undefined
  if (isValidPlotMetaData(full_metadata)) {
    switch (full_metadata.attrs.style) {
      case KNOWN_PLOT_TYPES[0]:
        filtered_plot_data = applyTimeseriesFilter(plotly_data, filter)
        break
      case KNOWN_PLOT_TYPES[1]:
        filtered_plot_data = applyHeatmapFilter(plotly_data, filter)
        break
    }
  }

  return filtered_plot_data
}

export function extractTitles(plotly_data, metadata, titles) {
  const full_metadata = inflateMetadata(metadata)
  if (isValidPlotMetaData(full_metadata)) {
    switch (full_metadata.attrs.style) {
      case KNOWN_PLOT_TYPES[0]:
        extractTimeseriesTitles(plotly_data, titles)
        break
      case KNOWN_PLOT_TYPES[1]:
        extractHeatmapTitles(plotly_data, titles)
        break
    }
  }
}
