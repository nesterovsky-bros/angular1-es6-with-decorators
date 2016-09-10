import "./angular";

/**
 * Export angular global instance.
 */
export let angular = window.angular;

/**
 * Converts an array of modules, possibly referred by module classes, 
 * to an array of module names.
 * @param require an array of modules as strings or module classes.
 * @return an array of module names.
 */
export function modules(...require)
{
  let modules = [];

  require.forEach(function process(item)
  {
    if (angular.isString(item))
    {
      modules.push(item);
    }
    else if (Array.isArray(item))
    {
      item.forEach(process);
    }
    else
    {
      let info = metadata(item);

      info && info.module && modules.push(info.module);
    }
  });

  return modules;
}

/**
 * Creates a class decorator to declare an angular module.
 * Decorated module class may have a config method used as a
 * module's config function.
 * @param name - a required module name.
 * @param require - optional array of required modules, 
 *   if value is a string, or required module components, if value if a class.
 * @returns a decorator function.
 */
export function Module(name, ...require)
{
  return type =>
  {
    type = injectable(type);
    metadata(type, { module: name });

    let moduleFn = $injector =>
    {
      let instance = $injector.instantiate(type);

      instance.config && instance.config();
    }

    moduleFn.$inject = ["$injector"];

    let module = angular.module(name, modules(require), moduleFn);
    
    require.forEach(function process(type)
    {
      if (Array.isArray(type))
      {
        type.forEach(process);
      }
      else
      {
        let info = metadata(type);

        info && info.register && info.register(module);
      }
    });

    return type;
  }
}

/**
 * Creates a class decorator to register angular service.
 * @param name a string used as a service name.
 * @returns a decorator function.
 */
export function Injectable(name)
{
  function register(module) { module.service(name, this.$type); }

  return type => metadata(injectable(type), {name, register}).$type;
}

/**
 * Creates a class decorator to register angular directive.
 * @param name - a directive name.
 * @param options - a directive options.
 * @returns a decorator function.
 */
export function Directive(name, options)
{
  return type => directiveFn(name, options, type, false);
}

/**
 * Creates a class decorator to register angular component.
 * @param name - a component name.
 * @param options - a component options.
 * @returns a decorator function.
 */
export function Component(name, options)
{
  return type => directiveFn(name, options, type, true);
}

/**
 * Creates a class decorator to register angular controller.
 * @param name - a controller name.
 * @returns a decorator function.
 */
export function Controller(name)
{
  function register(module) { module.controller(name, this.$type); }

  return type => metadata(injectable(type), {name, register}).$type;
}

/**
 * Creates a class decorator to register angular filter.
 * Filter class should have a transform instance function 
 * that will be used to call filter.
 * @param name a string used as a filter name.
 * @param pure indicate whether the filter is pure 
 *   (true, this is a default value) or statefull (false).
 * @returns a decorator function.
 */
export function Pipe(name, pure)
{
  function register(module)
  {
    let filterFn = $injector =>
    {
      let instance = $injector.instantiate(this.$type);

      return instance.transform.bind(instance);
    }

    filterFn.$inject = ["$injector"];
    filterFn.$stateful = pure === false;

    module.filter(name, filterFn);
  }

  return type =>
    metadata(injectable(type), { name: name + "Filter", register }).$type;
}

const maskAttribute = 1 << 0;
const maskInput = 1 << 1;
const maskOutput = 1 << 2;
const maskTwoWay = 1 << 3;
const maskCollection = 1 << 4;
const maskHost = 1 << 5;
const maskSelf = 1 << 6;
const maskSkipSelf = 1 << 7;
const maskOptional = 1 << 8;
const maskHostListener = 1 << 9;
const maskInject = 1 << 10;
const maskBindThis = 1 << 11;

const maskNoName = 1 << 0;
const maskNameOrType = 1 << 1;
const maskMethod = 1 << 2;

/**
 * Creates an injection member decorator.
 * @param name a service name or type.
 * @returns a decorator function.
 */
export const Inject = makeBinder(maskInject, 0, maskNameOrType);

/**
 * Creates a decorator that binds attribute to the property.
 * @param name an attribute name.
 * @returns a decorator function.
 */
export const Attribute = makeBinder(maskAttribute, maskOptional);

/**
 * Creates a decorator that binds a property to
 * an expression in attribute. By default binding is one-way, and
 * can be overriden by @TwoWay() decorator.
 * @param name an attribute name.
 * @returns a decorator function.
 */
export const Input =
  makeBinder(maskInput, maskTwoWay | maskCollection | maskOptional);

/**
 * Creates a decorator that provides a way to execute an
 * expression in the context of the parent scope.
 * @param name an attribute name.
 * @returns a decorator function.
 */
export const Output = makeBinder(maskOutput, maskOptional);

/**
 * Creates a decorator that binds a property to
 * an expression in attribute in two directions.
 * This decorator must be used with @Input() decorator.
 * @returns a decorator function.
 */
export const TwoWay =
  makeBinder(maskTwoWay, maskInput | maskOptional, maskNoName);

/**
 * Creates a decorator that binds a collection property to
 * an expression in attribute in two directions.
 * This decorator must be used with @Input() decorator.
 * @returns a decorator function.
 */
export const Collection =
  makeBinder(maskCollection, maskInput | maskOptional, maskNoName);

/**
 * Creates a decorator that binds a property to a host controller
 * of a directive found on the element or its ancestors.
 * @param name an directive name or type.
 * @returns a decorator function.
 */
export const Host =
  makeBinder(maskHost, maskInput | maskOptional, maskNameOrType);

/**
 * Creates a decorator that binds a property to a host controller
 * of a directive found on the element.
 * @param name an directive name or type.
 * @returns a decorator function.
 */
export const Self = makeBinder(maskSelf, maskOptional, maskNameOrType);

/**
 * Creates a decorator that binds a property to a host controller
 * of a directive found on the ancestors of the element.
 * @param name an directive name or type.
 * @returns a decorator function.
 */
export const SkipSelf =
  makeBinder(maskSkipSelf, maskOptional, maskNameOrType);

/**
 * Creates a decorator that optionally binds a property.
 * @returns a decorator function.
 */
export const Optional = makeBinder(maskOptional, 0, maskNoName);

/**
 * Creates a decorator that binds method to a host event.
 * For this binding to work one should inject $element instance, like this:
 *   '@Inject() $element;'
 * @param name an event name.
 * @returns a decorator function.
 */
export const HostListener = makeBinder(maskHostListener, 0, maskMethod);

/**
 * Creates a decorator that binds "this" of the function to the class instance.
 */
export const BindThis =
  makeBinder(maskBindThis, 0, maskMethod | maskNoName);

function makeBinder(mask, compatibleMask, options)
{
  return name =>
  {
    if (options & maskNoName)
    {
      name = null;
    }
    else if (options & maskNameOrType)
    {
      let info = metadata(name);

      if (info)
      {
        name = info.name;
      }
    }
    // No more cases

    return (prototype, property, descriptor) =>
    {
      if (options & maskMethod)
      {
        angular.isFunction(descriptor.value) ||
          error("A member " + property + " must be a function.");
      }
      else 
      {
        if (!(descriptor.get && descriptor.set))
        {
          delete descriptor.get;
          delete descriptor.set;
          descriptor.writable = true;
        }
      }

      if (!descriptor.initializer)
      {
        delete descriptor.initializer;
      }

      let info = metadata(prototype.constructor);
      let decorators = info.$decorators || (info.$decorators = []);
      let decorator;

      for(let i = decorators.length; i--;)
      {
        decorator = decorators[i];

        if (decorator.property === property)
        {
          break;
        }

        decorator = null;
      }

      if (decorator)
      {
        (decorator.mask & ~compatibleMask) ||
          error("Invalid decorator for property " + property);
        decorator.mask |= mask;
      }
      else
      {
        decorator = { property, mask };
        decorators.push(decorator);
      }

      if (name && !decorator.name && (name !== property))
      {
        decorator.name = name;
      }
    }
  };
}

function directiveFn(name, options, type, component)
{
  function register(module)
  {
    let directive = assign({}, options);

    directive.controller = this.$type;
    directive.require || (directive.require = this.$require);

    if (component)
    {
      directive.bindings || (directive.bindings = this.$bindings);
      module.component(name, directive);
    }
    else
    {
      directive.controllerAs || (directive.controllerAs = name);
      directive.bindToController ||
        (directive.bindToController = this.$bindings);
      module.directive(name, () => directive);
    }
  }

  return metadata(
    injectable(type),
    { name: name + "Directive", register }).$type;
}

/**
 * An injectable decorator function.
 * @param type a type to decorate.
 * @returns a decorated type.
 */
function injectable(type)
{
  return resolve(metadata(type)).$type;
}

function metadata(type, value)
{
  if (!angular.isFunction(type))
  {
    return;
  }

  let info = type.$$metadata;
    
  if (!info)
  {
    type.$$metadata = info = { $type: type };
  }
  else if (info.$type != type)
  {
    let newInfo = {};

    for(let key in info)
    {
      let item = info[key];

      if (key.startsWith("$"))
      {
        continue;
      }
      else if (Array.isArray(item))
      {
        item = item.slice();
      }
      else if (angular.isObject(item))
      {
        item = assign({}, item);
      }
      // No more cases.

      newInfo[key] = item;
    }

    newInfo.$type = type;
    newInfo.$base = info;
    info = newInfo;
  }

  (value === undefined) || assign(info, value);

  return info;
}

function resolve(info)
{
  if (!info || info.$resolved)
  {
    return info;
  }

  let base = resolve(info.$base);
  let element = base && base.$element;
  let inject = base ? base.$inject.slice() : [];
  let injectProperties = [];
  let require = base ? assign({}, base.$require) : {};
  let bindings = base ? assign({}, base.$bindings) : {};
  let events = [];
  let bindThis = [];

  info.$decorators && info.$decorators.forEach(({ property, name, mask }) =>
  {
    if (mask & maskInject)
    {
      name || (name = property);
      element || (name !== "$element") || (element = property);
      injectProperties.push(property);
      inject.push(name);
    }
    else if (mask & (maskHost | maskSelf | maskSkipSelf))
    {
      require[property] =
        (mask & maskSkipSelf ? "^^" : mask & maskHost ? "^" : "") +
        (mask & maskOptional ? "?" : "") +
        (name || "");
    }
    else if (mask & maskHostListener)
    {
      events.push({ name, property });
    }
    else if (mask &
      (maskAttribute | maskInput | maskOutput | maskTwoWay | maskCollection))
    {
      bindings[property] =
        (mask & maskAttribute ? "@" :
          mask & maskOutput ? "&" :
            mask & maskCollection ? "=*" :
              mask & maskTwoWay ? "=" : "<") +
        (mask & maskOptional ? "?" : "") +
        (name || "");
    }
    else if (mask & maskBindThis)
    {
      bindThis.push(property);
    }
    // No more cases
  });

  !events.length || element ||
    error("$element should be injected to allow attaching events.");

  if (injectProperties.length || events.length || bindThis.length)
  {
    let type = info.$type;

    function Create()
    {
      type.apply(this, arguments);

      let offset = arguments.length - info.$injectProperties.length;

      info.$injectProperties.forEach(
        (name, index) => this[name] = arguments[offset + index]);
      info.$bindThis.forEach(name => this[name] = this[name].bind(this));
      info.$events.forEach(({name, property}) =>
        this[info.$element].on(name || property, this[property].bind(this)));
    }

    assign(Create, type);
    Create.prototype = Object.create(type.prototype);
    Create.prototype.constructor = Create;
    Create.$inject = inject;
    info.$type = Create;
  }

  info.$inject = inject;
  info.$injectProperties = injectProperties;
  info.$require = require;
  info.$bindings = bindings;
  info.$events = events;
  info.$bindThis = bindThis;
  info.$element = element;
  info.$resolved = true;

  return info;
}

const assign = Object.assign || function (target, source)
{
  for(let key in source)
  {
    if (Object.prototype.hasOwnProperty.call(source, key))
    {
      target[key] = source[key];
    }
  }

  return target;
};

function error(message) { throw new Error(message); }