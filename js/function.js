/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device


$(document).ready(function() {
    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	// Запрет "отскока" страницы при клике по пустой ссылке с href="#"
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    // Inputmask.js
    // $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });
    // formSubmit();

    checkOnResize();

    $('.complete__toggle').on('click', function() {
        $('.complete').toggleClass('open');
    });

    $('.nav__toggle').on('click', function() {
        $('.nav').toggleClass('open');
    });

    toggleChat();
    clampLine();

});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize();
});

function toggleChat() {
    var chatLinkClickCount = 0;
    $('.js_show_chat').on('click', function() {
        console.log(chatLinkClickCount);
        if (chatLinkClickCount == 0) {
            _chatlio.show({expanded: true});
            chatLinkClickCount++;
        } else {
            _chatlio.show({expanded: false});
            chatLinkClickCount--;
        }
    })
}

function clampLine() {
    // console.log('clamp');
    $('.featuresList__text').each(function(index, element) {
        // console.log(element);
        // console.log($(this).text());
        $(this).attr('data-text', $(this).text());
        if (isXsWidth()) {
            $clamp(element, { clamp: 3.5, useNativeClamp: false });
            $(this).addClass('inline');
            $(this).attr('data-short', $(this).text());
        } else {
            $clamp(element, { clamp: 5, useNativeClamp: false });
            $(this).addClass('inline');
            $(this).attr('data-short', $(this).text());
        }
    });

    $('.featuresList__more').on('click', function() {
        var box = $(this).parent().find('.featuresList__text'),
        text = box.data('text'),
        short = box.data('short');
        if (box.hasClass('open')) {
            // IF OPEN
            box.text(short);
            $(this).text('Show more');
            box.removeClass('open');
        } else {
            // IF CLOSE
            box.text(text);
            $(this).text('Hide');
            box.addClass('open');
        }
    })
}


function checkOnResize() {
    // fontResize();
    parallaxFScreen();
    if (isXsWidth()) {
        $('.header__action').insertBefore('.nav__bottom');
    } else {
        $('.header__action').appendTo('.header__right');
    }
}


function parallaxFScreen() {

    if (isSmWidth()) {
        $('.fScreen__layer').removeAttr('style');
    } else {
        $('.fScreen').on('mousemove', function(e) {
            var posX = e.offsetX - ($(window).width() / 4);
            var posY = e.offsetY - ($(window).height() / 6);
            // console.log(posX);
            $('.fScreen__layer').each(function() {
                var speed = $(this).data('speed') / 0.2;

                $(this).css('transform', 'translateX('+(-posX/speed)+'px) translateY('+(-posY/speed)+'px)')
            });
        })
    }
}

function animateElements() {
    if (!isXsWidth()) {
        var item = $('.animate');
        item.each(function(index, el) {
            var delay = $(this).data('delay');
            $(this).addClass("hidden").viewportChecker({
                classToAdd: 'visible animated fadeInUp',
                offset: delay
            })
        });
    }
}
animateElements();

function toTop() {
    let currentTop = $(window).scrollTop(),
        screenHeight = $(window).height(),
        el = $('.to_top');

    $(window).scroll(function() {
        toggleBtn();
    });

    toggleBtn();

    function toggleBtn() {
        currentTop = $(window).scrollTop();
        if (currentTop > screenHeight) {
            el.addClass('show');
        } else {
            el.removeClass('show');
        }
    }

    el.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    })
}
toTop();


function toggleTabs() {
    $('[data-tab]').on('click', function() {
        $('[data-tab]').removeClass('active');
        $('[data-pane]').removeClass('active');
        $(this).addClass('active');
        $($(this).data('tab')).addClass('active');
    })
}
toggleTabs();

// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
function stikyMenu() {
    let HeaderTop = $('header').offset().top + $('.home').innerHeight();
    let currentTop = $(window).scrollTop();

    setNavbarPosition();

    $(window).scroll(function(){
        setNavbarPosition();
    });

    function setNavbarPosition() {
        currentTop = $(window).scrollTop();

        if( currentTop > HeaderTop ) {
            $('header').addClass('stiky');
        } else {
            $('header').removeClass('stiky');
        }

        $('.navbar__link').each(function(index, el) {
            let section = $(this).attr('href');

            if ($('section').is(section)) {
                let offset = $(section).offset().top;

                if (offset <= currentTop && offset + $(section).innerHeight() > currentTop) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            }
        });
    }
};

// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
function srollToId() {
    $('[data-scroll-to]').click( function(){
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
        }
        return false;
    });
}

function fontResize() {
    var windowWidth = $(window).width();
    if (windowWidth >= 1200) {
    	var fontSize = windowWidth/19.05;
    } else if (windowWidth < 1200) {
    	var fontSize = 60;
    }
	$('body').css('fontSize', fontSize + '%');
}

// Видео youtube для страницы
function uploadYoutubeVideo() {
    if ($(".js_youtube")) {
        var player;
        var modal = $('#showVideo');
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        $(".js_youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

                // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
                $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

            });

            $('body').on('click', '.video__play', function () {
                console.log('video start');
                var wrapp = $(this).closest('.video__wrapper'),
                videoId = wrapp.attr('id');

                player = new YT.Player('player', {
                    videoId: videoId,
                    playerVars: { 'autoplay': 1, 'controls': 1 },
                    events: {
                        'onReady': onPlayerReady,
                    }
                });

                modal.modal('show');

                console.log(player);

                function onPlayerReady(event) {
                    event.target.playVideo();
                }

            });

            modal.on('hide.bs.modal', function() {
                $(this).find('iframe').remove();
                $(this).find('.video__wrapper').append('<div id="player" />');
            })
        }
    };
    uploadYoutubeVideo();


// Деление чисел на разряды Например из строки 10000 получаем 10 000
// Использование: thousandSeparator(1000) или используем переменную.
// function thousandSeparator(str) {
//     var parts = (str + '').split('.'),
//         main = parts[0],
//         len = main.length,
//         output = '',
//         i = len - 1;

//     while(i >= 0) {
//         output = main.charAt(i) + output;
//         if ((len - i) % 3 === 0 && i > 0) {
//             output = ' ' + output;
//         }
//         --i;
//     }

//     if (parts.length > 1) {
//         output += '.' + parts[1];
//     }
//     return output;
// };


// Хак для яндекс карт втавленных через iframe
// Страуктура:
//<div class="map__wrap" id="map-wrap">
//  <iframe style="pointer-events: none;" src="https://yandex.ru/map-widget/v1/-/CBqXzGXSOB" width="1083" height="707" frameborder="0" allowfullscreen="true"></iframe>
//</div>
// Обязательное свойство в style которое и переключет скрипт
// document.addEventListener('click', function(e) {
//     var map = document.querySelector('#map-wrap iframe')
//     if(e.target.id === 'map-wrap') {
//         map.style.pointerEvents = 'all'
//     } else {
//         map.style.pointerEvents = 'none'
//     }
// })

// Простая проверка форм на заполненность и отправка аяксом
// function formSubmit() {
//     $("[type=submit]").on('click', function (e){
//         e.preventDefault();
//         var form = $(this).closest('.form');
//         var url = form.attr('action');
//         var form_data = form.serialize();
//         var field = form.find('[required]');
//         // console.log(form_data);

//         empty = 0;

//         field.each(function() {
//             if ($(this).val() == "") {
//                 $(this).addClass('invalid');
//                 // return false;
//                 empty++;
//             } else {
//                 $(this).removeClass('invalid');
//                 $(this).addClass('valid');
//             }
//         });

//         // console.log(empty);

//         if (empty > 0) {
//             return false;
//         } else {
//             $.ajax({
//                 url: url,
//                 type: "POST",
//                 dataType: "html",
//                 data: form_data,
//                 success: function (response) {
//                     // $('#success').modal('show');
//                     // console.log('success');
//                     console.log(response);
//                     // console.log(data);
//                     // document.location.href = "success.html";
//                 },
//                 error: function (response) {
//                     // $('#success').modal('show');
//                     // console.log('error');
//                     console.log(response);
//                 }
//             });
//         }

//     });

//     $('[required]').on('blur', function() {
//         if ($(this).val() != '') {
//             $(this).removeClass('invalid');
//         }
//     });

//     $('.form__privacy input').on('change', function(event) {
//         event.preventDefault();
//         var btn = $(this).closest('.form').find('.btn');
//         if ($(this).prop('checked')) {
//             btn.removeAttr('disabled');
//             // console.log('checked');
//         } else {
//             btn.attr('disabled', true);
//         }
//     });
// }


// Проверка на возможность ввода только русских букв, цифр, тире и пробелов
// $('#u_l_name').on('keypress keyup', function () {
//     var that = this;
//
//     setTimeout(function () {
//         if (that.value.match(/[ -]/) && that.value.length == 1) {
//             that.value = '';
//         }
//
//         if (that.value.match(/-+/g)) {
//             that.value = that.value.replace(/-+/g, '-');
//         }
//
//         if (that.value.match(/ +/g)) {
//             that.value = that.value.replace(/ +/g, ' ');
//         }
//
//         var res = /[^а-яА-Я -]/g.exec(that.value);
//
//         if (res) {
//             removeErrorMsg('#u_l_name');
//             $('#u_l_name').after('<div class="j-required-error b-check__errors">Измените язык ввода на русский</div>');
//         }
//         else {
//             removeErrorMsg('#u_l_name');
//         }
//
//         that.value = that.value.replace(res, '');
//     }, 0);
// });
