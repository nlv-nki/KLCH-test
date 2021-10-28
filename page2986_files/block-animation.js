jQuery.widget('gc.animatedBlock', {
	// минимальное время между обработками события scroll
	SCROLL_HANDLE_TIMEOUT: 400,
	// Данное значение уменьшает координату нижней границы screen зоны (если в зоне, то запускается анимация)
	SCREEN_BOTTOM_GAP: 50,
	// Задержка между запуском анимации элементов при порядке анимации "по очереди" (и перед первым запуском)
	ANIMATION_DELAY: 300,

	ANIMATION_ORDER_IN_TURN: 'in-turn',
	ANIMATION_ORDER_AT_ONCE: 'at-once',

	ANIMATION_MODE_APPEAR: 'appear',
	ANIMATION_MODE_INCREASE: 'increase',
	ANIMATION_MODE_SLIDE_FROM_LEFT: 'slide-from-left',
	ANIMATION_MODE_SLIDE_FROM_RIGHT: 'slide-from-right',
	ANIMATION_MODE_SLIDE_FROM_TOP: 'slide-from-top',
	ANIMATION_MODE_SLIDE_FROM_BOTTOM: 'slide-from-bottom',

	// Таймер для блокировки обработки скролла, чтобы ограничить частоту обработки
	timerId: null,
	// Таймер для фантомной обработки скролла. Из-за ограничения частоты обработки мы пропускаем события, потому
	// когда события перестали поступать, нужно для верности обработку вызвать
	phantomTimerId: null,
	_create: function () {
		var self = this;

		if ($(window).width() < 1024) {
			// Если ширина меньше 1024, то сразу все показать без анимации
			self.element.find('.animated-element').removeClass('animated-element');
		} else {
			self.setScrollHandler();

			// После загрузки в первый раз сразу инициируем событие для пересчета анимации
			setTimeout(function () {
				$(window).scroll();
			}, self.ANIMATION_DELAY);
		}
	},
	setScrollHandler: function() {
		var self = this;

		$(window).scroll(function(event) {
			if (!self.timerId) {
				// Сбрасываем таймер фантомной обработки
				clearTimeout(self.phantomTimerId);
				self.phantomTimerId = null;

				// Блокируем обработку скролла на некоторое время, чтобы слишком часто не обрабатывать событие
				self.timerId = setTimeout(function() {
					self.timerId = null;
				}, self.SCROLL_HANDLE_TIMEOUT);

				self.recalculateAnimation();
			} else {
				// Смотри коммент к объявлению переменной phantomTimerId
				if (!self.phantomTimerId) {
					self.phantomTimerId = setTimeout(function () {
						self.phantomTimerId = null;
						self.recalculateAnimation();
					}, self.SCROLL_HANDLE_TIMEOUT);
				}
			}
		});
	},
	animateElement: function($element) {
		// Да, все так просто. Все через css делается.
		$element.removeClass('before-animation');

		// Теперь сразу после окончания анимации уберем класс со всеми стилями для нее, потому что стиль transform
		// ведет к тому, что слой просвечивает через вышележащие, а в редактировании блоков есть всплывашка с параметрами
		var animationDuration = parseFloat($element.css('transition-duration')) * 1000;
		setTimeout(function() {
			$element.removeClass('animated-element');
		}, animationDuration);
	},
	recalculateAnimation: function() {
		var self = this;
		var screenTop = $(window).scrollTop();
		var screenBottom = screenTop + $(window).height() - self.SCREEN_BOTTOM_GAP;
		var animationOrder = self.element.data('animation-order');

		var nextElementTimeout = 0;
		// Выбираем элементы, для которых еще не сработала анимация. Исключаем те, на которые уже повешен таймер на запуск анимации
		self.element.find('.animated-element.before-animation').not('.animation-will-start-soon').each(function() {
			var $el = $(this);
			if (self.isOnScreen($el, screenTop, screenBottom)) {
				if (animationOrder === self.ANIMATION_ORDER_AT_ONCE) {
					self.animateElement($el);
				} else {
					$el.addClass('animation-will-start-soon');
					setTimeout(function () {
						$el.removeClass('animation-will-start-soon');
						self.animateElement($el);
					}, nextElementTimeout);
					nextElementTimeout += self.ANIMATION_DELAY;
				}
			}
		});

	},
	isOnScreen: function($el, screenTop, screenBottom) {
		var elPull = parseInt($el.css('transform').split(',')[5]);
		if (elPull !== 0) {
			// Делаем коррекцию на существующий сдвиг элемента по оси y (сделан в css в качестве начальной позиции перед анимацией)
			screenBottom += elPull;
		}
		var elTop = $el.offset().top;
		var elBottom = elTop + $el.height();
		return elBottom > screenTop && elTop < screenBottom;
	}
});