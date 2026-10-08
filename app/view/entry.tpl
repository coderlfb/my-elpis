<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>{{ name }}</title>
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.png" rel="icon" type="image/x-icon" />
  </head>
  <body style="margin: 0">
    <div id="root"></div>
    <input id="env" value="{{ env }}" style="display: none" />
    <input id="options" value="{{ options }}" style="display: none" />
  </body>
  <script type="text/javascript">
    try {
      window.env = document.getElementById("env").value;
      window.options = JSON.parse(document.getElementById("options").value);
    } catch (error) {
      console.log(error);
    }
  </script>
</html>
