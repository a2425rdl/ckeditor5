/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals document */

import ClassicTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/classictesteditor.js';
import SpecialCharacters from '../src/specialcharacters.js';
import SpecialCharactersText from '../src/specialcharacterstext.js';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils.js';

describe( 'SpecialCharactersText', () => {
	testUtils.createSinonSandbox();

	let editor, editorElement, addItemsSpy, addItemsFirstCallArgs;

	beforeEach( () => {
		editorElement = document.createElement( 'div' );

		addItemsSpy = sinon.spy( SpecialCharacters.prototype, 'addItems' );

		document.body.appendChild( editorElement );
		return ClassicTestEditor
			.create( editorElement, {
				plugins: [ SpecialCharacters, SpecialCharactersText ]
			} )
			.then( newEditor => {
				editor = newEditor;
				addItemsFirstCallArgs = addItemsSpy.args[ 0 ];
			} );
	} );

	afterEach( () => {
		addItemsSpy.restore();

		editorElement.remove();
		return editor.destroy();
	} );

	it( 'adds new items', () => {
		expect( addItemsSpy.callCount ).to.equal( 1 );
	} );

	it( 'properly names the category', () => {
		expect( addItemsFirstCallArgs[ 0 ] ).to.equal( 'Text' );
	} );

	it( 'defines a label displayed in the toolbar', () => {
		expect( addItemsFirstCallArgs[ 2 ] ).to.deep.equal( {
			label: 'Text'
		} );
	} );

	it( 'adds proper characters', () => {
		expect( addItemsFirstCallArgs[ 1 ] ).to.deep.include( {
			character: '…',
			title: 'Horizontal ellipsis'
		} );

		expect( addItemsFirstCallArgs[ 1 ] ).to.deep.include( {
			character: '“',
			title: 'Left double quotation mark'
		} );
	} );
} );
