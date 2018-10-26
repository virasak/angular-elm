/* global angular */
(function(ng) {
  var apps = {
    // [moduleName]: {
    //   elm: An Elm application
    //   count: An integer for the number of times the user has attempted to include this app
    //   name: Name of the Elm module
    // }
  }
  var treeHouse

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

  function link(scope, element, attrs) {
    var ngInterface = scope.ngInterface && diveIntoObject(scope.$parent, scope.ngInterface)
    var app = apps[attrs.module]
    var host
    var wrapper

    if (!treeHouse) {
      createTreeHouse()
    }

    if (app) {
      app.count++

      if (app.count > 1) {
        throw new Error('Cannot create multiple Elm apps for module "' + attrs.module + '". Look for instances of <ng-elm module="' + attrs.module + '"></ng-elm> in your HTML templates.')
      }
      element[0].appendChild(getAppWrapperFromTreeHouse(app))
    } else {
      host = document.createElement('span')
      wrapper = document.createElement('span')
      wrapper.appendChild(host)
      element[0].appendChild(wrapper)
      app = apps[attrs.module] = {
        elm: diveIntoObject(window.Elm, attrs.module).init({node: host, flags: ngInterface}),
        count: 1,
        name: attrs.module,
      }
    }

    element.on('$destroy', function() {
      app.count--
      if (element[0].firstChild) {
        // You'd think we'd save the wrapper variable, but that fails in some cases.
        saveWrapperToTreeHouse(element[0].firstChild, app)
      }
    })

    connectPorts(scope, ngInterface, app)
  }

  function connectPorts(scope, ngInterface, app) {
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
          scope.$parent.$watch(scope.ngInterface + '.' + name, guardedSend)
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

  function branchId(app) {
    return 'Elm-Tree-House-branch-' + app.name.split('.').join('_')
  }

  function createTreeHouse() {
    treeHouse = document.createElement('div')
    treeHouse.style.display = 'none'
    treeHouse.setAttribute('id', 'Elm-Tree-House')
    document.body.appendChild(treeHouse)
  }

  function createBranch(app) {
    var branch = document.createElement('div')

    branch.setAttribute('id', branchId(app))
    treeHouse.appendChild(branch)

    return branch
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

  function getAppWrapperFromTreeHouse(app) {
    return treeHouseBranch(app).firstChild
  }

  function treeHouseBranch(app) {
    return treeHouse.querySelector('#' + branchId(app))
  }

  function saveWrapperToTreeHouse(wrapper, app) {
    var branch = treeHouseBranch(app)

    if (!branch) {
      branch = createBranch(app)
    }

    branch.appendChild(wrapper)
  }
})(angular)
