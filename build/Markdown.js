Elm.Markdown = Elm.Markdown || {};
Elm.Markdown.make = function (_elm) {
   "use strict";
   _elm.Markdown = _elm.Markdown || {};
   if (_elm.Markdown.values)
   return _elm.Markdown.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Markdown";
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
   var main = Text.markdown("<div style=\"height:0;width:0;\">&nbsp;</div><h1 id=\"markdown-support\">Markdown Support</h1>\n<p>Elm has native markdown support, making it easy to create complex text elements. You can easily make:</p>\n<ul>\n<li>Headers</li>\n<li><a href=\"/\">Links</a></li>\n<li>Images</li>\n<li><strong>Bold</strong>, <em>italic</em>, and <code>monospaced</code> text</li>\n<li>Lists (numbered, nested, multi-paragraph bullets)</li>\n</ul>\n<p>It all feels quite natural to type. For more information on Markdown, see <a href=\"http://daringfireball.net/projects/markdown/\">this site</a>.</p><div style=\"height:0;width:0;\">&nbsp;</div>",
   "3:8");
   _elm.Markdown.values = {_op: _op
                          ,main: main};
   return _elm.Markdown.values;
};