import { IMetaStoreState } from './MetaTypes';
import { INotepadsStoreState, INoteStoreState } from './NotepadTypes';

export interface IStoreState {
	readonly meta: IMetaStoreState;
	readonly notepads: INotepadsStoreState;
	readonly currentNote: INoteStoreState;
}

export const APP_NAME = 'µPad';
export const SYNC_NAME = 'µSync';
export const MICROPAD_URL = 'https://getmicropad.com';
