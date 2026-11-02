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
		// Находим элемент .js-tab-nav внутри .header-nav и .header-holder
		let slideXsOnly = document.querySelector('.header-holder');
		// Проверяем, что элемент существует и что div’ы ещё не добавлены
		if (slideXsOnly && !document.querySelector('#two-section-header')) {
			let newDivs = `
			<nav class="header-nav js-tab-nav" id="two-section-header" style="justify-content: center; display: flex !important;">
					<a href="https://ficbook.net/home/addfic" class="header-nav-item" rel="nofollow"><svg class="svg-icon ic_add-work text-t2">
							<use href="/assets/icons/icons-sprite12.svg#ic_add-work"></use>
						</svg> Добавить фанфик</a>
					<a href="https://ficbook.net/find" class="header-nav-item" rel="nofollow"><svg class="svg-icon ic_search text-t2">
							<use href="/assets/icons/icons-sprite12.svg#ic_search"></use>
						</svg> Поиск фанфиков</a>
					<a href="https://ficbook.net/randomfic" class="header-nav-item" rel="nofollow"><svg data-v-68167133-s="" class="svg-icon ic_dice" viewBox="0 0 16 16"><path d="M11.3 0H4.7A4.7 4.7 0 0 0 0 4.7v6.6C0 13.9 2.1 16 4.7 16h6.6c2.6 0 4.7-2.1 4.7-4.7V4.7C16 2.1 13.9 0 11.3 0zm3.38 11.3a3.39 3.39 0 0 1-3.39 3.38H4.71a3.39 3.39 0 0 1-3.4-3.39V4.71a3.39 3.39 0 0 1 3.4-3.4h6.58a3.39 3.39 0 0 1 3.4 3.4v6.58z"></path><circle cx="4.84" cy="4.84" r="1.08"></circle><circle cx="11.29" cy="4.84" r="1.08"></circle><circle cx="11.29" cy="11.24" r="1.08"></circle><circle cx="4.84" cy="11.24" r="1.08"></circle><circle cx="8.07" cy="8.03" r="1.08"></circle></svg>
						</svg> Случайная работа</a>
					<div class="social-top">

						<a href="https://t.me/ficbook_official" target="_blank" rel="nofollow"><svg class="svg-icon ic_telegram ">
								<use href="/assets/icons/icons-sprite12.svg#ic_telegram"></use>
							</svg></a>
						<a href="http://vk.com/ficbooknet" target="_blank" rel="nofollow"><svg class="svg-icon ic_vk ">
								<use href="/assets/icons/icons-sprite12.svg#ic_vk"></use>
							</svg></a>
						<a href="https://www.youtube.com/channel/UCbtVE1EkJhiaeO1jD2P7lQg" target="_blank" rel="nofollow"><svg
								class="svg-icon ic_youtube ">
								<use href="/assets/icons/icons-sprite12.svg#ic_youtube"></use>
							</svg></a>
					</div>
			</nav>
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
			let headerNav = document.querySelector('.header-nav');
			if (headerNav) {
				headerNav.style.cssText += `
					display: flex !important;
					justify-content: center;
				`;
			}
			//document.querySelectorAll('.header-nav .header-nav-item').forEach(item => {
			//	item.style.cssText += `
			//		font-size: 16px;
			//	`;
			//});
			let firstLink = document.querySelector('.header-holder .header-nav:first-child a[href*="/home/addfic"]');
			if (firstLink) {
				firstLink.style.display = 'none';
			}
			console.log('Div’и добавлены в .slide.slide-xs-only!');
		}
	}

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
