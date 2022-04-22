import React,{Component} from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {reactLocalStorage} from 'reactjs-localstorage';
import configuration from '../config';
var jwt = require('jsonwebtoken');

class TheHeaderDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile_picture:'avatars/5.jpg',
            name:''
        };
    }

    componentDidMount(){
        let that = this;
        var token = reactLocalStorage.get('token');
        jwt.verify(token, configuration.appName , function (err, decoded){
            if (err){
                decoded = null;
                window.location.href = '/#/login'
            }
            if(decoded){
                that.setState({profile_picture: decoded.profile_picture, name:decoded.name, })
            }
        });
    }

    logout(){
        reactLocalStorage.set('token', ' ');
        reactLocalStorage.set('user_id', ' ');
        window.location.href = '/#/login';
    }

    editProfile(){
        window.location.href = '/#/user/edit/'+reactLocalStorage.get('user_id');
    }

    render() {
        return (
            <CDropdown
              inNav
              className="c-header-nav-items mx-2"
              direction="down"
            >
              <CDropdownToggle className="c-header-nav-link" caret={false}>
                <p className="profile-name">{this.state.name}</p>
                <div className="c-avatar">
                  <CImg
                    src={this.state.profile_picture}
                    className="c-avatar-img"
                    alt="admin@bootstrapmaster.com"
                  />
                </div>
              </CDropdownToggle>
              <CDropdownMenu className="pt-0" placement="bottom-end">
                {/*<CDropdownItem
                  header
                  tag="div"
                  color="light"
                  className="text-center"
                >
                  <strong>Account</strong>
                </CDropdownItem>*/}
                <CDropdownItem onClick={ this.editProfile.bind(this) }>
                  <CIcon name="cil-user" className="mfe-2"/> 
                  Profile
                </CDropdownItem>
                <CDropdownItem onClick={ this.logout.bind(this) }>
                  <CIcon name="cil-lock-locked" className="mfe-2" /> 
                  Logout
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
        )
    }
}

export default TheHeaderDropdown
