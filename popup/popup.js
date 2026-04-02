
// popup.js
const keys = [
	'bookCoverStyle',
	'searchFullScreenStyle',
	'commentsStyle',
	'removeBtnEndOfFic',
	'sidebarNavStyle',
	'headersPageStyle',
	'removePromo',
	'removeReaded',
	'addUnderlineFicTitles',
	'changeColorFont',
	'switch'
];


document.addEventListener('DOMContentLoaded', function () {
	// Массив с ключами, соответствующими id чекбоксов
	keys.forEach(key => {
		const checkbox = document.getElementById(key);
		// Загружаем текущее значение для данного ключа
		chrome.storage.local.get(key, function (data) {
			// Если значение не найдено – считаем, что оно false
			checkbox.checked = data[key] || false;
		});
		// При изменении значения сохраняем его в chrome.storage.local
		checkbox.addEventListener('change', function () {
			let update = {};
			update[key] = checkbox.checked;
			chrome.storage.local.set(update, () => {
				console.log(`Сохранено: ${key} = ${checkbox.checked}`);
			});
		});
	});
});

document.getElementById('checkAll').onclick = function () {
	keys.forEach(key => {
		const checkbox = document.getElementById(key);
		if (key != 'switch') {
			checkbox.checked = true;
			let update = {};
			update[key] = true;
			chrome.storage.local.set(update, () => {
				console.log(`Сохранено: ${key} = true`);
			});
		}
	});
};

document.getElementById('reset').onclick = function () {
	keys.forEach(key => {
		const checkbox = document.getElementById(key);
		if (key != 'switch') {
			checkbox.checked = false;
			let update = {};
			update[key] = false;
			chrome.storage.local.set(update, () => {
				console.log(`Сохранено: ${key} = false`);
			});
		}
	});
};