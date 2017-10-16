import EventEmitter from 'events';

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
		this._searchTerm = '';

		this._history = null;
		this._activeContexts = [];
	}


	get searchTerm () {
		return this._searchTerm;
	}


	get changing () {
		return this._termChanging;
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
		if (!this._history) { throw new Error('Setting search term without binding to history'); }

		if (term === this._searchTerm) { return; }

		this._history.replace({
			...this._history.location,
			state: {
				[this._name]: term
			}
		});
	}


	setTermChanging (changing) {
		this._termChanging = changing;

		this.emitChange('changing');
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
