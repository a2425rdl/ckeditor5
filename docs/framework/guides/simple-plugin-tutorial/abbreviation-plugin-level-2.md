---
category: simple-plugin
order: 25
---

# Abbreviation plugin tutorial - part 2

In this part of the tutorial we'll focus on creating a dialog box, which will get user's input.

We'll pick up where we left off in the first part, so make sure you {@link framework/guides/simple-plugin-tutorial/abbreviation-plugin-level-1 start there}, or grab our starter files for this part.

<info-box>
As we'll mostly work on the UI, we recommend reading up on our {@link framework/guides/architecture/ui-library UI library} before you start coding.
</info-box>

If you want to see the final product of this tutorial before you plunge in, check out the [demo](#demo).

## Creating a view

The most important part of the UI for this plugin is a dialog box with a form, which will get us user's input.

### Creating a form view template

Let's start by creating a view with a form. It will include two input fields (for the abbreviation and the title), and the 'submit' and 'cancel' buttons. We'll do it in a separate view. Create a new file `abbreviationview.js` in the `abbreviation/` directory.

Our new `FormView` class will extend the {@link framework/guides/architecture/ui-library#views View} class, so start by importing it from the UI library.

In the `FormView` constructor we'll define a template for our abbreviation form. We need to set a tag of the HTML element, and a couple of its attributes. To make sure our view is focusable, let's add {@link framework/guides/deep-dive/focus-tracking#implementing-focusable-ui-components `tabindex="-1"`}.

We'll also pass the editor's {@link module:utils/locale~Locale} instance to the constructor, so we can localize all our UI components with the help of the {@link module:utils/locale~Locale#t `t()` function}.

```js
// abbreviation/abbreviationview.js

import View from '@ckeditor/ckeditor5-ui';

export default class FormView extends View {
	constructor( locale ) {
		super( locale );
		const t = locale.t;

		this.setTemplate( {
			tag: 'form',
			attributes: {
				class: [ 'ck', 'ck-responsive-form' ],
				tabindex: '-1',
				style: { 'padding': '2px' }
			}
		} );
	}

}
```

### Creating input fields

As we have two similar input fields to create and we don't want to repeat ourselves, let's define a method `_createInput()`, which will produce them for us. It will accept the name of our input field, so we can insert it into its label.

We'll use {@link module:ui/labeledinput/labeledfieldview~LabeledFieldView `LabeledFieldView`} class, and we'll pass it the `createLabeledInputText()` function as the second argument. We'll extend the template for `LabeledFieldView` to add a bit of padding.

```js
// abbreviation/abbreviationview.js

import {
    View,
    LabeledFieldView,               // ADDED
    createLabeledInputText          // ADDED
    } from '@ckeditor/ckeditor5-ui';

export default class FormView extends View {
	constructor( locale ) {
        // ...

        this.abbrInputView = this._createInput( 'abbreviation' );
		this.titleInputView = this._createInput( 'title' );
	}

    _createInput( inputName ) {
        const t = this.locale.t;

        const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

        labeledInput.label = t( `Add ${ inputName }` );

        labeledInput.extendTemplate( {
            attributes: {
                style: {
                    'padding': '2px',
                    'padding-top': '6px'
                }
            }
        } );

        return labeledInput;
    }
}
```

### Creating form buttons

Now, we can add a `submit` and a `cancel` buttons to our form. You can start by importing `ButtonView` from our UI library and icons, which we'll use for labels.

Let's write a `_createButton` function, which will take four arguments - `label`, `icon`, `className`, and `eventName` (so either `submit` or `cancel`).

We'll then set the button attributes, using the passed `label` and `icon`, and adding a tooltip option. We'll also extend the existing `ButtonView` template with the class names.

Last thing is to delegate `execute` to the button's event, so the user can either `submit` or `cancel` their input by pressing the relevant button.

```js
// abbreviation/abbreviationview.js

import {
    View,
    LabeledFieldView,
    createLabeledInputText,
    ButtonView                                      // ADDED
    } from '@ckeditor/ckeditor5-ui';
import { icons } from '@ckeditor/ckeditor5-core';   // ADDED

export default class FormView extends View {
	constructor( locale ) {
        // ...

        // Create the save and cancel buttons
        this.saveButtonView = this._createButton(
            t( 'Save' ), icons.check, 'ck-button-save', 'submit'
        );
		this.cancelButtonView = this._createButton(
            t( 'Cancel' ), icons.cancel, 'ck-button-cancel', 'cancel'
        );
	}

    _createInput( inputName ) {
        // ...
    }

    _createButton( label, icon, className, eventName ) {
		const button = new ButtonView( this.locale );

		button.set( {
			label,
			icon,
			tooltip: true
		} );

		button.extendTemplate( {
			attributes: {
				class: className
			}
		} );

        // Delegate button's target action to relevant event
		button.delegate( 'execute' ).to( this, eventName );

		return button;
	}
}
```
### Wrapping up the form view

We're almost done with our form view, we just need to add a couple of finishing touches.

In the `constructor`, create a {@link module:ui:viewcollection~ViewCollection} with {@link module:ui/view~View#createCollection `createCollection()`} method. We'll put all our input and button views in the collection, and use it to update the `FormView` template with its newly created children.

Let's also add `render()` method to our `FormView`.  We'll use there a helper {@link module:ui/bindings/submithandler~submitHandler `submitHandler()`} function, which intercepts a native DOM submit event, prevents the default web browser behavior (navigation and page reload) and fires the submit event on a view instead.

We also need a `focus()` method, which will focus on the first child, so our `abbreviation` input view each time the form is added to the editor. This is just a taste of what {@link framework/guides/deep-dive/focus-tracking focus tracking} can do in CKEditor 5, we'll go into it more in next part of this tutorial.

```js
// abbreviation/abbreviationview.js

import {
    View,
    LabeledFieldView,
    createLabeledInputText,
    ButtonView,
    submitHandler                                   // ADDED
    } from '@ckeditor/ckeditor5-ui';
import { icons } from '@ckeditor/ckeditor5-core';

export default class FormView extends View {
	constructor( locale ) {

        // ...

        this.childViews = this.createCollection( [
			this.abbrInputView,
			this.titleInputView,
			this.saveButtonView,
			this.cancelButtonView
		] );

		this.setTemplate( {
			tag: 'form',
			attributes: {
                // ...
			},
			children: this.childViews               // ADDED
		} );
	}

    render() {
        super.render();

        submitHandler( {
            view: this
        } );
    }

    focus() {
        this.childViews.first.focus();
    }

    _createInput( inputName ) {
        // ...
    }

    _createButton( label, icon, className, eventName ) {
        // ...
    }
}
```

Our `FormView` is done! We can't see it just yet, so let's add it to our `AbbreviationUI` class.

## Adding the Contextual Balloon

Our form needs to appear in a balloon, and we'll use the `ContextualBalloon` class from the CKEditor 5 UI library to make one.

This is where we ended up with our UI in the first part of the tutorial.

```js
// abbreviation/abbreviationui.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class AbbreviationUI extends Plugin {
	init() {
		const editor = this.editor;
		const { t } = editor.locale;

		editor.ui.componentFactory.add( 'abbreviation', locale => {
			const button = new ButtonView( locale );

			button.label = t( 'Abbreviation' );
			button.tooltip = true;
			button.withText = true;

			this.listenTo( button, 'execute', () => {
				const selection = editor.model.document.selection;
				const title = 'What You See Is What You Get';
				const abbr = 'WYSIWYG';

				editor.model.change( writer => {
					writer.insertText( abbr, { 'abbreviation': title }, selection.getFirstPosition() );

					for ( const range of selection.getRanges() ) {
						writer.remove( range );
					}
				} );
			} );

			return button;
		} );
	}
}
```
We'll need to change it quite a bit and add our `ContextualBalloon` and `FormView`. We'll need to make sure Contextual Balloon is required when making an instance of our `AbbreviationUI`, so let's start with that.

Let's write a very basic `_createFormView()` function, just to create an instance of our `FormView` class (we'll expand it later).

We also need to create a function, which will give us the target position for our balloon from user's selection. We need to convert selected view range into DOM range. We can use {@link module:engine/view/domconverter~DomConverter#viewRangeToDom `viewRangeToDom()` method} to do so.

Finally, let's add our balloon to the `init()` method, as well as our form view. We can now change what happens when we the user pushes the toolbar button. We'll replace inserting the hard-coded abbreviation with adding the view and the position to the balloon, and setting the focus on the form view.

```js
// abbreviation/abbreviationui.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui';             // ADDED
import FormView from './abbreviationview';                          // ADDED

class AbbreviationUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
        const editor = this.editor;
		const { t } = editor.locale;

        // Create the balloon and the form view.
		this._balloon = this.editor.plugins.get( ContextualBalloon );
		this.formView = this._createFormView();

		editor.ui.componentFactory.add( 'abbreviation', locale => {
            // ...

			// Show the form view on button click.
			this.listenTo( button, 'execute', () => {

                // Add the form view and the target position to the balloon.
				this._balloon.add( {
					view: this.formView,
					position: this._getBalloonPositionData()
				} );

                // Set a focus on the form view.
				this.formView.focus();
			} );

			return button;
		} );
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView( editor.locale );

		return formView;
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

        // Set a target position by converting view selection range to DOM
		target = () => view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

		return { target };
	}
}
```
You should be able to see your balloon and form now! Check and see your balloon pop up (we'll get to hiding it in a couple of steps). It should look like this:
SCREENSHOT

## Getting user input

It's time to get the user input for the abbreviation and the title. We'll use the same callback function we had in the toolbar button in the first part of the tutorial. We just need to replace the hard-coded "WYSIWYG" abbreviation with values from our input views.

```js
// abbreviation/abbreviationui.js
// ...

class AbbreviationUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
        // ...
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView( editor.locale );

		// Execute the command after clicking the "Save" button.
		this.listenTo( formView, 'submit', () => {
			const title = formView.titleInputView.fieldView.element.value;
			const abbr = formView.abbrInputView.fieldView.element.value;

			const selection = editor.model.document.selection;

			editor.model.change( writer => {
				writer.insertText( abbr, { 'abbreviation': title }, selection.getFirstPosition() );
				for ( const range of selection.getRanges() ) {
					writer.remove( range );
				}
			} );
		} );

		return formView;
	}

	_getBalloonPositionData() {
        // ...
	}
}
```
Our plugin is finally doing what it's supposed to. The last thing is to hide it from our editor when we don't need it.

## Hiding the form view

We'll need to hide the form view on three occasions:
* after the user submits the form;
* when the user clicks the "Cancel" button; and
* when the user clicks outside of the balloon.

So, let's write a simple `_hideFormView()` function, which will clear the input field values and remove the view from our balloon.

Additionally, we'll import {@link module:ui/bindings/clickoutsidehandler~clickOutsideHandler `clickOutsideHandler()`} method, which take our `_hideFormView()` function as a callback. It will be emitted from our form view, and activated when the form view is visible. We also need to set `contextElements` for the handler to determine its scope. Clicking on listed there HTML elements will not fire the callback.

```js
// abbreviation/abbreviationui.js

// ...
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui'; // ADDED

class AbbreviationUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
        // ...
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView( editor.locale );

        this.listenTo( formView, 'submit', () => {
            // ...

            // Hide the form view after submit.
			this._hideFormView();
		} );

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo( formView, 'cancel', () => {
			this._hideFormView();
		} );

        // Hide the form view when clicking outside the balloon.
		clickOutsideHandler( {
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideFormView()
		} );

		return formView;
	}

	_hideFormView() {
		this.formView.abbrInputView.fieldView.element.value = '';
		this.formView.titleInputView.fieldView.element.value = '';

		this._balloon.remove( this.formView );
	}

	_getBalloonPositionData() {
        // ...
	}
}
```
That's it for this part of the tutorial! We have a working UI, and our plugin does what we want it to do. We can improve it according to our best practices, adding {@link framework/guides/architecture/core-editor-architecture#commands a command}, focus tracking, and more. We'll do it in {@link framework/guides/simple-plugin-tutorial/abbreviation-plugin-level-3 the third part of the tutorial}, so head there.

## Demo

{@snippet framework/abbreviation-level-2}

## Final code

If you got lost at any point, this is the final implementation of the plugin.
