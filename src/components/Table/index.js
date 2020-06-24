import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './table.css';

export default function Table({ refs, ...rest }) {
  return (
    <ReactTable
      previousText="Trang trước"
      nextText="Trang tiếp theo"
      loadingText="Đang tải dữ liệu..."
      noDataText="Không có dữ liệu nào được tìm thấy"
      pageText="Trang"
      ofText="của"
      rowsText="Hàng"
      // Accessibility Labels
      pageJumpText="Nhảy tới trang"
      rowsSelectorText="Số hàng mỗi trang"
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
