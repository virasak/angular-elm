(function (ng, Elm) {

    /**
     * Usage:
     *  ## Elm in plain JavaScript
     *  <script>
     *   var msg = 'Hello world!';
     *   // For fullscreen mode
     *   var elm = Elm.fullscreen(Elm.ModuleName, { initMesage: msg})
     *   // For embedded mode
     *   //var elm = Elm.embed(divElement, Elm.ModuleName, { initMesage: msg})
     *   // For worker mode
     *   //var elm = Elm.embed(Elm.ModuleName, { initMesage: msg})
     *   elm.ports.messageIn.send('hello')
     *   elm.ports.messageOut.subscribe(function (msg) {
     *      console.log(msg);
     *   });
     *   </script>
     *
     *   ## Elm in AngularJS
     *   For fullscreen mode
     *     <body elm module="ModuleName" ports-in="{ initMessage: msg }">
     *   For embedded mode
     *     <div elm module="ModuleName" ports-in="{ initMessage: msg }">
     *   For worker mode
     *   <elm module="ModuleName" ports-in="{ initMessage: msg }"> 
     *
     *   <script>
     *   // ...
     *   $scope.msg = 'Hello world!';
     *   // auto send when messageIn is change
     *   $scope.messageIn = 'hello';
     *
     *   // auto subscribe/unsubscribe when messageOut is change
     *   $scope.messageOut = function (msg) {
     *      console.log(msg);
     *   }
     *   // ...
     *   </script>
     */

    ng.module('Elm', [])
        .directive('elm', function ($parse, $timeout) {
            function link(scope, element, attrs) {
                var id         = attrs.id;
                var target     = element[0];
                var portsIn    = $parse(attrs.portsIn)(scope);
                var ports      = attrs.ports;
                var moduleName = attrs.module;
                var module     = Elm[moduleName];
                var elm;


                if (target.nodeName === 'BODY') {
                    // <body elm module="" ...></body>
                    elm = Elm.fullscreen(module, portsIn)
                } else if (target.nodeName === 'ELM') {
                    // <elm module="" ...></elm>
                    elm = Elm.worker(module, portsIn);
                } else if (target.nodeName === 'DIV') {
                    // <div elm module="" ...></div>
                    elm = Elm.embed(module, target, portsIn );
                }


                if (elm) {
                    portsPrefix = ports? ports + '.' : '';
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
                                    }
                                    port.subscribe(adapterFn);
                                }
                            });
                        }
                    });
                }
            };

            return {
                restrict: 'EA',
                    link: link
            };
        });
})(angular, Elm);

