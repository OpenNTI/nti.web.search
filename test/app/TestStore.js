import EventEmitter from 'events';

export default class TestSearchStore extends EventEmitter {
	constructor () {
		super();

		this.store = [];

		for (let i = 0; i < 100; i += 1) {
			this.store.push(i.toString());
		}

		this.items = [...this.store];
	}


	updateSearchTerm (term) {
		this.items = this.store.filter(x => x.indexOf(term) > -1);
		this.emit('change', {type: 'items'});
	}


	get (key) { return this[key]; }


	addChangeListener (fn) {
		this.addListener('change', fn);
	}

	removeChangeListener (fn) {
		this.removeListener('change', fn);
	}
}
