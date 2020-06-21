import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://ctt-daotao.hust.edu.vn/" target="_blank" rel="noopener noreferrer">HUST</a>
        <span className="ml-1">&copy; {(new Date()).getFullYear()} HaNoi University of Science and Technology</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a href="https://www.facebook.com/hiep.lai.1997/" target="_blank" rel="noopener noreferrer">Lãng tử đa tình</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
