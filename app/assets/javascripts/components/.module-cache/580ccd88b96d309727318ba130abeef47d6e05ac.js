var Login = React.createClass({displayName: 'Login',
  getInitialState: function() {
    return { hasErrors: false, newUser: false };
  },

  properLength: function(errorType, fieldType) {

  },

  userRegistration: function() {
    this.setState({ newUser: !this.state.newUser });
  },

  render: function() {
    return (
      React.createElement("div", {id: "login-portal"}, 
        React.createElement(LoginForm, {newUser: this.state.newUser, token: this.props.authToken, properLength: this.properLength}), 
        React.createElement("input", {type: "button", name: "new-user", onClick: this.userRegistration})
      )
    )
  }
})
var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    // var attrs = this.props.newUser ? { method: "POST", action: "/users" } : { method: "GET", action: "/users/sign_in" };
    return (
      React.createElement("form", {'accept-charset': "UTF-8"}, 
        React.createElement("div", {style: "display: none;"}, 
          React.createElement("input", {name: "utf8", type: "hidden", value: "✓"}), 
          React.createElement("input", {name: "authenticity_token", value: this.props.token, type: "hidden"})
        ), 
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
      React.createElement("div", {id: "error"}
      )
    )
  }
})

var renderForm = function() {
  var csrfTag = document.getElementsByName("csrf-token")[0];
  var authToken = csrfTag.attributes.content.toString();
  React.render(
    React.createElement(Login, {token: authToken}),
    document.body
  )
}

