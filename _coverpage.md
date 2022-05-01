<!-- _coverpage.md -->

<div style="height:100px"></div>

<span style="font-size: 50px;color:#b14aad">Build your own Platform
</span>


<span style="font-size:20px">
SPOO is a framework that lets you build custom platforms easily and everywhere,<br> using abstract objects. It comes with built-in features, like authorization, messaging, user handling.
</span>
<br><br>

<center style="width: 100%;align-items: center;justify-content: center;max-width:100%;white-space:nowrap">

<div style="background: #111111;width:900px;max-width:100%;text-align:left;padding:20px;margin:10px;border-radius:5px; display: block;overflow-x: scroll">
	<pre>
	<code class="lang-puzzle" style="font-size:20px !important;color:#EEEEEE">
<span style="color: grey">// 1. Define your data</span>
OBJY.define({
    name: "object", 
    pluralName: "objects",
    storage: new MongoMapper('localhost').connect()
})

<span style="color: grey">// 2. Start the server</span>
SPOO.REST({
    OBJY,
    port: 80
}).run()</code>
	</pre>
</div>


<!--Deploy to: <a class="btn-sm">Google Cloud</a> <a class="btn-sm">AWS</a> <a class="btn-sm">Azure</a> <a class="btn-sm">Netlify Edge functions</a>  <a>Explore more...</a>-->

<br>

<div style="background: #111111;width:900px;max-width:100%;text-align:left;padding:20px;margin:20px;border-radius:5px; display: block;overflow-x: scroll">
	<pre>
	<code class="lang-puzzle" style="font-size:22px !important;color:#EEEEEE">
<span style="color: grey">// Build a client</span>

&#60;script src="https://cdn.jsdelivr.net/npm/@spootechnologies/spooclient@0.0.13/index.js">
&#60;script>
// Authenticate
spoo.io().auth('username', 'password', (data, err) => {})

// Add an object
spoo.io()
    .object({name "hello world"})
    .add((obj, err) => {})
&#60;/script>
</code>
	</pre>
</div>
<!--div style="background: #111111;width:600px;text-align:left;padding:20px;margin:20px;border-radius:5px; display: inline-block;">
	<pre>
	<code class="lang-puzzle" style="font-size:25px !important;color:#EEEEEE">
<span style="color: grey">// Use standalone</span>
$ puzzle run file.pz

<span style="color: grey">// or in Node</span>
puzzle.parse('print hi')
</code>
	</pre>
</div>
<div style="background: #111111;width:500px;text-align:left;padding:20px;margin:20px;border-radius:5px; display: inline-block;">
	<pre>
	<code class="lang-puzzle" style="font-size:25px !important;color:#EEEEEE">
<span style="color: grey">// Build anything</span>

set message "learn puzzle now";
print message;
</code>
	</pre>
</div-->
</center>
<br><br>
<div style="text-align: center;color:#aaaaaa;">
SPOO is open source and published under the MIT License. &nbsp;
<a href="privacy.html" target="_blank">
    Privacy
</a>
&nbsp;
<a href="privacy.html" target="_blank">
    Imprint
</a>
</div>
