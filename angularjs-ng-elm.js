/* global angular, Elm */
(function(ng, Elm) {
  /**
   * Usage:
   *
   *   To embed an insular Elm module:
   *     <ng-elm module="My.Elm.Module"></ng-elm>
   *
   *   To have it talk to a controller:
   *     <ng-elm module="My.Elm.Module" ports-controller="myAngularController"></ng-elm>
   *
   *   With flags:
   *     <ng-elm module="ElmModuleName" flags='{myValue: "Hello init!"}'></ng-elm>
   *
   */
  ng
  .module('Elm', [])
  .directive('ngElm', ngElmDirective)

  function ngElmDirective($parse) {
    return {
      link: link.bind(this, $parse), // Link doesn't do dependency injection, so we'll pass $parse along to the first argument.
      restrict: 'EA',
      scope: {
        portsInterface: '@',
      },
    }
  }

  ngElmDirective.$inject = ['$parse']

  function link($parse, scope, element, attrs) {
    var portsInterface = scope.portsInterface && diveIntoObject(scope.$parent, scope.portsInterface)
    var flags = $parse(attrs.flags)(scope)
    var elmApp = diveIntoObject(Elm, attrs.module) // Could 'splode if the module can't be found or it doesn't accept flags of that type.
      .init({
        node: element[0],
        flags: flags,
      })

    if (portsInterface) {
      ng.forEach(elmApp.ports, function(port, name) {
        // The Angular controller's corresponding side of the port, which might exist.
        // To accept data coming out of the Elm app,
        // make a function on the controller with the same name as a port in the Elm app that produces `Cmd msg`.
        // To send data into the Elm app, create a property on the controller with the same name
        // as a port in the Elm app that produces `Sub msg`.
        var interfaceMount = portsInterface[name]

        if (port.send) {
          // It's a port allowing information to enter the Elm application.
          scope.$parent.$watch(`${scope.portsInterface}.${name}`, port.send)
          if (typeof interfaceMount !== 'undefined') {
            // If we have information Elm is interested in at the time the module is initialized,
            // then send it over immediately instead of waiting for it to change in the future.
            // If you want a blank value sent to the Elm app, (a `Maybe` on the Elm side), make it null.
            // Guarding against undefined prevents Elm's border patrol from yelling at you,
            // should a thing not be present on the controller when it initializes.
            port.send(interfaceMount)
          }
        } else if (port.subscribe) {
          // It's a port that might provide information each time the Elm application does its internal update.
          port.subscribe(datum => {
            // Check whether the controller has a corresponding function each time we get data,
            // so we don't have to worry about initialization weirdness on the Angular side,
            // and we can allow the controller to determine when it will respond to changes or not,
            // much in the same way Elm handles subscriptions.
            if (typeof interfaceMount === 'function') {
              interfaceMount(datum)
              scope.$apply()
            }
          })
        }
      })
    }
  }

  // Helper function for getting deep into an object if necessary.
  // E.g.
  // diveIntoObject({foo: {bar: {baz: 33}}}, 'foo.bar.baz') // => 33
  function diveIntoObject(object, accessorString) {
    var accessorParts

    if (!accessorString) {
      return object
    }

    accessorParts = accessorString.split('.')

    return diveIntoObject(object[accessorParts.shift()], accessorParts.join('.'))
  }
})(angular, Elm)
