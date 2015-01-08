var Logout = React.createClass({displayName: 'Logout',
  render: function() {
    return (
      React.createElement("form", {acceptCharset: "utf8", action: "/users/sign_out", method: "DELETE"}, 
        React.createElement("input", {type: "submit", name: "Log Out"})
      )
    )
  }
})