var Login = React.createClass({displayName: 'Login',
  getInitialState: function() {
    return {
      length: { password: false, username: false },
      invalid: { password: false, username: false }
    }
  },

  properLength: function(errorType, fieldType) {
  },

  render: function() {
    return (
      React.createElement("div", {id: "login-portal"}, 
        React.createElement(LoginForm, {properLength: this.properLength})
      )
    )
  }
})

var LoginForm = React.createClass({displayName: 'LoginForm',
  submitLogin: function(e) {
    
  },

  render: function() {
    return (
      React.createElement("form", {name: "login", ref: "formSubmit"}, 
        React.createElement(UserName, React.__spread({},  this.props)), 
        React.createElement(PassWord, React.__spread({},  this.props)), 
        React.createElement("input", {onClick: this.submitLogin, type: "button", name: "login", value: "login"})
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

    if (pass.length < 8) {
      this.props.properLength("length", "password");
    }
  },

  render: function() {
    return (
      React.createElement("input", {type: "password", onChange: this.isLength, placeholder: "password"})
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

