var Account = React.createClass({displayName: 'Account',
  render: function() {
    return (
      React.createElement("form", {acceptCharset: "utf8", action: "/users/sign_out", method: "DELETE"}, 
        React.createElement("input", {type: "logout", name: "Log Out"})
      )
    )
  }
})

var renderAccount = (function() {
  React.render(
    React.createElement(Account, null),
    document.getElementById("user-account")
  )
})()