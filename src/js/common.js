export function inflateMetadata(metadata) {
  const defaultAttrs = {
    'x-axis-column': 0,
    'y-axes-columns': [],
    'no-header': false,
    'row-major': false,
    'row-header-size': 1,
    'row-header-index': 0,
    'column-header-size': 1,
    'column-header-index': 0
  }
  metadata.attrs = {...defaultAttrs, ...metadata.attrs}

  return metadata
}

export function transpose(matrix) {
  return matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
);
  // for (var i = 0; i < matrix.length; i++) {
  //   for (var j = 0; j < i; j++) {
  //     ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
  //   }
  // }
}
