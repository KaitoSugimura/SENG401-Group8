import React from 'react'


class KeyboardControls extends React.Component {
    handleKeyDown(event) {
        console.log('W key was pressed!');
      if (event.keyCode === 87) {
      }
    }
  
    render() {
      return (
        <div onKeyDown={this.handleKeyDown} tabIndex="0">
          Use W key to perform some action
        </div>
      );
    }
  }
  
  export default KeyboardControls;