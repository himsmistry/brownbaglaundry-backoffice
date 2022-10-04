import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CSubheader,
  CToggler,
  CBreadcrumbRouter
} from '@coreui/react'
//import CIcon from '@coreui/icons-react'

// routes config
import routes from '../routes'
import Profile from './Profile'

const TheHeader = () => {
  const dispatch = useDispatch()
  //const asideShow = useSelector(state => state.asideShow)
  //const darkMode = useSelector(state => state.darkMode)
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        {/*<CIcon name="logo" height="48" alt="Logo"/>*/}
        <span className="res_logo">Brown Bag Laundry</span>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          {/*<CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>*/}
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        {/*<CToggler
          inHeader
          //className="ml-3 d-md-down-none"
          className="ml-3"
          onClick={() => dispatch({type: 'set', darkMode: !darkMode})}
          title="Toggle Light/Dark Mode"
        >
          <CIcon name="cil-moon" className="c-d-dark-none" alt="Brown Bag Laundry Icons Moon" />
          <CIcon name="cil-sun" className="c-d-default-none" alt="Brown Bag Laundry Icons Sun" />
        </CToggler>*/}
        <Profile />
        {/*<CToggler
          inHeader
          className="d-md-down-none"
          onClick={() => dispatch({type: 'set', asideShow: !asideShow})}
        >
          <CIcon className="mr-2" size="lg" name="cil-applications-settings" />
        </CToggler>*/}
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
