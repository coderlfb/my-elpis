<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>{{ name }}</title>
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.png" rel="icon" type="image/x-icon" />
  <script defer src="http://127.0.0.1:9002/public/dist/dev/js/runtime~entry.page1_c563a068.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/vendor_9a6d2f74.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/entry.page1_b60617ad.js"></script></head>
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
