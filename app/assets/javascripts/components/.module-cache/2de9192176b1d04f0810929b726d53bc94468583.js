var Account = React.createClass({displayName: 'Account',
  render: function() {
    return (
      React.createElement("div", {id: "user"}, 
        React.createElement(Logout, {token: this.props.token})
      )
    )
  }
})

var Logout = React.createClass({displayName: 'Logout',
  render: function() {
    return (
      React.createElement("form", {acceptCharset: "UTF-8", action: "/users/sign_out", method: "delete"}, 
        React.createElement("div", {style: {display: "none"}}, 
          React.createElement("input", {name: "utf8", type: "hidden", value: "✓"}), 
          React.createElement("input", {name: "authenticity_token", value: this.props.token, type: "hidden"})
        ), 
        React.createElement("input", {type: "submit", value: "logout", name: "Log Out"})
      )
    )
  }
})

var renderAccount = function() {
  var csrfTag = document.getElementsByName("csrf-token")[0];
  var authToken = csrfTag.attributes.content.value;
  React.render(
    React.createElement(Account, {token: token}),
    document.getElementById("user-detail")
  )
}