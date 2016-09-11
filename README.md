<h1>angular1-es6-with-decorators</h1>

<p>An example of AngularJS 1.x application written in ES 2015 (modern javascript) with decorators that resemble Angular 2.</p>

<p>Angular 2 is already available though there are a lot of code and libraries that are still in Angular 1.x. 
  Here we outline how to write <b>AngularJS 1.x</b> in the modern javascript.</p>
<p>Prerequisites: <a href="https://github.com/lukehoban/es6features">EcmaScript 2015</a>, <a href="https://github.com/wycats/javascript-decorators">javascript decorators</a>, <a href="https://docs.angularjs.org/guide">AngularJS 1.x</a>. <b>No knowledge of <a href="https://angular.io/">Angular 2.0</a> is required.</b></p>
<p>Please note that decorators we have introduced, while resemble those from Angular 2, do not match them exactly.</p>

<p>A sample uses <a href="https://nodejs.org/">nodejs</a>, <a href="https://www.npmjs.com/">npm</a> and <a href="http://gulpjs.com/">gulp</a> as a building pipeline. In addition we have added <a href="https://www.visualstudio.com/en-us/features/node-js-vs.aspx">Visual Studio Nodejs project</a>, and <a href="https://maven.apache.org/">maven project</a>.</p>

<p>Build pipeline uses <a href="http://babeljs.io/">Babel</a> with ES 2015 and decorator plugins to transpile sources into javascript that today's browsers do support. Babel can be replaced or augmented with Typescript compiler to support Microsoft's javascript extensions. Sources are combinded and optionally minified into one or more javascript bundles. In addition html template files are transformed into javascript modules that export a content of html body as a string literals. In general all sources are in src folder and the build's output is assembled in the dist folder. Details of build process are in <a href="gulpfile.js">gulpfile.js</a></p>

<p>So, let's introduce an API we have defined in <a href="src/angular-decorators.js">angular-decorators.js</a> module:</p>

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

    <p>Component's and Directive's options is the same object passed into <code>Module.component(), Module.directive()</code> calls with difference that no 
      <code>options.bindings</code>, <code>options.scope</code>, <code>options.require</code> is specified.
    Instead <code>@Attribute(), @Input(), @Output(), @TwoWay(), @Collection(), @Optional()</code> are used to describe <code>options.bindings</code>, and
    <code>@Host(), Self(), SkipSelf(), @Optional()</code> are used to describe <code>options.require</code></p>

    <p>Every decorated class can use <code>@Inject()</code> member decorator to inject a service.</p>
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

    <p>If optional name is omitted in the member decorator then property name is used as a name parameter.
    <code>@Host(), @Self(), @SkipSelf()</code> accept class decorated with <code>@Component()</code> or <code>@Directive()</code> as a name parameter.</p>
    <p><code>@Inject()</code> accepts class decorated with <code>@Injectable()</code> or <code>@Pipe()</code> as a name parameter.</p>
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
  <dt><code>@Component(),  @SkipSelf(), @Attribute()</code></dt>
  <dd>
    <br />
    In the <a href="https://docs.angularjs.org/guide/component">Angular's component development guide</a> there is a sample <code>myTabs</code> and <code>myPane</code> components.<br />
    Here its rewritten form
    <a href="src/components/myTabs.js">components/myTabs.js</a>:
    <pre style="white-space: pre-wrap">import { Component } from "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators
import template from "<a href="src/templates/my-tabs.html">../templates/my-tabs.html</a>"; // Import template for my-tabs component

@Component("myTabs", { template, transclude: true }) // Decorate class as a component
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
    <a href="src/components/myTabs.js">components/myPane.js</a>:
<pre style="white-space: pre-wrap">import { Component, Attribute, SkipSelf } "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators
import { MyTabs } from "<a href="src/components/myTabs.js">./myTabs</a>"; // Import container&#39;s directive.
import template from "<a href="src/templates/my-pane.html">../templates/my-pane.html</a>"; // Import template.

@Component("myPane", { template, transclude: true }) // Decorate class as a component
export class MyPane // Controller class for the component
{
  @SkipSelf(MyTabs) tabsCtrl; //Inject ancestor MyTabs controller.
  @Attribute() title; // Attribute &quot;@&quot; binding.

  $onInit() // Angular&#39;s $onInit life-cycle hook.
  {
    this.tabsCtrl.addPane(this);
    console.log(this);
  };
}    </pre>
  </dd>
  <dt>@Component(), @Input(), @Output()</dt>
  <dd>
    In the <a href="https://docs.angularjs.org/guide/component">Angular's component development guide</a> there is a sample <code>myTabs</code> component.<br />
    Here its rewritten form
    <a href="src/components/heroDetail.js">components/heroDetail.js</a>:<br />
    <pre style="white-space: pre-wrap">import { Component, Input, Output } from "<a href="src/angular-decorators.js">../angular-decorators</a>";
import template from "<a href="src/templates/heroDetail.html">../templates/heroDetail.html</a>";

@Component("heroDetail", { template }) // Decorate class as a component
export class HeroDetail // Controller class for the component
{
  @Input() hero; // One way binding &quot;&lt;&quot;
  @Output() onDelete; // Bind expression in the context of the parent scope &quot;&amp;&quot;
  @Output() onUpdate; // Bind expression in the context of the parent scope &quot;&amp;&quot;

  delete()
  {
    this.onDelete({ hero: this.hero });
  };

  update(prop, value)
  {
    this.onUpdate({ hero: this.hero, prop, value });
  };
}</pre>
  </dd>
  <dt><code>@Directive(), @Inject(), @Input(), @BindThis()</code></dt>
  <dd>
    <div>
    <br />
    In the <a href="https://docs.angularjs.org/guide/directive">Angular's directive development guide</a> there is a sample <code>myCurrentTime</code> directive.<br />
      Here its rewritten form
    <a href="src/directives/myCurrentTime.js">directives/myCurrentTime.js</a>:
    </div>
    <pre style="white-space: pre-wrap">import { Directive, Inject, Input, BindThis } from "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators

@Directive("myCurrentTime") // Decorate MyCurrentTime class as a directive
export class MyCurrentTime // Controller class for the directive
{
  @Inject() $interval; // &quot;$interval&quot; service is injected into $interval property
  @Inject() dateFilter; // &quot;date&quot; filter service is injected into dateFilter property
  @Inject() $element; // &quot;$element&quot; instance is injected into $element property.
  @Input() myCurrentTime; // Input one way &quot;&lt;&quot; property.
  timeoutId;

  // updateTime is adapted as following in the constructor: 
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
  <dt><code>@Directive(), @Inject(), @HostListener(), @BindThis()</code></dt>
  <dd>
    <br />
    In the <a href="https://docs.angularjs.org/guide/directive">Angular's directive development guide</a> there is a sample <code>myDraggable</code> directive.<br />
    Here its rewritten form. <a href="src/directives/myDraggable.js">directives/myDraggable.js</a>:
    <pre style="white-space: pre-wrap">import { Directive, Inject, HostListener, BindThis } from "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators

@Directive("myDraggable") // Decorate class as a directive
export class MyDraggable // Controller class for the directive
{
  @Inject() $document; // &quot;$document&quot; instance is injected into $document property.
  @Inject() $element;// &quot;$element&quot; instance is injected into $element property.

  startX = 0;
  startY = 0;
  x = 0;
  y = 0;

  // Listen mousedown event over $element.
  @HostListener() mousedown(event)
  {
    // Prevent default dragging of selected content
    event.preventDefault();
    this.startX = event.pageX - this.x;
    this.startY = event.pageY - this.y;
    this.$document.on('mousemove', this.mousemove);
    this.$document.on('mouseup', this.mouseup);
  }

  @BindThis() mousemove(event) // bind mousemove() function to &quot;this&quot; instance.
  {
    this.y = event.pageY - this.startY;
    this.x = event.pageX - this.startX;
    this.$element.css({
      top: this.y + 'px',
      left: this.x + 'px'
    });
  }

  @BindThis() mouseup() // bind mouseup() function to &quot;this&quot; instance.
  {
    this.$document.off('mousemove', this.mousemove);
    this.$document.off('mouseup', this.mouseup);
  }

  $onInit() // Angular&#39;s $onInit life-cycle hook.
  {
    this.$element.css(
    {
      position: 'relative',
      border: '1px solid red',
      backgroundColor: 'lightgrey',
      cursor: 'pointer'
    });
  }
}</pre>
  </dd>
  <dt><code>@Injectable(), @Inject()</code></dt>
  <dd>
    <br />
    In the <a href="https://docs.angularjs.org/guide/providers">Angular's providers development guide</a> there is a sample <code>notifier</code> service.<br />
    Here its rewritten form. <a href="src/services/notify.js">services/notify.js</a>:
    <pre style="white-space: pre-wrap">import { Inject, Injectable } from "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators

@Injectable("notifier") // Decorate class as a service
export class NotifierService
{
  @Inject() $window; // Inject &quot;$window&quot; instance into the property

  msgs = [];

  notify(msg)
  {
    this.msgs.push(msg);

    if (this.msgs.length === 3)
    {
      this.$window.alert(this.msgs.join('\n'));
      this.msgs = [];
    }
  }
}</pre>
  </dd>
  <dt><code>@Pipe()</code></dt>
  <dd>
    <br />
    In the <a href="https://docs.angularjs.org/guide/filter">Angular's filters development guide</a> there is a sample <code>reverse</code> custom filter.<br />
    Here its rewritten form. <a href="src/filters/reverse.js">filters/reverse.js</a>:
<pre style="white-space: pre-wrap">import { Pipe } from "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators

@Pipe("reverse") // Decorate class as a filter
export class ReverseFilter
{
  transform(input, uppercase) // filter function.
  {
    input = input || '';

    var out = '';

    for(var i = 0; i < input.length; i++)
    {
      out = input.charAt(i) + out;
    }

    // conditional based on optional argument
    if (uppercase)
    {
      out = out.toUpperCase();
    }

    return out;
  }
}</pre></dd>
  <dt>Module(), modules(), angular.bootstrap()</dt>
  <dd>
    Here are an examples of a class representing angular module, and manual angular bootstrap:
    <pre style="white-space: pre-wrap">import { angular, modules, Module } from "<a href="src/angular-decorators.js">../angular-decorators</a>"; // Import decorators
import { MyController } from "<a href="src/controllers/myController.js">./controllers/myController</a>"; // Import components.
import { HeroList } from "<a href="src/components/heroList.js">./components/heroList</a>";
import { HeroDetail } from "<a href="src/components/heroDetail.js">./components/heroDetail</a>";
import { EditableField } from "<a href="src/components/editableField.js">./components/editableField</a>";
import { NotifierService } from "<a href="src/services/notify.js">./services/notify</a>";
import { MyTabs } from "<a href="src/components/myTabs.js">./components/myTabs</a>";
import { MyPane } from "<a href="src/components/myPane.js">./components/myPane</a>";
import { ReverseFilter } from "<a href="src/filters/reverse.js">./filters/reverse</a>";
import { MyCurrentTime } from "<a href="src/directives/myCurrentTime.js">./directives/myCurrentTime</a>";
import { MyDraggable } from "<a href="src/directives/myDraggable.js">./directives/myDraggable</a>";

@Module( // Decorator to register angular module, and refer to other modules or module components.
  "my-app",
  [
    MyController,
    NotifierService,
    HeroList,
    HeroDetail,
    EditableField,
    MyTabs,
    MyPane,
    ReverseFilter,
    MyCurrentTime,
    MyDraggable
  ])
class MyApp { }

// Manual bootstrap, with modules() converting module classes into an array of module names.
angular.bootstrap(document, modules(MyApp));</pre>
  </dd>
</dl>
<p>Please see <a href="src/angular-decorators.js">angular-decorators.js</a> to get detailed help on decorators.</p>
