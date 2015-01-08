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
      React.createElement("div", {id: "login-portal"}, 
        React.createElement("form", {name: "login"}, 
          React.createElement(UserName, null), 
          React.createElement(PassWord, null)
        )
      )
    )
  }
})

var UserName = React.createClass({displayName: 'UserName',
  render: function() {
    return (
      React.createElement("input", {name: "username", type: "text"})
    )
  }
})

var PassWord = React.createClass({displayName: 'PassWord',
  render: function() {
    return (
      React.createElement("input", {type: "password", placeholder: "password"})
    )
  }
})

var renderForm = function() {
  React.render(
    React.createElement(Login, null),
    document.body
  )
}