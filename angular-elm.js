(function (ng, Elm) {

    /**
     * Usage:
     *
     *   For fullscreen mode
     *     <body elm module="ModuleName">
     *
     *   For embedded mode
     *     <div elm module="ModuleName">
     *
     *   For worker mode
     *     <elm module="ModuleName">
     *
     *   ----
     *
     *   Flags (for Html.App.programWithFlags):
     *     <div elm module="ModuleName" flags='{myValue: "Hello init!"}'>
     *
     *   ----
     *
     *   Ports prefix ("namespacing"):
     *     <div elm module="ModuleName" ports="prefix">
     *   Then instead of $scope.myPort you use $scope.prefix.myPort .
     *
     *   ----
     *
     *   Ports usage:
     *
     *   Sending from JS: (if you have Elm port 'fromJsToElm')
     *     $scope.fromJsToElm = 'This gets automatically sent to Elm!';
     *
     *   Subscribing: (if you have Elm port 'fromElmToJs')
     *     $scope.fromElmToJs = function (msg) {
     *       console.log(msg);
     *     }
     */

    ng.module('Elm', [])
        .directive('elm', function ($parse, $timeout) {
            function link(scope, element, attrs) {
                var target     = element[0];
                var flags      = $parse(attrs.flags)(scope);
                var ports      = attrs.ports;
                var moduleName = attrs.module;
                var module     = Elm[moduleName];
                var elm;


                if (target.nodeName === 'BODY') {
                    // <body elm module="" ...></body>
                    elm = module.fullscreen(flags)
                } else if (target.nodeName === 'ELM') {
                    // <elm module="" ...></elm>
                    elm = module.worker(flags);
                } else if (target.nodeName === 'DIV') {
                    // <div elm module="" ...></div>
                    elm = module.embed(target, flags);
                }


                if (elm) {
                    var portsPrefix = ports ? ports + '.' : '';
                    ng.forEach (elm.ports, function(port, name) {
                        if (port.send) {
                            scope.$watch(portsPrefix + name, function(value) {
                                try {
                                    port.send(value);
                                } catch (ex) {
                                    // elm border check error
                                }
                            });
                        } else if (port.subscribe) {
                            var adapterFn;
                            scope.$watch(portsPrefix + name, function(newFn) {
                                if (adapterFn) {
                                    port.unsubscribe(adapterFn);
                                    adapterFn = undefined;
                                }

                                if (ng.isFunction(newFn)) {
                                    adapterFn = function (value) {
                                        $timeout(function () {
                                            newFn(value);
                                        });
                                    };
                                    port.subscribe(adapterFn);
                                }
                            });
                        }
                    });
                }
            }

            return {
                restrict: 'EA',
                    link: link
            };
        });
})(angular, Elm);
