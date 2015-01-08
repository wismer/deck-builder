var Login = React.createClass({displayName: 'Login',
  getInitialState: function() {
    return { showErrors: false };
  },

  properLength: function() {

  },

  render: function() {
    var errors = this.state.showErrors ? React.createElement(LoginError, null) : "";
    return (
      React.createElement("div", {id: "login-portal"}, 
        React.createElement(LoginForm, {properLength: this.properLength}), 
        errors
      )
    )
  }
})

var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    return (
      React.createElement("form", {name: "login"}, 
        React.createElement(UserName, React.__spread({},  this.props)), 
        React.createElement(PassWord, React.__spread({},  this.props)), 
        React.createElement("input", {type: "button", name: "login", value: "login"})
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
      this.props.properLength();
    }
  },

  render: function() {
    return (
      React.createElement("input", {type: "password", onChange: this.isLength, placeholder: "password"})
    )
  }
})

var renderForm = function() {
  React.render(
    React.createElement(Login, null),
    document.body
  )
}

