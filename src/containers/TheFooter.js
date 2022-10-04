import React from 'react'
import { CFooter, CLink } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <CLink>
          © {new Date().getFullYear()} Brown Bag Laundry
        </CLink>
      </div>
      {/*<div className="ml-auto">
        <span className="mr-1">Right text</span>
      </div>*/}
    </CFooter>
  )
}

export default React.memo(TheFooter)
