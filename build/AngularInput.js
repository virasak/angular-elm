Elm.AngularInput = Elm.AngularInput || {};
Elm.AngularInput.make = function (_elm) {
   "use strict";
   _elm.AngularInput = _elm.AngularInput || {};
   if (_elm.AngularInput.values)
   return _elm.AngularInput.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "AngularInput";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var inputText = Native.Ports.portIn("inputText",
   Native.Ports.incomingSignal(function (v) {
      return typeof v === "string" || typeof v === "object" && v instanceof String ? v : _E.raise("invalid input, expecting JSString but got " + v);
   }));
   var main = A2(Signal.lift,
   Text.asText,
   inputText);
   _elm.AngularInput.values = {_op: _op
                              ,main: main};
   return _elm.AngularInput.values;
};