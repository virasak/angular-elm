Elm.TextField = Elm.TextField || {};
Elm.TextField.make = function (_elm) {
   "use strict";
   _elm.TextField = _elm.TextField || {};
   if (_elm.TextField.values)
   return _elm.TextField.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "TextField";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Elm.Graphics.Input.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Graphics.Input || {};
   Graphics.Input.Field = Elm.Graphics.Input.Field.make(_elm);
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
   var content = Graphics.Input.input(Graphics.Input.Field.noContent);
   var scene = function (fieldContent) {
      return A2(Graphics.Element.flow,
      Graphics.Element.down,
      _L.fromArray([A5(Graphics.Input.Field.field,
                   Graphics.Input.Field.defaultStyle,
                   content.handle,
                   Basics.id,
                   "Type here!",
                   fieldContent)
                   ,Text.plainText(String.reverse(fieldContent.string))]));
   };
   var main = A2(Signal.lift,
   scene,
   content.signal);
   var textOutput = Native.Ports.portOut("textOutput",
   Native.Ports.outgoingSignal(function (v) {
      return v;
   }),
   A2(Signal.lift,
   function (_) {
      return _.string;
   },
   content.signal));
   _elm.TextField.values = {_op: _op
                           ,content: content
                           ,main: main
                           ,scene: scene};
   return _elm.TextField.values;
};