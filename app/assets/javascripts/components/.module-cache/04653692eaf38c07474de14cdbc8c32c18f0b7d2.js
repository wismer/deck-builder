var Login = React.createClass({displayName: 'Login',
  render: function() {
    return (
      React.createElement(LoginForm, null, 
        React.createElement(UserName, null), 
        React.createElement(PassWord, null)
      )
    )
  }
})