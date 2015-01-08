var Logout = React.createClass({displayName: 'Logout',
  render: function() {
    return (
      React.createElement("form", {acceptCharset: "utf8", action: "/users/sign_out", method: "DELETE"}, 
        React.createElement("input", {type: "logout", name: "Log Out"})
      )
    )
  }
})

var renderLogout = function() {
  React.render(
    React.createElement(Logout, null),
    document.getElementById("logout")
  )
}