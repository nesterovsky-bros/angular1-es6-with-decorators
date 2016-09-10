<h1>angular1-es6-with-decorators</h1>

<p>An example of angular 1.x application written in ES 2015 with decorators that resemble angular 2.</p>

<p>Angular 2 is already available though there are a lot of code and libraries that are still in Angular 1.x. 
Here we outline a transition path from Angular 1.x to Angular 2.
This means that you can write in the modern javascript, including decorators. At the same time all existing code and libraries are still available.</p>

<p>Please note that decorators we have introduced, while resemble those from Angular 2, do not match exactly.</p>

<p>A sample uses <a href="https://nodejs.org/">nodejs</a>, <a href="https://www.npmjs.com/">npm</a> and <a href="http://gulpjs.com/">gulp</a> as a building pipeline. In addition we have added <a href="https://www.visualstudio.com/en-us/features/node-js-vs.aspx">Visual Studio Nodejs project</a>, and <a href="https://maven.apache.org/">maven project</a>.</p>

<p>Build pipeline uses <a href="http://babeljs.io/">Babel</a> with ES 2015 and decorator plugins to transpile sources into javascript that today's browsers do support. Babel can be replaced or augmented with Typescript compiler to support Microsoft's javascript extensions. Sources are combinded and optionally minified into one or more javascript bundles. In addition html template files are transformed into javascript modules that export a content of html body as a string literals. In general all sources are in src foulder and the build's output is assembled in the dist folder. Details of build process are in <a href="gulpfile.js">gulpfile.js</a></p>

<p>So, let's introduce an API we have defined in <code>angular-decorators.js</code> module:</p>

<ul>
  <li>
    Class decorators:
    <ul>
      <li><code>Component(name, options?)</code> - a decorator to register angular component.</li>
      <li><code>Controller(name)</code> - a decorator to register angular controller.</li>
      <li><code>Directive(name, options?)</code> - a decorator to register angular directive.</li>
      <li><code>Injectable(name)</code> - a decorator to register angular service.</li>
      <li><code>Module(name, ...require)</code> - a decorator to declare an angular module;</li>
      <li><code>Pipe(name, pure?)</code> - a decorator to register angular filter.</li>
    </ul>
  </li>
  <li>
    Member decorators:
    <ul>
      <li><code>Attribute(name?)</code> - a decorator that binds attribute to the property.</li>
      <li><code>BindThis()</code> - a decorator that binds "<code>this</code>" of the function to the class instance.</li>
      <li><code>Collection()</code> - a decorator that binds a collection property to an expression in attribute in two directions.</li>
      <li><code>Host(name?)</code> - a decorator that binds a property to a host controller of a directive found on the element or its ancestors.</li>
      <li><code>HostListener(name?)</code> - a decorator that binds method to a host event.</li>
      <li><code>Inject(name?)</code> - an injection member decorator.</li>
      <li><code>Input(name?)</code> - a decorator that binds a property to an expression in attribute.</li>
      <li><code>Optional()</code> - a decorator that optionally binds a property.</li>
      <li><code>Output(name?)</code> - a decorator that provides a way to execute an expression in the context of the parent scope.</li>
      <li><code>Self(name?)</code> - a decorator that binds a property to a host controller of a directive found on the element.</li>
      <li><code>SkipSelf(name?)</code> - a decorator that binds a property to a host controller of a directive found on the ancestors of the element.</li>
      <li><code>TwoWay()</code> - a decorator that binds a property to an expression in attribute in two directions.</li>
    </ul>
  </li>
  <li>
    Other:
    <ul>
      <li><code>modules(...require)</code> - converts an array of modules, possibly referred by module classes, to an array of module names.</li>
    </ul>
  </li>
</ul>

<p>Now we can start with samples. Please note that we used samples scattered here and there on the Anuglar site.</p>

<dl>
  <dt><code>@Component()</code></dt>
  <dd>
    <br />
    In the <a href="https://docs.angularjs.org/guide/component">Angular's component development guide</a> there is a sample <code>myTabs</code> component.
    Here it's rewritten as following (see <a href="components/myTabs.js">components/myTabs.js</a>):
    <pre>import { Component } from "../angular-decorators"; // Import Component decorator
import template from "../templates/my-tabs.html"; // Import template for my-tabs component

@Component("myTabs", { template, transclude: true }) // Decorate class MyTabs as component
export class MyTabs // Controller class for the component
{
  panes = []; // List of active panes

  select(pane) // Selects an active pane
  {
    this.panes.forEach(function(pane) { pane.selected = false; });
    pane.selected = true;
  }

  addPane(pane) // Adds a new pane
  {
    if (this.panes.length === 0)
    {
      this.select(pane);
    }

    this.panes.push(pane);
  }
}</pre>
  </dd>

  <dt><code>@Directive(), @Inject(), @Input(), @BindThis()</code></dt>
  <dd>
    <br />
    In the <a href="https://docs.angularjs.org/guide/directive">Angular's directive development guide</a> there is a sample <code>myCurrentTime</code> directive.
    Here it's rewritten as following (see <a href="components/myCurrentTime.js">components/myCurrentTime.js</a>):
    <pre>import { Directive, Inject, Input, BindThis } from "../angular-decorators"; // Import decorators

@Directive("myCurrentTime") // Decorate MyCurrentTime class a directive
export class MyCurrentTime // Controller class for the component
{
  @Inject() $interval; // $interval property injected with &quot;$interval&quot; service.
  @Inject() dateFilter; // dateFilter property injected with &quot;date&quot; filter service.
  @Inject() $element; // $element property injected with &quot;$element&quot;.
  @Input() myCurrentTime; // Input one way property.
  timeoutId;

  // adapted as following in constructor: 
  //   this.updateTime = this.updateTime.bind(this);
  @BindThis() updateTime() 
  {
    this.$element.text(this.dateFilter(new Date(), this.myCurrentTime));
  }

  $onInit() // Angular&#39;s $onInit life-cycle hook.
  {
    this.timeoutId = this.$interval(this.updateTime, 1000);
  }

  $onDestroy() // Angular&#39;s $onDestroys life-cycle hook.
  {
    this.$interval.cancel(this.timeoutId);
  }

  $onChanges(changes) // Angular&#39;s $onChanges life-cycle hook.
  {
    this.updateTime();
  }
}
</pre>
  </dd>
</dl>
<p>
  TODO:</p>

