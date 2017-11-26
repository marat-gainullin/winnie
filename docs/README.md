# Winnie Browser GUI Designer
Winnie is WYSIWYG GUI designer for Kenga widgets.

Winnie allows you to create, edit and save to clipboard a composition of Kenga widgets.

It contains widgets palette, visual playground, properties pane and view structure explorer arranged in multisplit layout.

## Features
* Some predefined templates.
* Comprehensive palette of widgets.
* Extensible palette.
* Extensible templates.
* Darg & drop from palette to visual playground.
* Snap to grid while visual manipulation with mouse.
* Undo/redo of every action.
* Opening layout composition from `.json` files with `JSON` data.
* Adoption of an already created kenga composition module and editing it.
* Saving results to clipboad as `JSON` data.
* Generating of Es6 code that creates a layout in runtime without dependecies on Winnie.
* Saving only edited properties if thiers values are not same as default ones.

## Build
To biuld a ready to use bundle, type the following in your command prompt:
```
gulp bundle
```
To build a bundle suitable for debugging, type the following in your command prompt:
```
gulp bundle --dev
```
To build Winnie as a library package, type the following in your command prompt:
```
gulp lib
```

## Run
To build Winnie from source and run it with your default browser, type the following in your command prompt:
```
npm start
```

## Demo
There is a demo application with Winnie - [KengaJS Designer Demo](http://kengajs.com/demo/winnie.html)
