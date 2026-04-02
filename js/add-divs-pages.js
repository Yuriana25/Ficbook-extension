(function () {
	'use strict';
	function addBookInnerDivs() {
		let bookInner = document.querySelector('.book-inner');
		// Если контейнер существует и div’ы ещё не добавлены
		if (bookInner && !document.querySelector('.pages')) { // Проверяем, чтобы не дублировать
			// Скрываем контейнер, чтобы изменения не вызывали мерцание
			bookInner.style.visibility = 'hidden';

			let newDivs =
				'<div class="pages left-1"></div><div class="pages left-2"></div><div class="pages right-1"></div><div class="pages right-2"></div>';

			bookInner.insertAdjacentHTML('afterbegin', newDivs);

			// Немного задержка или принудительный reflow может помочь (необязательно)
			// bookInner.offsetHeight; // принудительный reflow

			// Возвращаем видимость
			bookInner.style.visibility = 'visible';

			console.log('Div’ы добавлены!');
		}
	}

	// Нова функція для додавання додаткових div’ів у .book-container
	function addBookContainerDivs() {
		let bookContainer = document.querySelector('.book-container');
		// Перевіряємо наявність контейнера та щоб елемент з класом book-stiches-horizontal ще не існував
		if (bookContainer && !document.querySelector('.book-stiches-horizontal')) {
			let newDivs =
				'<div class="book-stiches-horizontal hidden-xs"></div>' +
				'<div class="book-stiches-vertical hidden-xs"></div>' +
				'<div class="book-corner-top hidden-xs"></div>' +
				'<div class="book-corner-bottom hidden-xs"></div>';

			// Вставляємо в кінець контейнера (можна змінити позицію, використовуючи інші методи, якщо необхідно)
			bookContainer.insertAdjacentHTML('afterbegin', newDivs);

			console.log('Div’и додані у .book-container!');
		}
	}

	addBookInnerDivs();
	addBookContainerDivs();

	// Устанавливаем MutationObserver на document.documentElement (всего документа)
	let observer = new MutationObserver(() => {
		addBookInnerDivs();
		addBookContainerDivs();
	});
	observer.observe(document.documentElement, { childList: true, subtree: true });

	let attempts = 0;
	let interval = setInterval(() => {
		attempts++;
		addBookInnerDivs();
		addBookContainerDivs();
		// Если элемент найден или число попыток превысило лимит, останавливаем поллинг
		if (document.querySelector('.book-inner') || attempts > 50) {
			clearInterval(interval);
		}
	}, 1);
})();
