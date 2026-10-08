<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>{{ name }}</title>
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.png" rel="icon" type="image/x-icon" />
  <script defer src="http://127.0.0.1:9002/public/dist/dev/js/runtime~entry.page2_47d5b3a2.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/vendor_65eacd8d.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/common_aab6e5f1.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/entry.page2_4ccb4a6e.js"></script></head>
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
