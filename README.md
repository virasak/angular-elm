# AngularJS directive for Elm module

This is the **simplest** AngularJS directive that can reuse plain old Elm module in AngularJS application.  

 * for `Elm.fullscreen`, add elm directive as an attribute of body element.

        <body elm module="Todo" ...>
 
 * for `Elm.embed`, add elm directive as an attribute of div element,

        <div elm module="Todo" ...>
 
 * for `Elm.worker`, use elm as element.

        <elm module="Todo" ...>

Please see [Examples](./examples/index.html) and [Todo App](http://virasak.github.com/elm-todomvc) for usages.

To compile elm to js: `elm --make --only-js *.elm`.
