var Login = React.createClass({displayName: 'Login',
  getInitialState: function() {
    return { hasErrors: false, newUser: false };
  },

  properLength: function(errorType, fieldType) {

  },

  render: function() {
    return (
      React.createElement("div", {id: "login-portal"}, 
        React.createElement(LoginForm, {newUser: this.state.newUser, properLength: this.properLength})
      )
    )
  }
})
var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    // var formType = this.props.newUser ? 
    return (
      React.createElement("form", {name: "login", action: "/users", method: "POST", ref: "formSubmit", onSubmit: this.submitLogin}, 
        React.createElement(UserName, React.__spread({},  this.props)), 
        React.createElement(PassWord, React.__spread({},  this.props)), 
        React.createElement("input", {type: "submit", name: "login", value: "login"})
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
  isLength: function(e) {
    var pass = e.target.value;
    this.is
  },

  render: function() {
    return (
      React.createElement("input", {name: "password", type: "password", onChange: this.isLength, placeholder: "password"})
    )
  }
})

var LoginError = React.createClass({displayName: 'LoginError',
  render: function() {
    return (
      React.createElement("div", {id: "error"}, 
        errors
      )
    )
  }
})

var renderForm = function() {
  React.render(
    React.createElement(Login, null),
    document.body
  )
}

