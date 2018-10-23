# AngularJS directive to include Elm modules

Use Elm modules in AngularJS applications, with ports interoperation.

## Usage

Put an `<ng-elm module="..."></ng-elm>` HTML tag in your template where you want the Elm application to live. Only the `module` attribute is required.

### Embed an insular Elm module

Say you have this simple Elm module.

    module Hello exposing (main)

    import Html exposing (text)


    main =
        text "Hello from Elm!"

[Compile it](https://guide.elm-lang.org/install.html#elm-make) on the command line with `elm make Hello.elm --output=elm.js` and put that script in your AngularJS application's index.html. Then you can include the `Hello` module in any AngularJS HTML template.

    <ng-elm module="Hello"></ng-elm>

It works with deeply nested module names too.

    <ng-elm module="User.Support.Chat"></ng-elm>

These module names must appear under the global `Elm` object in JavaScript.

### With flags

Pass an object literal for the program flags:

    <ng-elm module="Game.Shuffler" flags="{randomSeed: 777}"></ng-elm>

Pass a dynamically generated value in your JSON:

    <ng-elm module="Game.Shuffler" flags="{randomSeed: {{myAngularController.randomSeed}}}"></ng-elm>

Just pass one value as a single flag:

    <ng-elm module="Game.Shuffler" flags="{{myAngularController.randomSeed}}"></ng-elm>

### Talk to AngularJS via ports

Track properties and callbacks on a controller:

    <ng-elm module="My.Elm.Module" ports-interface="myAngularController"></ng-elm>

Track properties and callbacks on a more deeply nested object:

    <ng-elm module="My.Elm.Module" ports-interface="myAngularController.$scope.elmPorts"></ng-elm>

#### Ports Interoperation

The object or controller you're tracking via the `ports-interface` HTML attribute must have properties that match the names of ports that send information to your Elm module. Similarly, to subscribe to updates coming out of your Elm module, you'll need callbacks whose names match each Elm-to-JS port.

For the following examples imagine an Elm module within your application that tracks the severity level of an alert. We'll set it up to communicate directly with an existing AngularJS controller like this:

    <ng-elm module="Alert" ports-interface="alertController"></ng-elm>

##### JS to Elm

If your Elm module has an inbound port like so:

    port severity : (Int -> msg) -> Sub msg

Then your controller must have a property on it called `severity` that's an integer.

    this.severity = 0

Whenever that value changes on your AngularJS controller, if your Elm module is [subscribing](https://package.elm-lang.org/packages/elm/core/latest/Platform-Sub) to that port, then your Elm application will update itself with that information.

##### Elm to JS

If your Elm module has an outbound port like so:

    port updatedSeverity : Int -> Cmd msg

Then your controller must have a callback on it called `updatedSeverity` that accepts an integer.

    this.updatedSeverity = function(newSeverity) { this.severity = newSeverity }

## Support

Only version 0.19 of Elm is supported. Future versions of Elm may cause breaking changes. This will _not_ work with pre-0.19 versions of Elm.

Only [AngularJS 1.x](https://angularjs.org/) is supported. What that _x_ is, I dunno. Assume it's 1.7 or later. But it's not the [new Angular](https://angular.io/).

### Browsers

![If you support IE 8, you're gonna have a bad time.](https://i.imgflip.com/2kr4vr.jpg)

So sorry if you support browsers older than Internet Exploder 9. So sorry.

This doesn't have to do with the AngularJS directive, but with [Elm's browser support](https://discourse.elm-lang.org/t/elm-support-for-older-browsers-ie-9-10/744/7).

## Installation

Via command line

    $ npm install --save angularjs-ng-elm

Include the directive script in your index.html

    <script src="/node_modules/angularjs-ng-elm/angularjs-ng-elm.js"></script>

Add the `Elm` dependency to your AngularJS app

    var app = angular.module('app', ['Elm', 'other.dependency', ...])

## Intent

AngularJS is getting old. There are lots of mission-critical applications out there [built with this technology](https://www.madewithangular.com/), and they would benefit from modernization with a goal of higher maintainability. As experience has taught me, those applications are probably pock-marked with ugly bits of buggy code that nobody wants to refactor for fear of breaking things. They probably also have insignificant test coverage because AngularJS can be cumbersome to test.

Elm addresses both of these problems in ways TypeScript simply _can't_, but Elm needed an easy way to integrate itself into AngularJS applications.

So next time you encounter some AngularJS code that meets these criteria:

* Has at least one bug
* Makes all the developers in the room laugh at it _(not with it)_
* Needs updating because product management has bigger plans for it

then [fix that problem](https://elm-lang.org/blog/how-to-use-elm-at-work) with Elm.

## Credit

Originally created by [virasak](https://github.com/virasak/angular-elm) for Elm 0.18.

Ported to Elm 0.19 and modified with breaking changes by Ethan B. Martin.
