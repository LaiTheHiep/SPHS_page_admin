import React from 'react';

class User extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return(
      <div>
        <h1>Hello world!</h1>
        <h4>User</h4>
      </div>
    );
  }
}

export default User;