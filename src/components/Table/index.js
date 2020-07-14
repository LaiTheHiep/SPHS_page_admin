import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './table.css';

export default function Table({ refs, ...rest }) {
  return (
    <ReactTable
      previousText="Previous Page"
      nextText="Next Page"
      loadingText="Loading..."
      noDataText="Data empty"
      pageText="Page"
      ofText="of"
      rowsText="rows"
      // Accessibility Labels
      pageJumpText="Jump to page"
      rowsSelectorText="Rows in line"
      //Genera
      pageSizeOptions={[25, 50, 100, 200]}
      defaultPageSize={25}
      minRows={1}
      className="react-table-custom"
      ref={refs}
      {...rest}
    />
  );
}
