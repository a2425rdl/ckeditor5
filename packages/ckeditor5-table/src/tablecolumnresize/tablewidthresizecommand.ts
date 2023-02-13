/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/tablecolumnresize/tablewidthresizecommand
 */

import type { Element } from 'ckeditor5/src/engine';
import type { Editor } from 'ckeditor5/src/core';

import TablePropertyCommand from '../tableproperties/commands/tablepropertycommand';

export default class TableWidthResizeCommand extends TablePropertyCommand {
	/**
	 * Creates a new `TableWidthResizeCommand` instance.
	 *
	 * @param editor An editor in which this command will be used.
	 * @param defaultValue The default value of the attribute.
	 */
	constructor( editor: Editor, defaultValue?: string ) {
		// We create a custom command instead of using the existing `TableWidthCommand`
		// as we also need to change the `columnWidths` property and running both commands
		// separately would make the integration with Track Changes feature more troublesome.
		super( editor, 'tableWidth', defaultValue );
	}

	/**
	 * @inheritDoc
	 */
	public override refresh(): void {
		// The command is always enabled as it doesn't care about the actual selection - table can be resized
		// even if the selection is elsewhere.
		this.isEnabled = true;
	}

	/**
	 * Changes the `tableWidth` and `columnWidths` attribute values for the given or currently selected table.
	 *
	 * @param options.tableWidth The new table width. If skipped, the model attribute will be removed.
	 * @param options.columnWidths The new table column widths. If skipped, the model attribute will be removed.
	 * @param options.table The table that is affected by the resize.
	 */
	public override execute(
		options: {
			tableWidth?: string;
			columnWidths?: string;
			table?: Element;
		} = {}
	): void {
		const model = this.editor.model;
		const table = options.table || model.document.selection.getSelectedElement()!;
		const { tableWidth, columnWidths } = options;

		model.change( writer => {
			if ( tableWidth ) {
				writer.setAttribute( this.attributeName, tableWidth, table );
			} else {
				writer.removeAttribute( this.attributeName, table );
			}

			if ( columnWidths ) {
				writer.setAttribute( 'columnWidths', columnWidths, table );
			} else {
				writer.removeAttribute( 'columnWidths', table );
			}
		} );
	}
}

declare module '@ckeditor/ckeditor5-core' {

	interface CommandsMap {
		resizeTableWidth: TableWidthResizeCommand;
	}
}
