module AngularInput where

port inputText: Signal String

main = lift asText inputText
