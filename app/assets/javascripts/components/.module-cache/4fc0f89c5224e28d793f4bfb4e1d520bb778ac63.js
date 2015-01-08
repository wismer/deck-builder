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

var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    return (
      React.createElement("form", {name: "login"})
    )
  }
})