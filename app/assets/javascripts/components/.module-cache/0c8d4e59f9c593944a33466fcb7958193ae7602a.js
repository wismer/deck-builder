var Account = React.createClass({displayName: 'Account',
  render: function() {
    return (
      React.createElement("div", {id: "user"}, 
        React.createElement(Logout, null)
      )
    )
  }
})

var Logout = React.createClass({displayName: 'Logout',
  render: function() {
    return (
      React.createElement("form", {acceptCharset: "utf8", action: "/users/sign_out", method: "DELETE"}, 
        React.createElement("input", {type: "button", name: "Log Out"})
      )
    )
  }
})

var renderAccount = function() {
  React.render(
    React.createElement(Account, null),
    document.getElementById("user-detail")
  )
}