import React from 'react';

class Template extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return(
      <div>
        <h1>Hello world!</h1>
        <h4>Template</h4>
      </div>
    );
  }
}

export default Template;