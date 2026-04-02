
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
	// --- ВКЛАДКИ ---
	const tabs = document.querySelectorAll('.tab-btn');
	const contents = document.querySelectorAll('.tab-content');

	// --- ФУНКЦИЯ АКТИВАЦИИ ---
	function activateTab(tabId) {
		// Сначала удаляем класс 'active' у всех кнопок и контента
		tabs.forEach(b => b.classList.remove('active'));
		contents.forEach(c => c.classList.remove('active'));

		// Затем добавляем класс 'active' только для выбранной вкладки и её контента
		const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
		const content = document.getElementById(tabId);

		if (btn && content) {
			btn.classList.add('active');
			content.classList.add('active');
		}
	}

	// --- ВКЛАДКИ ---
	tabs.forEach(btn => {
		btn.addEventListener('click', () => {
			const tabId = btn.dataset.tab;

			activateTab(tabId);

			chrome.storage.local.set({ activeTab: tabId });
		});
	});

	// ✅ ВОССТАНОВЛЕНИЕ вкладки
	chrome.storage.local.get('activeTab', ({ activeTab }) => {
		if (activeTab) {
			activateTab(activeTab);
		}
	});

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