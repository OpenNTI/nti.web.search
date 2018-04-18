import EventEmitter from 'events';

import Logger from '@nti/util-logger';

const log = Logger.get('web:search:store');

const DEFAULT = 'default';

export default class SearchProviderStore extends EventEmitter {
	static getGlobal () {
		return this.getForScope('GlobalSearch');
	}

	static getForScope (name) {
		this._instances = this._instances || {};

		this._instances[name] = this._instances[name] || new SearchProviderStore(name);

		return this._instances[name];
	}


	constructor (name) {
		super();

		this._name = name;
		this._searchTerms = {};

		this._history = null;
		this._contexts = [];
	}


	get searchTerm () {
		return this._searchTerms[this.contextID || DEFAULT];
	}


	get changing () {
		return this._termChanging;
	}


	get context () {
		const context = this._contexts[0];

		return context && context.label;
	}

	get contextID () {
		const context = this._contexts[0];

		return context && context.id;
	}


	get hasContext () {
		return this._contexts.length > 0;
	}


	get (key) {
		return this[key];
	}

	/**
	 * Set the history object to bind the search to.
	 * Should come from https://github.com/ReactTraining/history
	 *
	 * @param {Object} history the history to bind search to
	 * @return {undefined}
	 */
	setHistory (history) {
		if (this._history === history) { return; }

		if (this._unsubscribeFromHistory) {
			this._unsubscribeFromHistory();
		}

		this._history = history;
		this._unsubscribeFronHistory = history.listen(this.onHistoryChange);

		this.onHistoryChange(history.location);
	}


	onHistoryChange = (location) => {
		const {state} = location;
		const searchTerm = (state || {})[this._name];

		if (this._searchTerm !== searchTerm) {
			this._searchTerm = searchTerm;
			this.emitChange('searchTerm');
		}
	}


	setTerm (term) {
		if (term === this._searchTerm) { return; }

		this._searchTerms[this.contextID || DEFAULT] = term;
		this.emitChange('searchTerm');


		if (this._history) {
			this._history.replace({
				...this._history.location,
				state: {
					[this._name]: term
				}
			});
		}
	}


	addContext (id, label) {
		const exists = this._contexts.some(context => context.id === id);

		if (!exists) {
			this._contexts = [{id, label}, ...this._contexts];
		}

		if (this._contexts.length > 1) {
			log.warn('More than one context active. We will just take the first one');
		}

		this.emitChange('context', 'searchTerm');
	}


	removeContext (id, label) {
		this._contexts = this._contexts.filter(context => context.id !== id);
		this.emitChange('context', 'searchTerm');
	}


	emitChange (type) {
		this.emit('change', {type});
	}


	addChangeListener (fn) {
		this.addListener('change', fn);
	}


	removeChangeListener (fn) {
		this.removeListener('change', fn);
	}
}
