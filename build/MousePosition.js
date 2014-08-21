Elm.MousePosition = Elm.MousePosition || {};
Elm.MousePosition.make = function (_elm) {
   "use strict";
   _elm.MousePosition = _elm.MousePosition || {};
   if (_elm.MousePosition.values)
   return _elm.MousePosition.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "MousePosition";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Mouse = Elm.Mouse.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var main = A2(Signal.lift,
   Text.asText,
   Mouse.position);
   _elm.MousePosition.values = {_op: _op
                               ,main: main};
   return _elm.MousePosition.values;
};