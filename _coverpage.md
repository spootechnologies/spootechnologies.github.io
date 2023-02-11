<!-- _coverpage.md -->

<div style="height:100px"></div>

<img src="assets/img/shuttlecarrier.png" style="width: 250px;max-width:100%;">
<br>SPOO - <b><u>S</u>INGLE <u>P</u>OINT <u>O</u>F <u>O</u>BJECT</b><br>
<span style="font-size: 50px;color:#b14aad">Build your own Platform
</span>
<br>


<span style="font-size:20px">
<b>With <a href="https://objy.xyz" target="_blank"><img src="https://objy.xyz/logo.png" style="height:25px;margin-bottom:-7px">OBJY</a> ("Everything is an object"), Built-in Multitenancy, Authorization, Messaging, User handling and more</b>
</span>
<br><br>
<br>


<div>
	<div style="display: inline-block;">
		<pre style="border-radius: 10px;background:#232323;text-align: left;padding: 20px;">
          	<code class="javascript" style="text-align: left;color: white;font-size:20px;" >
// SERVER

const OBJY = require('objy');
const SPOO = require('spoojs');

OBJY.define({
  name: "object",
  pluralName: "objects"
})

SPOO.REST({
  OBJY,
  port: 80
}).run()
</code></pre>
	</div>
	<div style="display: inline-block;"><pre style="border-radius: 10px;background:#232323;text-align: left;padding: 20px;">
          	<code class="javascript" style="color: white;font-size:20px;" >
// CLIENT

let remote = new CONNECT(OBJY)

OBJY.define({
  name: "object",
  pluralName: "objects",
  storage: remote
})

...

OBJY.object({
	name: yogurt
}).add()
</code></pre></div>
</div>

<a class="btn" href="/docs"><b>GET STARTED</b></a>
<div style="height:10px"></div>

<center style="width: 100%;align-items: center;justify-content: center;max-width:100%;white-space:nowrap">

</center>
