const TABLE_CONTAINER_ID = 'USER_TABLE_CONTAINER';
const USER_TABLE_ROW_TEMPLATE_ID = 'USER_TABLE_ROW_TEMPLATE';
const NEW_USER_FORM_TEMPLATE_ID = 'NEW_USER_FORM_TEMPLATE';
const NEW_USER_FORM_CONTAINER_ID = 'NEW_USER_FORM_CONTAINER';
const NEW_USER_FORM_NAME_INPUT_ID = 'NEW_USER_FORM_NAME_INPUT';
const NEW_USER_FORM_PHONE_INPUT_ID = 'NEW_USER_FORM_PHONE_INPUT';
const NEW_USER_FORM_ADD_BUTTON_ID = 'NEW_USER_FORM_ADD_BUTTON';

const PHONE_NUMBER_REGEXP = /^(\+|\d{1})(\d|\-)*$/;

// const API_URL = '/api/';

/**
 * Состояние строки
 */
const rowState = {
	view: 'view',
	edit: 'edit',
};

/**
 * Валидация имени в соответствием с регвыром
 * @param name строка с именем
 * @return {boolean} результат валидации: true - валидация прошла успешно
 */
const validateName = (name) => {
	if (name && name.length > 0) {
		return true;
	} else {
		return false;
	}
};

/**
 * Валидация номера телефона в соответствием с регвыром
 * @param phone строка с номером телефона
 * @return {boolean} результат валидации: true - валидация прошла успешно
 */
const validatePhone = (phone) => {
	if (phone) {
		return PHONE_NUMBER_REGEXP.test(phone);
	} else {
		return false;
	}
};

/**
 * Объект представления строки с данными пользователя и кнопками управления
 */
const UserRowView = Backbone.View.extend({
	template: _.template(document.getElementById(USER_TABLE_ROW_TEMPLATE_ID).innerHTML),

	events: {
		'click .edit-button': 'changeState',
		'click .delete-button': 'deleteRow',
		'input input': 'onInput',
	},

	initialize: function () {
		this.nameInputId = Math.random().toString().slice(2);
		this.phoneInputId = Math.random().toString().slice(2);
		this.modelValid = true;
	},

	/**
	 * Обработчик события удаления строки с данными
	 */
	deleteRow: function () {
		this.remove();
		userCollection.remove(this.model);
		// this.model.sync('delete');
	},

	/**
	 * Обработчик события ввода новых данных
	 */
	onInput: function (ev) {
		if (ev.target.id === this.nameInputId) {
			const newUserName = ev.target.value;
			this.model.set('username', newUserName || "''");
		} else if (ev.target.id === this.phoneInputId) {
			const newUserPhone = ev.target.value;
			this.model.set('userphone', newUserPhone || "''");
		}
	},

	/**
	 * Обработчик события смены состояния с просмотра на редактирование
	 */
	changeState: function () {
		const currentState = this.model.get('state');
		let newState;
		if (currentState === rowState.edit) {
			if (this.model.isValid()) {
				this.modelValid = true;
				newState = rowState.view;
				const newName = document.getElementById(this.nameInputId).value || "''";
				const newPhone = document.getElementById(this.phoneInputId).value || "''";
				this.model.set('username', newName);
				this.model.set('userphone', newPhone);
				// this.model.sync('patch');
			} else {
				this.modelValid = false;
			}
		} else {
			newState = rowState.edit;
		}
		this.model.set('state', newState);
		this.render();
	},

	render: function () {
		const state = this.model.get('state');
		const name = this.model.get('username');
		const phone = this.model.get('userphone');
		const nameInputId = this.nameInputId;
		const phoneInputId = this.phoneInputId
		this.el.innerHTML = this.template({
			name,
			phone,
			state,
			nameInputId,
			phoneInputId,
			modelValid: this.modelValid
		});
		return this;
	}
});

/**
 * Рендерит строку с данными пользователя и кнопками управления на страницу
 */
const renderUserRowInHtml = (userRowModel) => {
	const tableContainerElement = document.getElementById(TABLE_CONTAINER_ID);
	if (tableContainerElement) {
		const userRowView = new UserRowView({
			model: userRowModel
		});
		tableContainerElement.appendChild(userRowView.render().el);
	}
};

/**
 * Объект модели строки с данными пользователя и кнопками управления
 */
const UserRowModel = Backbone.Model.extend({
	defaults: {
		username: "''",
		userphone: "''",
		state: rowState.view,
	},

	validate: function(attrs) {
		const isPhoneValid = validatePhone(attrs.userphone);
		const isPasswordValid = validateName(attrs.username);
		if (!isPhoneValid || !isPasswordValid) {
			return 'Форма изменена некорректно';
		}
	},
});

/**
 * Объект коллекции пользователей
 */
const UserCollection = Backbone.Collection.extend({
	model: UserRowModel,

	// url: `${API_URL}/users`,

	initialize: function (models) {
		if (models && models.length) {
			models.forEach(model => {
				renderUserRowInHtml(model);
			});
		};
	},

	push: function (model) {
		this.models.push(model);
		renderUserRowInHtml(model);
	},
});

// const userCollection = new UserCollection().fetch();

/**
 * Экземпляр коллекции пользователей
 */
const userCollection = new UserCollection([
	new UserRowModel({
		username: 'Иван',
		userphone: '+7-912-111-55-33'
	}),
	new UserRowModel({
		username: 'Петр',
		userphone: '8-912-222-55-33'
	}),
	new UserRowModel({
		username: 'Александр',
		userphone: '8-912-333-55-33'
	}),
	new UserRowModel({
		username: 'Павел',
		userphone: '+7-912-444-55-33'
	}),
	new UserRowModel({
		username: 'Сергей',
		userphone: '+7-912-555-55-33'
	}),
]);

/**
 * Объект модели формы добавления нового пользователя
 */
const NewUserFormModel = Backbone.Model.extend({
	defaults: {
		username: "''",
		userphone: "''",
	},

	validate: function(attrs) {
		const isPhoneValid = validatePhone(attrs.userphone);
		const isPasswordValid = validateName(attrs.username);
		if (!isPhoneValid || !isPasswordValid) {
			return 'Форма заполнена некорректно';
		}
	},
});

/**
 * Объект представления формы добавления нового пользователя
 */
const NewUserFormView = Backbone.View.extend({
	template: _.template(document.getElementById(NEW_USER_FORM_TEMPLATE_ID).innerHTML),

	initialize: function () {
		this.modelValid = true;
	},

	events: {
		'input #NEW_USER_FORM_NAME_INPUT': 'inputNewName',
		'input #NEW_USER_FORM_PHONE_INPUT': 'inputNewPhone',
		'click input:button': 'addNewUser',
	},

	/**
	 * Обработчик события ввода в поле name
	 */
	inputNewName: function () {
		const newUserName = document.getElementById(NEW_USER_FORM_NAME_INPUT_ID).value;
		this.model.set('username', newUserName, {validate: true});
	},
	
	/**
	 * Обработчик события ввода в поле phone
	 */
	inputNewPhone: function () {
		const newUserPhone = document.getElementById(NEW_USER_FORM_PHONE_INPUT_ID).value;
		this.model.set('userphone', newUserPhone, {validate: true});
	},

	/**
	 * Обработчик нажатия на кнопку добавления нового пользователя
	 */
	addNewUser: function () {
		if (this.model.isValid()) {
			this.modelValid = true;
			userCollection.push(new UserRowModel({
				username: this.model.get('username'),
				userphone: this.model.get('userphone'),
			}));
			this.model.set('username', "''");
			this.model.set('userphone', "''");
		} else {
			this.modelValid = false;
		}
		this.render();
	},

	render: function () {
		this.el.innerHTML = this.template({
			model: this.model.attributes,
			modelValid: this.modelValid,
		});
		return this;
	},
});

/**
 * Рендерит форму для добавления нового пользователя
 */
const renderNewUserFormInHtml = () => {
	const newUserFormContainerElement = document.getElementById(NEW_USER_FORM_CONTAINER_ID);
	if (newUserFormContainerElement) {
		const newUserFormModel = new NewUserFormModel();
		const newUserFormView = new NewUserFormView({
			model: newUserFormModel,
		});
		newUserFormContainerElement.appendChild(newUserFormView.render().el);
	}
};

window.onload = (() => {
	renderNewUserFormInHtml();
});