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

			console.log('Div’ы добавлены в book-inner!');
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

	function addTwoSectionHeaderDivs() {
		let slideXsOnly = document.querySelector('.slide.slide-xs-only');
		// Проверяем, что элемент существует и что div’ы ещё не добавлены
		if (slideXsOnly && !document.querySelector('#two-section-header')) {
			let newDivs = `
			<ul class="nav navbar-nav" id="two-section-header">
				<li>
					<a href="https://ficbook.net/home/addfic" rel="nofollow"><svg class="svg-icon ic_add-work text-t2">
							<use href="/assets/icons/icons-sprite10.svg#ic_add-work"></use>
						</svg> Добавить фанфик</a>
				</li>
				<li>
					<a href="https://ficbook.net/find" rel="nofollow"><svg class="svg-icon ic_search text-t2">
							<use href="/assets/icons/icons-sprite10.svg#ic_search"></use>
						</svg> Поиск фанфиков</a>
				</li>
				<li>
					<a href="https://ficbook.net/randomfic" rel="nofollow"><svg class="svg-icon ic_dice text-t2">
							<use href="/assets/icons/icons-sprite10.svg#ic_dice"></use>
						</svg> Случайная работа</a>
				</li>
				<li>
					<div class="social-top">

						<a href="https://t.me/ficbook_official" target="_blank" rel="nofollow"><svg class="svg-icon ic_telegram ">
								<use href="/assets/icons/icons-sprite10.svg#ic_telegram"></use>
							</svg></a>
						<a href="http://vk.com/ficbooknet" target="_blank" rel="nofollow"><svg class="svg-icon ic_vk ">
								<use href="/assets/icons/icons-sprite10.svg#ic_vk"></use>
							</svg></a>
						<a href="https://www.youtube.com/channel/UCbtVE1EkJhiaeO1jD2P7lQg" target="_blank" rel="nofollow"><svg
								class="svg-icon ic_youtube ">
								<use href="/assets/icons/icons-sprite10.svg#ic_youtube"></use>
							</svg></a>
					</div>
				</li>
			</ul>
			`;			
			// Вставляем в конец элемента .slide.slide-xs-only (можно изменить позицию, используя другие методы, если необходимо)
			slideXsOnly.insertAdjacentHTML('beforeend', newDivs);

			// Добавить стили для .social-top (не в head, в атрибут style элемента .social-top)
			let socialTop = document.querySelector('.social-top');
			if (socialTop) {
				socialTop.style.cssText += `
					align-items: center;
					gap: var(--gap-12);
					margin: 0 var(--gap-16);
					line-height: 1em;
					display: flex;
				`;
			}
			console.log('Div’и добавлены в .slide.slide-xs-only!');
		}
	}

	/*
	.social-top {
    align-items: center;
    gap: var(--gap-12);
    margin: 0 var(--gap-16);
    line-height: 1em;
    display: flex;
}
 */

	addBookInnerDivs();
	addBookContainerDivs();
	addTwoSectionHeaderDivs();

	// Устанавливаем MutationObserver на document.documentElement (всего документа)
	let observer = new MutationObserver(() => {
		addBookInnerDivs();
		addBookContainerDivs();
		addTwoSectionHeaderDivs();
	});
	observer.observe(document.documentElement, { childList: true, subtree: true });

	let attempts = 0;
	let interval = setInterval(() => {
		attempts++;
		addBookInnerDivs();
		addBookContainerDivs();
		addTwoSectionHeaderDivs();
		// Если элемент найден или число попыток превысило лимит, останавливаем поллинг
		if (document.querySelector('.book-inner') || attempts > 50) {
			clearInterval(interval);
		}
	}, 1);
})();
