import React, { Component } from 'react'

class view extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showLoader: false,
         data: []
      };
   }

   componentDidMount() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/android/i.test(userAgent)) {
         window.location.href =
            'https://play.google.com/store/apps/details?id=com.BrownBagLaundry.lalaapp';
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
         window.location.href =
            'https://apps.apple.com/us/app/la-la-laundry-app/id1542307106';
      } else {
         window.location.href =
            'https://play.google.com/store/apps/details?id=com.BrownBagLaundry.lalaapp';
      }
   }


   render() {
      return (
         <div>

         </div>
      )
   }
}

export default view
