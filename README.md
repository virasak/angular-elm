# Angular directive for Elm module

This is the **simplest** angular directive that can reuse Elm module.  

 * for `Elm.fullscreen`, add elm directive as an attribute of body element.

        <body elm module="Todo" ...>
 
 * for `Elm.embed`, add elm directive as an attribute of div element,

        <div elm module="Todo" ...>
 
 * for `Elm.worker`, use elm as element.

        <elm module="Todo" ...>


Please see 'example.html' for usages.

To compile elm to js: `elm --make --noly-js *.elm`.
