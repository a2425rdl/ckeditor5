menu-title: Installation
meta-title: Lists intallation | CKEditor 5 Documentation
category: features-lists
order: 40
modified_at: 2023-09-08
---

# Installation

<info-box info>
	There are currently two plugins providing list support for CKEditor&nbsp;5: the regular {@link features/lists lists feature} and the {@link features/legacy-lists legacy lists feature}. Refer to that guide for legacy lists installation information.

	The lists feature is enabled by default in all {@link installation/getting-started/predefined-builds predefined builds}. The installation instructions are for developers interested in building their own, custom rich text editor.
</info-box>

## Ordered and unordered lists installation

### List feature

To add this feature to your editor, install the [`@ckeditor/ckeditor5-list`](https://www.npmjs.com/package/@ckeditor/ckeditor5-list) package:

```
npm install --save @ckeditor/ckeditor5-list
```

Then add the `DocumentList` plugin to your plugin list and the toolbar configuration:

```js
import { DocumentList } from '@ckeditor/ckeditor5-list';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ DocumentList, /* ... */ ],
		toolbar: [ 'bulletedList', 'numberedList', /* ... */ ]
	} )
	.then( /* ... */ )
	.catch( /* ... */ );
```

### List properties

To enable the list properties feature for document lists, install the [`@ckeditor/ckeditor5-list`](https://www.npmjs.com/package/@ckeditor/ckeditor5-list) package:

```
npm install --save @ckeditor/ckeditor5-list
```

Then add the `DocumentListProperties` plugin to your plugin list and configure the toolbar. To enable selected sub-features of the list properties, you need to add their configuration to your editor (set `true` for each feature you want to enable):

```js
import { DocumentListProperties } from '@ckeditor/ckeditor5-list';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ DocumentListProperties, /* ... */ ],
		toolbar: [ 'bulletedList', 'numberedList', /* ... */ ],
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		}
	} )
	.then( /* ... */ )
	.catch( /* ... */ );
```

<info-box info>
	Read more about {@link installation/plugins/installing-plugins installing plugins}.
</info-box>

<info-box warning>
	The {@link module:list/documentlistproperties~DocumentListProperties} feature overrides UI button implementations from the {@link module:list/list/listui~ListUI}.
</info-box>

## To-do lists installation

<info-box info>
	The to-do list feature is enabled by default in the {@link installation/getting-started/predefined-builds#superbuild superbuild} only.
</info-box>

To add this feature to your editor, install the [`@ckeditor/ckeditor5-list`](https://www.npmjs.com/package/@ckeditor/ckeditor5-list) package:

```bash
npm install --save @ckeditor/ckeditor5-list
```

Then add the `TodoList` plugin to your plugin list and the toolbar configuration:

```js
import { TodoList } from '@ckeditor/ckeditor5-list';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ TodoList, /* ... */ ],
		toolbar: [ 'todoList', /* ... */ ],
	} )
	.then( /* ... */ )
	.catch( /* ... */ );
```

<info-box info>
	Read more about {@link installation/plugins/installing-plugins installing plugins}.
</info-box>

## Simple lists

Add info.