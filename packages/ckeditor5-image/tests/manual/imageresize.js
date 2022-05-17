/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global document, console, window, CKEditorInspector */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import ArticlePluginSet from '@ckeditor/ckeditor5-core/tests/_utils/articlepluginset';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import ImageResize from '../../src/imageresize';
import ImageUpload from '../../src/imageupload';

import { CS_CONFIG } from '@ckeditor/ckeditor5-cloud-services/tests/_utils/cloud-services-config';

const commonConfig = {
	plugins: [
		ArticlePluginSet,
		ImageResize,
		ImageUpload,
		Indent,
		IndentBlock,
		CloudServices,
		EasyImage
	],
	toolbar: [ 'heading', '|', 'bold', 'italic', 'link',
		'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo', 'outdent', 'indent' ],
	image: {
		toolbar: [ 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'toggleImageCaption', 'resizeImage' ]
	},
	table: {
		contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ],
		tableToolbar: [ 'bold', 'italic' ]
	},
	cloudServices: CS_CONFIG
};

( async function initTest() {
	window.basicEditor = await ClassicEditor
		.create( document.querySelector( '#editor' ), commonConfig )
		.catch( err => {
			console.error( err.stack );
		} );

	window.fancyEditor = await ClassicEditor
		.create( document.querySelector( '#fancy-editor' ), commonConfig )
		.catch( err => {
			console.error( err.stack );
		} );

	window.editorOtherUnits = await ClassicEditor
		.create( document.querySelector( '#editor-other-units' ), commonConfig )
		.catch( err => {
			console.error( err.stack );
		} );

	CKEditorInspector.attach( {
		basic: window.basicEditor,
		fancy: window.fancyEditor,
		'other units': window.editorOtherUnits
	} );
}() );
