(function (ng, Elm) {

    ng.module('Elm', [])
        .directive('elm', function ($parse) {
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
                                if (value) {
                                    port.send(value);
                                }
                            });
                        } else if (port.subscribe) {
                            scope.$watch(portsPrefix + name, function(newFn, oldFn) {
                                if (ng.isFunction(oldFn)) {
                                    port.unsubscribe(oldFn);
                                }
                                if (ng.isFunction(newFn)) {
                                    port.subscribe(newFn);
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

