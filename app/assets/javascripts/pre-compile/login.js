var Login = React.createClass({
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
      <div id='login-portal'>
        <LoginForm newUser={this.state.newUser} token={this.props.token} properLength={this.properLength} />
        <input type='button' name='new-user' onClick={this.userRegistration} value='new user'></input>
      </div>
    )
  }
})

var LoginForm = React.createClass({
  render: function() {
    var attrs = this.props.newUser ? { method: "POST", action: "/users" } : { method: "POST", action: "/users/sign_in" };
    return (
      <form {...attrs} acceptCharset="UTF-8" >
        <div style={{display: "none"}}>
          <input name='utf8' type='hidden' value='✓'></input>
          <input name="authenticity_token" value={this.props.token} type="hidden"></input>
        </div>
        <UserName {...this.props} />
        <PassWord {...this.props} />
        <input type='submit' name='commit' value='Log In'></input>
      </form>
    )
  }
})

var UserName = React.createClass({
  render: function() {
    return (
      <input autofocus='autofocus' name='user[email]' type='email'></input>
    )
  }
})

var PassWord = React.createClass({
  isLength: function(e) {
    var pass = e.target.value;
  },

  render: function() {
    var passwordConfirmation = this.props.newUser ? <input autoComplete="off" type="password" name="user[password_confirmation]"></input> : ""
    return (
      <div>
        <input name='user[password]' type='password' onChange={this.isLength} placeholder='password'></input>
        <br />
        {passwordConfirmation}
      </div>
    )
  }
})

var LoginError = React.createClass({
  render: function() {
    return (
      <div id='error'>
      </div>
    )
  }
})

var renderLogin = function() {
  var csrfTag = document.getElementsByName("csrf-token")[0];
  var authToken = csrfTag.attributes.content.value;
  React.render(
    <Login token={authToken} />,
    document.getElementById("user-detail")
  )
}

