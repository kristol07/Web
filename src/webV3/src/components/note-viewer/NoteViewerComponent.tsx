import * as React from 'react';
import './NoteViewerComponent.css';
import { INote, NoteElement } from '../../types/NotepadTypes';
import NoteElementComponent from './elements/NoteElementComponent';
import * as Materialize from 'materialize-css/dist/js/materialize.js';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { IInsertElementState } from '../../reducers/NoteReducer';
import InsertElementComponent from '../../containers/InsertElementContainer';

export interface INoteViewerComponentProps {
	isFullscreen: boolean;
	note?: INote;
	elementEditing: string;
	noteAssets: object;
	isNotepadOpen: boolean;
	edit?: (id: string) => void;
	search?: (query: string) => void;
	downloadAsset?: (filename: string, uuid: string) => void;
	updateElement?: (id: string, changes: NoteElement, newAsset?: Blob) => void;
	toggleInsertMenu?: (opts: Partial<IInsertElementState>) => void;
	deleteElement?: (id: string) => void;
}

export default class NoteViewerComponent extends React.Component<INoteViewerComponentProps> {
	private viewerDiv: HTMLDivElement;
	private containerDiv: HTMLDivElement;
	private escapeHit$: Observable<number>;

	constructor(props: INoteViewerComponentProps) {
		super(props);

		this.escapeHit$ = fromEvent(document, 'keyup')
			.pipe(
				map((event: KeyboardEvent) => event.keyCode),
				filter(keyCode => keyCode === 27)
			);
	}

	render() {
		const { isFullscreen, note, noteAssets, search, downloadAsset, elementEditing, edit, updateElement, deleteElement } = this.props;

		const classes: string = (!note || note.elements.length === 0) ? 'empty' : '';
		let styles = {};

		if (isFullscreen) styles = {
			...styles,
			width: '100vw'
		};

		const containerStyles = {
			minWidth: '100%',
			minHeight: '100%',
			position: 'relative' as 'relative'
		};

		const elements: JSX.Element[] = [];
		if (!!note) note.elements.forEach(element => elements.push(
			<NoteElementComponent
				key={`${note.internalRef}-${element.args.id}`}
				element={element}
				noteAssets={noteAssets}
				edit={edit!}
				deleteElement={deleteElement!}
				search={search!}
				updateElement={updateElement}
				downloadAsset={downloadAsset}
				elementEditing={elementEditing} />
		));

		if (!!note && elements.length === 0) Materialize.toast('Welcome to your note! Press anywhere on here to insert an element.', 3000);

		return (
			<div id="note-viewer" className={classes} style={styles} ref={div => this.viewerDiv = div!} onClick={this.handleEmptyClick}>
				{!!note && <InsertElementComponent />}
				<div id="note-container" style={containerStyles} ref={div => this.containerDiv = div!}>
					{elements}
				</div>
			</div>
		);
	}

	componentDidMount() {
		const { edit } = this.props;

		this.escapeHit$.subscribe(() => edit!(''));
	}

	private handleEmptyClick = (event) => {
		const { note, edit, elementEditing, toggleInsertMenu, isNotepadOpen } = this.props;
		if ((event.target !== this.viewerDiv && event.target !== this.containerDiv)) return;

		if (!note) {
			if (isNotepadOpen) {
				// Flash the Notepad Explorer amber
				const explorer = document.getElementById('notepad-explorer')!;
				explorer.style.backgroundColor = '#ffb300';
				setTimeout(() => explorer.style.backgroundColor = '#607d8b', 100);
			} else {
				// Flash notepads drop-down
				const explorer = document.getElementById('notepad-dropdown')!;
				explorer.style.backgroundColor = '#ffb300';
				setTimeout(() => explorer.style.backgroundColor = '#607d8b', 100);
			}

			return;
		}

		if (elementEditing.length === 0) {
			// Insert a new element
			toggleInsertMenu!({
				x: event.clientX,
				y: event.clientY - 128
			});
		} else {
			edit!('');
		}
	}
}
