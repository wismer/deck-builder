var Account = React.createClass({
  render: function() {
    return (
      <div id='user'>
        <Logout token={this.props.token} />
      </div>
    )
  }
})

var Logout = React.createClass({
  render: function() {
    return (
      <form acceptCharset="UTF-8" action="/users/sign_out" method="POST">
        <div style={{display: "none"}}>
          <input name='utf8' type='hidden' value='✓'></input>
          <input name="authenticity_token" value={this.props.token} type="hidden"></input>
        </div>
        <button type="submit"></button>
      </form>
    )
  }
})

var renderAccount = function() {
  var csrfTag = document.getElementsByName("csrf-token")[0];
  var authToken = csrfTag.attributes.content.value;
  React.render(
    <Account token={authToken} />,
    document.getElementById("user-detail")
  )
}