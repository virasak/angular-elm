/* global angular, Elm */
(function(ng, Elm) {
  var apps = {
    // elm: An Elm application
    // host: A DOM node
    // count: An integer for the number of times the user has attempted to include this app
  }
  var treeHouse

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

  function ngElmDirective() {
    return {
      link: link,
      restrict: 'EA',
      scope: {
        ngInterface: '@',
      },
    }
  }

  ngElmDirective.$inject = ['$parse']

  function createTreeHouse() {
    treeHouse = document.createElement('div')
    treeHouse.style.display = 'none'
    treeHouse.setAttribute('id', 'Elm-Tree-House')
    document.body.appendChild(treeHouse)
  }

  function saveTreeHouseHost(host, app) {
    var textHost

    if (host instanceof Text) {
      // We go through this nonsense to make sure we don't lose the reference.
      textHost = document.createTextNode(host.textContent)
      treeHouse.appendChild(textHost)
      app.host = textHost
    } else {
      treeHouse.appendChild(host)
    }
  }

  function link(scope, element, attrs) {
    var ngInterface = scope.ngInterface && diveIntoObject(scope.$parent, scope.ngInterface)
    var app = apps[attrs.module]
    var host

    if (!treeHouse) {
      createTreeHouse()
    }

    if (app) {
      app.count++

      if (app.count > 1) {
        throw new Error('Cannot create multiple Elm apps for module "' + attrs.module + '". Look for instances of <ng-elm module="' + attrs.module + '"></ng-elm> in your HTML templates.')
      }
      element[0].appendChild(app.host)
    } else {
      host = document.createElement('div')
      element[0].appendChild(host)
      app = apps[attrs.module] = {
        elm: diveIntoObject(Elm, attrs.module).init({node: host, flags: ngInterface}),
        host: host,
        count: 1,
      }
    }

    element.on('$destroy', function() {
      app.count--
      if (element[0].firstChild) {
        saveTreeHouseHost(element[0].firstChild, app)
      }
    })

    if (ngInterface) {
      ng.forEach(app.elm.ports, function(port, name) {
        // The Angular controller's corresponding side of the port, which might exist.
        // To accept data coming out of the Elm app,
        // make a function on the controller with the same name as a port in the Elm app that produces `Cmd msg`.
        // To send data into the Elm app, create a property on the controller with the same name
        // as a port in the Elm app that produces `Sub msg`.
        var interfaceMount = ngInterface[name]

        function guardedSend(newValue) {
          if (typeof newValue !== 'undefined') {
            port.send(newValue)
          }
        }

        if (port.send) {
          // It's a port allowing information to enter the Elm application.
          scope.$parent.$watch(`${scope.ngInterface}.${name}`, guardedSend)
          // If we have information Elm is interested in at the time the module is initialized,
          // then send it over immediately instead of waiting for it to change in the future.
          // If you want a blank value sent to the Elm app, (a `Maybe` on the Elm side), make it null.
          // Guarding against undefined prevents Elm's border patrol from yelling at you,
          // should a thing not be present on the controller when it initializes.
          guardedSend(interfaceMount)
        } else if (port.subscribe) {
          // It's a port that might provide information each time the Elm application does its internal update.
          port.subscribe(function(datum) {
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
  // diveIntoObject({foo: {bar: {baz: 33}}}, 'foo.bar.baz') // === 33
  function diveIntoObject(object, accessorString) {
    var accessorParts

    if (!accessorString) {
      return object
    }

    accessorParts = accessorString.split('.')

    return diveIntoObject(object[accessorParts.shift()], accessorParts.join('.'))
  }
})(angular, Elm)
