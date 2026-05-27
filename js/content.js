// content.js
// Вызываем очистку кэша при загрузке скрипта и обновляем стили
checkExtensionVersionAndClearCache(() => {
	// Получаем все настройки и кэшированные стили для каждого модуля
	chrome.storage.local.get(storageKeys, function (data) {
		updateAllModule(data);
	});
});

const MODULES = {
	bookCover: {
		toggle: 'bookCoverStyle',
		cache: 'cachedStyles_bookCover',
		update: updateBookCoverModule
	},
	searchFullScreen: {
		toggle: 'searchFullScreenStyle',
		cache: 'cachedStyles_searchFullScreen',
		update: updateSearchFullScreenModule
	},
	comments: {
		toggle: 'commentsStyle',
		cache: 'cachedStyles_comments',
		update: updateCommentsModule
	},
	removeBtn: {
		toggle: 'removeBtnEndOfFic',
		cache: 'cachedStyles_removeBtn',
		update: updateRemoveBtnModule
	},
	sidebarNavStyle: {
		toggle: 'sidebarNavStyle',
		cache: 'cachedStyles_sidebarNavStyle',
		update: updateSidebarNavModule
	},
	headersPageStyle: {
		toggle: 'headersPageStyle',
		cache: 'cachedStyles_headersPageStyle',
		update: updateHeadersPageModule
	},
	removePromo: {
		toggle: 'removePromo',
		cache: 'cachedStyles_removePromo',
		update: updateRemovePromoModule
	},
	removeReaded: {
		toggle: 'removeReaded',
		cache: 'cachedStyles_removeReaded',
		update: updateRemoveReadedModule
	},
	addUnderlineFicTitles: {
		toggle: 'addUnderlineFicTitles',
		cache: 'cachedStyles_addUnderlineFicTitles',
		update: updateAddUnderlineFicTitlesModule
	},
	changeColorFont: {
		toggle: 'changeColorFont',
		cache: 'cachedStyles_changeColorFont',
		update: updateChangeColorFontModule
	},
	backColorIndication: {
		toggle: 'backColorIndication',
		cache: 'cachedStyles_backColorIndication',
		update: updateBackColorIndicationModule
	}
};

// Глобальный массив ключей в кэше, со стилями и их состоянием
const storageKeys = [
	...Object.values(MODULES).flatMap(m => [m.toggle, m.cache]),
	'switch'
];

// Глобальный объект для хранения текущих модульных стилей
window.moduleStyles = Object.fromEntries(
	Object.keys(MODULES).map(key => [key, ''])
);

// Функция объединения модульных стилей
function combineModuleStyles() {
	return Object.values(window.moduleStyles)
		.filter(Boolean)
		.join("\n");
}

// Функция, которая вставляет объединённые стили в один <style> элемент
function applyCombinedStylesFromMemory() {
	let combinedCss = combineModuleStyles();
	let styleElement = document.getElementById('combined-styles') || createStyleElement();
	styleElement.textContent = combinedCss;
	console.log('✅ Объединённые стили применены из памяти:');
}

// Создаём элемент <style> для объединённых стилей
function createStyleElement() {
	const style = document.createElement('style');
	style.id = 'combined-styles';
	document.head.appendChild(style);
	return style;
}

// Функция для удаления объединённого <style> элемента
function removeStyles() {
	let existingStyle = document.getElementById('combined-styles');
	if (existingStyle) {
		existingStyle.remove();
		console.log('🗑️ Объединённые стили удалены');
	}
}

// Функция для вызова всех модулей и комбинируем css стили
function updateAllModule(data) {
	Object.entries(MODULES).forEach(([key, module]) => {
		module.update(data);
	});

	let combinedCss = combineModuleStyles();
	if (combinedCss && data.switch) {
		applyCombinedStylesFromMemory();
	} else {
		removeStyles();
		console.log('Расширение отключено (switch выключён)');
	}
}

// Функция для проверки версии расширения и очистки кэша при обновлении
function checkExtensionVersionAndClearCache(callback) {
	const currentVersion = chrome.runtime.getManifest().version;

	chrome.storage.local.get('extensionVersion', (data) => {
		const savedVersion = data.extensionVersion;

		// Если версия изменилась или её нет
		if (savedVersion !== currentVersion) {
			console.log('🔄 Обнаружена новая версия:', currentVersion);

			const cacheKeys = Object.values(MODULES).map(m => m.cache);

			chrome.storage.local.remove(cacheKeys, () => {
				chrome.storage.local.set({
					extensionVersion: currentVersion
				}, () => {
					console.log('✅ Кэш очищен');
					callback && callback();
				});
			});

		} else {
			callback && callback();
		}
	});
}

chrome.storage.local.get(storageKeys, function (data) {
	updateAllModule(data);
});

// Слушаем изменения настроек (например, при переключении чекбоксов)
chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName === 'local') {
		// Считываем все нужные ключи заново
		chrome.storage.local.get(storageKeys, function (data) {
			updateAllModule(data);
		});
	}
});


// ------------- МОДУЛЬ "Book Cover" -------------
// Функция для обновления модуля «Book Cover»
function updateBookCoverModule(data) {
	// Если модуль включён, проверяем кэш
	if (data.bookCoverStyle) {
		if (data.cachedStyles_bookCover) {
			window.moduleStyles.bookCover = data.cachedStyles_bookCover;
		} else {
			preloadAndCacheBookCoverStyle();
			// Пока кэш не готов, оставляем прежнее значение (или пустую строку)
		}
	} else {
		window.moduleStyles.bookCover = '';
	}
}

function preloadAndCacheBookCoverStyle() {
	console.log("🚀 preloadAndCacheBookCoverStyle() вызван");
	const imageUrls = {
		background: 'https://i.postimg.cc/8PpQyMqd/bg-pattern-e19bb1033abaf457954f.jpg',
		bookCover: 'https://i.postimg.cc/cCTjqkVR/pattern-7769d569e87602d7336b.jpg',
		corners: 'https://i.postimg.cc/yx75bCr6/corner-lt-c3ea5e603ad595db0f22.png'
	};
	const promises = Object.entries(imageUrls).map(([key, url]) =>
		fetch(url)
			.then(res => res.blob())
			.then(blob => new Promise(resolve => {
				const reader = new FileReader();
				reader.onloadend = () => resolve([key, reader.result]);
				reader.readAsDataURL(blob);
			}))
	);
	Promise.all(promises).then(results => {
		const cachedImages = Object.fromEntries(results);
		const generatedCss = generateBookCoverCss(cachedImages);
		chrome.storage.local.set({ cachedStyles_bookCover: generatedCss }, () => {
			window.moduleStyles.bookCover = generatedCss;
			applyCombinedStylesFromMemory();
			console.log("✅ cachedStyles_bookCover сохранён и применён");
		});
	});
}

function generateBookCoverCss(images) {
	return `
		/* Фон-стол */
		body:has(.js-modal-destination) {
		background: #e5dacc url(${images.background});
		}
		@media (max-width: 1309px) {
			.book-container {
				padding: 15px 40px !important;
			}
		}

		@media (max-width: 991px) {
			.book-container {
				padding: 15px 30px !important;
			}
		}

		@media (max-width: 767px) {
			.book-container {
				border-radius: 0 !important;
				padding: 0 !important;
				background-image: none !important;
			}
		}
		/* Острый край листа */
		.header-holder {
		border-radius: 0;
		}
		.book-container .book-inner {
		border-radius: 0;
		}
    /* Книжная обложка */
    .book-container {
      background: #442302 url(${images.bookCover}) repeat;
      border-radius: 10px;
      padding: 15px 60px;
      position: relative;
    }
		.dark-theme .book-container {
		background-blend-mode: luminosity !important;
		background-color: #2d2d2f !important;
		}	
    .book-container .book-corner-bottom:after,
    .book-container .book-corner-bottom:before,
    .book-container .book-corner-top:after,
    .book-container .book-corner-top:before {
      content: "";
      background: url(${images.corners}) 0 0 no-repeat;
      width: 62px;
      height: 63px;
      position: absolute;
    }
		@media (max-width:767px) {

			.book-container .book-corner-bottom:after,
			.book-container .book-corner-bottom:before,
			.book-container .book-corner-top:after,
			.book-container .book-corner-top:before {
			background: 0 0;
			}
		}
		.book-container .book-corner-top:before {
			top: -2px;
			left: -2px;
		}
		.book-container .book-corner-top:after {
			top: -2px;
			right: -2px;
			transform: scaleX(-1);
		}
		.book-container .book-corner-bottom:before {
			bottom: -2px;
			left: -2px;
			transform: scaleY(-1);
		}
		.book-container .book-corner-bottom:after {
			bottom: -2px;
			right: -2px;
			transform: scale(-1);
		}
		/* Обложка книги: швы */
		.book-container .book-stiches-horizontal:before,
		.book-container .book-stiches-horizontal:after {
			content: "";
			background-image: linear-gradient(90deg, #c69e6b50, #c69e6b50 70%, #0000 70% 100%);
			background-size: 7px 1px;
			width: 100%;
			height: 1px;
			position: absolute;
			left: 0;
		}
		.book-container .book-stiches-horizontal:before {
			top: 5px;
		}
		.book-container .book-stiches-horizontal:after {
			bottom: 5px;
		}
		.book-container .book-stiches-vertical:before,
		.book-container .book-stiches-vertical:after {
			content: "";
			background-image: linear-gradient(#0000 0% 30%, #c69e6b50 30%, #c69e6b50);
			background-size: 1px 7px;
			width: 1px;
			height: 100%;
			position: absolute;
			top: 0;
		}
		.book-container .book-stiches-vertical:before {
			left: 5px;
		}
		.book-container .book-stiches-vertical:after {
			right: 5px;
		}
		/* Обложка книги: страницы */
		.book-container .book-inner .pages {
			position: absolute;
			top: 0;
			bottom: 0;
		}

		.book-container .book-inner .pages:before,
		.book-container .book-inner .pages:after {
			content: "";
			width: 3px;
			position: absolute;
		}

		.book-container .book-inner .pages.left-1,
		.book-container .book-inner .pages.right-1 {
			background-color: #e7d6b6;
			top: 3px;
			bottom: 3px;
		}

		.book-container .book-inner .pages.left-1:before,
		.book-container .book-inner .pages.right-1:before {
			background-color: #d3be97;
			top: 3px;
			bottom: 3px;
		}

		.book-container .book-inner .pages.left-1:after,
		.book-container .book-inner .pages.right-1:after {
			background-color: #baa47d;
			top: 6px;
			bottom: 6px;
		}

		.book-container .book-inner .pages.left-2:before,
		.book-container .book-inner .pages.right-2:before {
			background-color: #a98d5b;
			top: 12px;
			bottom: 12px;
		}

		.book-container .book-inner .pages.left-2:after,
		.book-container .book-inner .pages.right-2:after {
			background-color: #897248;
			top: 15px;
			bottom: 15px;
		}

		.dark-theme .book-inner .pages {
			background-color: #2d2d2f !important;
		}

		.dark-theme .book-inner .pages:after,
		.dark-theme .book-inner .pages:before {
			background-color: inherit !important;
		}

		.book-container .book-inner .pages.left-1 {
			width: 3px;
			left: -3px;
		}

		.book-container .book-inner .pages.left-1:before {
			bottom: 3px;
			left: -3px;
		}

		.book-container .book-inner .pages.left-1:after {
			bottom: 6px;
			left: -6px;
		}

		.book-container .book-inner .pages.right-1 {
			width: 3px;
			left: 100%;
		}

		.book-container .book-inner .pages.right-1:before {
			left: 100%;
		}

		.book-container .book-inner .pages.right-1:after {
			left: calc(100% + 3px);
		}

		.book-container .book-inner .pages.left-2:before {
			left: -12px;
		}

		.book-container .book-inner .pages.left-2:after {
			left: -15px;
		}

		.book-container .book-inner .pages.right-2 {
			left: calc(100% + 3px);
		}

		.book-container .book-inner .pages.right-2:before {
			left: calc(100% + 6px);
		}

		.book-container .book-inner .pages.right-2:after {
			left: calc(100% + 9px);
		}

		@media (max-width:767px) {
			.book-container .book-inner .pages {
				display: none;
			}
		}

		/* Сделать меньше кнопку со скидкой */
    .discount-sticky-container {
    right: -55px;
		}
		.discount-sticky-container .discount-sticky {
				height: 125px;
		}
		.discount-sticky-container .discount-sticky .discount-label {
    transform: translate(-35%) rotate(90.1deg);
		}
		@media (max-width: 1309px) {
			.discount-sticky-container .discount-sticky {
				height: 105px;
				padding: 15px 0;
			}
		}
		@media (max-width: 991px) {
			.discount-sticky-container .discount-sticky .discount-label {
				transform: translate(-38%) rotate(90.1deg);
			}
		}
		@media (max-width: 991px) {
			.discount-sticky-container {
				width: 20px;
				right: -35px;
			}
		}
		@media (max-width: 1309px) {
			.discount-sticky-container {
				width: 25px;
				font-size: .75em;
				right: -40px;
			}
		}
  `;
}


// ------------- МОДУЛЬ "Search FullScreen" -------------
function updateSearchFullScreenModule(data) {
	if (data.searchFullScreenStyle) {
		if (data.cachedStyles_searchFullScreen) {
			window.moduleStyles.searchFullScreen = data.cachedStyles_searchFullScreen;
		} else {
			preloadAndCacheSearchFullScreenStyle();
		}
	} else {
		window.moduleStyles.searchFullScreen = '';
	}
}

function preloadAndCacheSearchFullScreenStyle() {
	const generatedCss = generateSearchFullScreenCss();
	chrome.storage.local.set({ cachedStyles_searchFullScreen: generatedCss }, () => {
		window.moduleStyles.searchFullScreen = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_searchFullScreen сохранён и применён");
	});
}

function generateSearchFullScreenCss() {
	return `
    /* Расширенный поиск во весь экран */
    .find-page-content {
      display: block !important;
    }
  `;
}


// ------------- МОДУЛЬ "Comments" -------------
function updateCommentsModule(data) {
	if (data.commentsStyle) {
		if (data.cachedStyles_comments) {
			window.moduleStyles.comments = data.cachedStyles_comments;
		} else {
			preloadAndCacheCommentsStyle();
		}
	} else {
		window.moduleStyles.comments = '';
	}
}

function preloadAndCacheCommentsStyle() {
	const generatedCss = generateCommentsCss();
	chrome.storage.local.set({ cachedStyles_comments: generatedCss }, () => {
		window.moduleStyles.comments = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_comments сохранён и применён");
	});
}

function generateCommentsCss() {
	return `
		/* Коментарии */
		.comment-container * {
			font-size: 15px !important;
		}
		.comment-container {
			padding-left: 2.3%;
			padding-right: 2.3%;
			padding-bottom: 1%;
		}
		.comment-item-list {
			align-items: center;
		}
		/* Увеличение поля редактирования: отзыв */
		.editor-section .ProseMirror {
			resize: vertical;
		}
  `;
}


// ------------- МОДУЛЬ "Remove Button" -------------
function updateRemoveBtnModule(data) {
	if (data.removeBtnEndOfFic) {
		if (data.cachedStyles_removeBtn) {
			window.moduleStyles.removeBtn = data.cachedStyles_removeBtn;
		} else {
			preloadAndCacheRemoveBtnStyle();
		}
	} else {
		window.moduleStyles.removeBtn = '';
	}
}

function preloadAndCacheRemoveBtnStyle() {
	const generatedCss = generateRemoveBtnCss();
	chrome.storage.local.set({ cachedStyles_removeBtn: generatedCss }, () => {
		window.moduleStyles.removeBtn = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_removeBtn сохранён и применён");
	});
}

function generateRemoveBtnCss() {
	return `
    /* Скрыть кнопку "Вперед" в конце фанфика */
    a[href*="/thanks-author-page"] {
      display: none !important;
    }
  `;
}

// ------------- МОДУЛЬ "Sidebar Nav" -------------

function updateSidebarNavModule(data) {
	if (data.sidebarNavStyle) {
		if (data.cachedStyles_sidebarNavStyle) {
			window.moduleStyles.sidebarNavStyle = data.cachedStyles_sidebarNavStyle;
		} else {
			preloadAndCacheSidebarNavStyle();
		}
	} else {
		window.moduleStyles.sidebarNavStyle = '';
	}
}

function preloadAndCacheSidebarNavStyle() {
	const generatedCss = generateSidebarNavCss();
	chrome.storage.local.set({ cachedStyles_sidebarNavStyle: generatedCss }, () => {
		window.moduleStyles.sidebarNavStyle = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_sidebarNavStyle сохранён и применён");
	});
}

function generateSidebarNavCss() {
	return `
		/* Больше шрифт/иконки в меню профиля и списке профиля. колокольчик/новости */
		.sidebar-nav * {
			font-size: 16px;
			line-height: 26px;
		}

		.ic_bell,
		.btn-top-bar .ic_newspaper {
			font-size: 22px;
		}

		.profile-area ul li a {
			font-size: 16px;
		}

				/* Размер цифры количества уведомлений 9,8px или .7em*/
		.btn-top-bar .badge-holder {
			font-size: 9.8px;
			right: 9px;
		}
  `;
}

// ------------- МОДУЛЬ "Headers Page" ------------- HeadersPage

function updateHeadersPageModule(data) {
	if (data.headersPageStyle) {
		if (data.cachedStyles_headersPageStyle) {
			window.moduleStyles.headersPageStyle = data.cachedStyles_headersPageStyle;
		} else {
			preloadAndCacheHeadersPageStyle();
		}
	} else {
		window.moduleStyles.headersPageStyle = '';
	}
}

function preloadAndCacheHeadersPageStyle() {
	const generatedCss = generateHeadersPageCss();
	chrome.storage.local.set({ cachedStyles_headersPageStyle: generatedCss }, () => {
		window.moduleStyles.headersPageStyle = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_headersPageStyle сохранён и применён");
	});
}

function generateHeadersPageCss() {
	return `
		/* Название работы - больше */
		.heading, h1 {
			font-weight: 400;
			font-size: 36px;
			line-height: 48px;
		}
  `;
}

// ------------- МОДУЛЬ "Remove Promo" ------------- RemovePromo

function updateRemovePromoModule(data) {
	if (data.removePromo) {
		if (data.cachedStyles_removePromo) {
			window.moduleStyles.removePromo = data.cachedStyles_removePromo;
		} else {
			preloadAndCacheRemovePromoStyle();
		}
	} else {
		window.moduleStyles.removePromo = '';
	}
}

function preloadAndCacheRemovePromoStyle() {
	const generatedCss = generateRemovePromoCss();
	chrome.storage.local.set({ cachedStyles_removePromo: generatedCss }, () => {
		window.moduleStyles.removePromo = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_removePromo сохранён и применён");
	});
}

function generateRemovePromoCss() {
	return `
		/* Убрать промо со списков */
		.fanfic-promo-carousel, .fanfic-text-promo {
			display: none
		}
  `;
}

// ------------- МОДУЛЬ "Remove Readed" ------------- RemoveReaded removeReaded

function updateRemoveReadedModule(data) {
	if (data.removeReaded) {
		if (data.cachedStyles_removeReaded) {
			window.moduleStyles.removeReaded = data.cachedStyles_removeReaded;
		} else {
			preloadAndCacheRemoveReadedStyle();
		}
	} else {
		window.moduleStyles.removeReaded = '';
	}
}

function preloadAndCacheRemoveReadedStyle() {
	const generatedCss = generateRemoveReadedCss();
	chrome.storage.local.set({ cachedStyles_removeReaded: generatedCss }, () => {
		window.moduleStyles.removeReaded = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_removeReaded сохранён и применён");
	});
}

function generateRemoveReadedCss() {
	return `
		/* Убрать промо со списков */
		.main-holder .top-list .top-item-row:has(.fanfic-block-read) {
			display: none;
		}
  `;
}

// ------------- МОДУЛЬ "Add Underline Fic Titles" ------------- AddUnderlineFicTitles addUnderlineFicTitles 

function updateAddUnderlineFicTitlesModule(data) {
	if (data.addUnderlineFicTitles) {
		if (data.cachedStyles_addUnderlineFicTitles) {
			window.moduleStyles.addUnderlineFicTitles = data.cachedStyles_addUnderlineFicTitles;
		} else {
			preloadAndCacheaddUnderlineFicTitlesStyle();
		}
	} else {
		window.moduleStyles.addUnderlineFicTitles = '';
	}
}

function preloadAndCacheaddUnderlineFicTitlesStyle() {
	const generatedCss = generateaddUnderlineFicTitlesCss();
	chrome.storage.local.set({ cachedStyles_addUnderlineFicTitles: generatedCss }, () => {
		window.moduleStyles.addUnderlineFicTitles = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_addUnderlineFicTitles сохранён и применён");
	});
}

function generateaddUnderlineFicTitlesCss() {
	return `
		/* Добавить подчеркивание для названий фанфиков (ссылки) */
		.fanfic-inline .fanfic-inline-title a {
			text-decoration: underline !important;
		}
  `;
}

// ------------- МОДУЛЬ "Change Color Font" ------------- ChangeColorFont changeColorFont

function updateChangeColorFontModule(data) {
	if (data.changeColorFont) {
		if (data.cachedStyles_changeColorFont) {
			window.moduleStyles.changeColorFont = data.cachedStyles_changeColorFont;
		} else {
			preloadAndCacheChangeColorFontStyle();
		}
	} else {
		window.moduleStyles.changeColorFont = '';
	}
}

function preloadAndCacheChangeColorFontStyle() {
	const generatedCss = generateChangeColorFontCss();
	chrome.storage.local.set({ cachedStyles_changeColorFont: generatedCss }, () => {
		window.moduleStyles.changeColorFont = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_changeColorFont сохранён и применён");
	});
}

function generateChangeColorFontCss() {
	return `
		/*Цвета текста на сайте*/
		/* Темный основной текст */
		.book-container .book-inner {
			color: var(--base-10) !important;
		}

		/*Коричневый цвет кнопок/текста - темнее #4f2d01 var(--primary-8)*/
		a:not(.notification, .btn-on-book-background, .btn,
		.btn-top-bar):not(:where(footer a)),
		.as-link,
		.search-form .link-button {
			color: var(--primary-8);
		}

		/* Цвет оповещения черный var(--base-10) #000*/
		.notification .notification-info[data-v-69e28e15] {
			color: var(--base-10) !important;
		}
  `;
}

// ------------- МОДУЛЬ "Back Color Indication" ------------- BackColorIndication backColorIndication

function updateBackColorIndicationModule(data) {
	if (data.backColorIndication) {
		if (data.cachedStyles_backColorIndication) {
			window.moduleStyles.backColorIndication = data.cachedStyles_backColorIndication;
		} else {
			preloadAndCacheBackColorIndicationStyle();
		}
	} else {
		window.moduleStyles.backColorIndication = '';
	}
}

function preloadAndCacheBackColorIndicationStyle() {
	const generatedCss = generateBackColorIndicationCss();
	chrome.storage.local.set({ cachedStyles_backColorIndication: generatedCss }, () => {
		window.moduleStyles.backColorIndication = generatedCss;
		applyCombinedStylesFromMemory();
		console.log("✅ cachedStyles_backColorIndication сохранён и применён");
	});
}

function generateBackColorIndicationCss() {
	return `
		/* ----- Параметры фанфика */
		.ds-label {
			font-size: 16px;
			padding: var(--gap-8);
		}

		/* Рейтинги фанфика в шапке. Цвет */
		.ds-label-rating-G {
			--color: var(--ni-white);
			--background-color: var(--rating-g);
		}

		.ds-label-rating-PG-13 {
			--color: var(--ni-white);
			--background-color: var(--rating-pg-13);
		}

		.ds-label-rating-R {
			--color: var(--ni-white);
			--background-color: var(--rating-r);
		}

		.ds-label-rating-NC-17 {
			--color: var(--ni-white);
			--background-color: var(--rating-nc-17);
		}

		.ds-label-rating-NC-21 {
			--color: var(--ni-white);
			--background-color: var(--rating-nc-21);
		}

		/* Статусы фанфика в шапке. Цвет и иконка */
		.ds-label-status-in-progress {
			--background-color: var(--status-in-progress-bg);
			--color: var(--status-in-progress);
		}

		.ds-label-status-in-progress::before {
			content: "";
			display: inline-block;
			width: 16px;
			height: 16px;
			background-color: currentColor;
			mask: url(" data:image/svg+xml,\ <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>\ <path d='M8 1.287a6.713 6.713 0 1 0 0 13.426A6.713 6.713 0 0 0 8 1.287ZM2.343 2.343a8 8 0 1 1 11.314 11.314A8 8 0 0 1 2.343 2.343Z'/>\<path d='M7.7 2.8a.7.7 0 0 1 .7.7v3.8h3.3a.7.7 0 1 1 0 1.4h-4A.7.7 0 0 1 7 8V3.5a.7.7 0 0 1 .7-.7Z'/>\ </svg>");
		}

		.ds-label-status-finished {
			--background-color: var(--status-like-finished-bg);
			--color: var(--status-like-finished);
		}

		.ds-label-status-finished::before {
			content: "";
			display: inline-block;
			width: 16px;
			height: 16px;
			background-color: currentColor;
			mask: url(" data:image/svg+xml,\ <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>\ <path d='M8 1.3c-1.8 0-3.5.7-4.7 2-1.3 1.3-2 3-2 4.7 0 .9.2 1.8.5 2.6s.8 1.6 1.5 2.2c.6.6 1.4 1.1 2.2 1.5.8.3 1.7.5 2.6.5s1.8-.2 2.6-.5 1.6-.8 2.2-1.5c.6-.6 1.1-1.4 1.5-2.2.3-.8.5-1.7.5-2.6 0-1.8-.7-3.5-2-4.7-1.4-1.3-3.1-2-4.9-2zm-5.7 1C3.8.8 5.9 0 8 0s4.2.8 5.7 2.3C15.2 3.8 16 5.9 16 8c0 1.1-.2 2.1-.6 3.1-.4 1-1 1.9-1.7 2.6-.7.7-1.6 1.3-2.6 1.7-1 .4-2 .6-3.1.6s-2.1-.2-3.1-.6c-1-.4-1.9-1-2.6-1.7-.7-.8-1.3-1.7-1.7-2.6-.4-1-.6-2-.6-3.1 0-2.1.8-4.2 2.3-5.7zm8.6 3.6c.3.3.3.7 0 .9l-3.3 3.3c-.3.3-.7.3-.9 0l-2-2c-.3-.3-.3-.7 0-.9.3-.3.7-.3.9 0l1.6 1.6L10 5.9c.2-.2.7-.2.9 0z'/>\ </svg>");
		}

		.ds-label-status-frozen {
			--background-color: var(--status-frozen-bg);
			--color: var(--status-frozen);
		}

		.ds-label-status-frozen::before {
			content: "";
			display: inline-block;
			width: 16px;
			height: 16px;
			background-color: currentColor;
			mask: url(" data:image/svg+xml,\ <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>\ <path d='M16 8c0-.4-.4-.8-.8-.8h-2L15 5.4a.8.8 0 0 0-1.2-1.2l-3 3h-2v-2l3-3A.8.8 0 0 0 10.6 1L8.8 2.8v-2C8.8.4 8.5 0 8 0s-.8.4-.8.8v2L5.4 1a.8.8 0 0 0-1.2 1.2l3 3v2h-2l-3-3A.8.8 0 0 0 1 5.4l1.8 1.8h-2a.8.8 0 1 0 0 1.6h2L1 10.6a.8.8 0 0 0 1.2 1.2l3-3h2v2l-3 3A.8.8 0 0 0 5.4 15l1.8-1.8v2a.8.8 0 0 0 1.6 0v-2l1.8 1.8a.8.8 0 0 0 1.2-1.2l-3-3v-2h2l3 3a.8.8 0 0 0 1.2-1.2l-1.8-1.8h2c.4 0 .8-.4.8-.8z'/>\ </svg>");
		}

		.ds-label-regular:has(.js-marks-plus) {
			--background-color: var(--status-like-finished-bg);
			--color: var(--status-like-finished);
		}

		.ds-label-regular:has(.ic_trophy) {
			--color: #d49600;
			--background-color: #eddca6;
		}
  `;
}
