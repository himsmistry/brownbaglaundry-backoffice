import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
} from '@coreui/react'
//import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  return (
    <CSidebar
      show={show}
      unfoldable
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/dashboard" style={{ background: '#966033', textDecoration: 'none', fontSize: '22px' }}>
        <CImg
          src={'logo.png'}
          className="c-avatar-img cus_logo"
          alt="admin@bootstrapmaster.com"
        />
        {/*<span> Brown Bag Laundry</span>*/}
        {/*<CIcon
               className="c-sidebar-brand-full"
               name="logo-negative"
               height={35}
          />
          <CIcon
               className="c-sidebar-brand-minimized"
               name="sygnet"
               height={35}
          />*/}
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />

      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
