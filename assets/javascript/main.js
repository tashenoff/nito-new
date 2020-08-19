/**
  * removePreloader
  * init_header
  * ResponsiveMenu
  * fixHeight
  * consIsotope
  * ajaxContactForm
  * gmap3
  * owlcarousel
  * goTop
*/

;(function($) {

	'use strict'

	var removePreloader = function() {
		setTimeout(function() {
			$('.preloader').css({ 'opacity': 0, 'visibility':'hidden' });
		}, 1000);
	};

	var init_header = function() {
		var largeScreen = matchMedia('only screen and (min-width: 768px)').matches;
		if( largeScreen ) {
			if( $().sticky ) {
				$('header.header-sticky').sticky();
			}
		}
	};

	var init_header04 = function() {
		if( $('.header04').length ){
			var largeScreen = matchMedia('only screen and (min-width: 768px)').matches;
			if( largeScreen ) {
				$('.header04 #mainnav > ul > li').width($('#mainnav').width()/($('.header04 #mainnav > ul > li').length));
			} else {
				$('.header04 #mainnav > ul > li').width('auto');
			}
		}
	};

	var ResponsiveMenu =  {
		menuType: 'desktop',
		initial: function(winWidth) {
			ResponsiveMenu.menuWidthDetect(winWidth);
			ResponsiveMenu.menuBtnClick();
			ResponsiveMenu.parentMenuClick();
		},
		menuWidthDetect: function(winWidth) {
			var currMenuType = 'desktop';
			if (matchMedia('only screen and (max-width: 767px)').matches) {
				currMenuType = 'mobile';
			}
			if ( currMenuType !== ResponsiveMenu.menuType ) {
				ResponsiveMenu.menuType = currMenuType;
				if ( currMenuType === 'mobile' ) {
					$('.mainnav li.mega a').after($('.mega-wrap ul.sub-menu'));
					var $mobileMenu = $('#mainnav').attr('id', 'mainnav-mobi').hide();
					$('#header').find('.header-wrap').after($mobileMenu);
					var hasChildMenu = $('#mainnav-mobi').find('li:has(ul)');
					hasChildMenu.children('ul').hide();
					hasChildMenu.children('a').after('<span class="btn-submenu"></span>');
					$('.btn-menu').removeClass('active');
				} else {
					$('.mega-wrap .content.menu h3').after($('.mainnav li.mega ul.sub-menu').show());
					var $desktopMenu = $('#mainnav-mobi').attr('id', 'mainnav').removeAttr('style');
					$desktopMenu.find('.sub-menu').removeAttr('style');
					$('#header').find('.btn-menu').after($desktopMenu);
					$('.btn-submenu').remove();
				}
			} // clone and insert menu
		},
		menuBtnClick: function() {
			$('.btn-menu').on('click', function() {
				$('#mainnav-mobi').slideToggle(300);
				$(this).toggleClass('active');
			});
		}, // click on moblie button
		parentMenuClick: function() {
			$(document).on('click', '#mainnav-mobi li .btn-submenu', function(e) {
				if ( $(this).has('ul') ) {
					e.stopImmediatePropagation()
					$(this).next('ul').slideToggle(300);
					$(this).toggleClass('active');
				}
			});
		} // click on sub-menu button
	};
	var setupMegaMenu = function() {
		$('#mainnav > ul > li.mega a').hover( function() {
			$('.mega-wrap').fadeIn('300');
		},function(){
			setTimeout(function(){ 
				if ($('.mega-wrap:hover').length == 0) {
				    $('.mega-wrap').fadeOut('300');
				} 
			}, 50);
		});
		$('.mega-wrap').mouseleave(function(event) {
			event.preventDefault();
		},function(event) {
			$('.mega-wrap').fadeOut('300');
		});
	}
	var leftMenu = function() {
		if( $('.left-side-menu').length ) {
			$('#header').after( $('nav.mainnav') );
			$('.btn-left-menu').on('click', function(event) {
				$('nav.mainnav').addClass('active');
				$(this).fadeOut('fast');
			});
			$('.btn-close-menu').on('click', function(event) {
				$('nav.mainnav').removeClass('active');
				$('.btn-left-menu').fadeIn('fast');
			});
		}
	}

	var fixHeight = function(elm01,elm02) {
		if ( matchMedia('only screen and (min-width: 768px)').matches ) {
			$('body').imagesLoaded( function() {
				if ( $(elm01).length && $(elm02).length ) {
					var maxHeight = $(elm01).height();
					if( $(elm01).height() < $(elm02).height() ) {
						maxHeight = $(elm02).height();
					}
					$(elm01).height(maxHeight);
					$(elm02).height(maxHeight);
				}
			});
		}
	};

	var consIsotope = function(elm) {
		if ( $().isotope ) {
			var $container = $(elm);
			$container.imagesLoaded(function(){
				$container.isotope({
					itemSelector: '.item',
					transitionDuration: '1s'
				}); // end isotope
			});
			$('.filter li').on('click',function() {
				$('.filter li').removeClass('active');
				$(this).addClass('active');
				var selector = $(this).find("a").attr('data-filter');
				$container.isotope({ filter: selector });
				return false;
			});
		};
	};

	var popupGallery = function() {
		if( $().magnificPopup ) {
			$('.popup-gallery').magnificPopup({
				delegate: 'a.popup',
				type: 'image',
				removalDelay: 600,
				tLoading: 'Loading image #%curr%...',
				mainClass: 'my-mfp-slide-bottom',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						return item.el.attr('title');
					}
				}
			});
		}
	};

	var ajaxContactForm = function(formId) {
		$(formId).each(function() {
			$(this).validate({
				submitHandler: function( form ) {
					var $form = $(form),
						str = $form.serialize(),
						loading = $('<div />', { 'class': 'loading' });

					$.ajax({
						type: "POST",
						url:  $form.attr('action'),
						data: str,
						beforeSend: function () {
							$form.find('.send-wrap').append(loading);
						},
						success: function( msg ) {
							var result, alertClass;

							if ( msg == 'Success' ) {
								result = 'Your message has been sent. Thank you!';
								alertClass = 'msg-success';
							} else {
								result = 'Error sending email.';
								alertClass = 'msg-error';
							}

							$form.prepend(
								$('<div />', {
									'class': 'kul-alert col-md-12 ' + alertClass,
									'text' : result
								}).append(
									$('<a class="close" href="#"><i class="fa fa-close"></i></a>')
								)
							);
						},
						complete: function (xhr, status, error_thrown) {
							$form.find('.loading').remove();
						}
					});
				}
			});
		});
	};

	var googleMap = function() {
        if ( $().gmap3 ) {
        	var _draggable = true;
        	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				_draggable = false;
			}
            $("#gmap").gmap3({
                map:{
                    options:{
                        zoom: 14,
                        mapTypeId: 'consultant_style',
                        mapTypeControlOptions: {
                            mapTypeIds: ['consultant_style', google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID]
                        },
                        scrollwheel: false,
                        draggable: _draggable
                    }
                },
                getlatlng:{
                    address:  "65A-B - Bach Dang - Tan Binh - TP HCM",
                    callback: function(results) {
                        if ( !results ) return;
                        $(this).gmap3('get').setCenter(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
                        $(this).gmap3({
                            marker:{
                                latLng:results[0].geometry.location,
                                options:{
                                	icon: 'images/common/marker.png'
                                }
                            }
                        });
                    }
                },
                styledmaptype:{
                    id: "consultant_style",
                    options:{
                        name: "Consultant Map"
                    },
                },
            });
        }
    };

	var consCarousel = function(elm) {
		$(elm).each(function() {
			if ( $().owlCarousel ) {
				$(this).owlCarousel({
					items: $(this).data('items'),
					itemsDesktop: [1199,$(this).data('itemsdesktop')],
					itemsDesktopSmall:[979,$(this).data('itemsdesktopsmall')],
					itemsTablet: [768,$(this).data('itemstablet')],
					itemsMobile: [479,$(this).data('itemsmobile')],
					slideSpeed: $(this).data('slidespeed'),
					autoPlay: $(this).data('autoplay'),
					pagination: $(this).data('pagination'),
					responsive: $(this).data('responsive')
				});
			}
		});
	};

	var goTop = function() {
		$('.totop a').on('click', function() {
			$("html, body").animate({ scrollTop: 0 }, 1000 , 'easeInOutExpo');
			return false;
		});
	};

	var closeAlert = function() {
		$(document).on('click', '.close', function(e) {
			$(this).closest('.kul-alert').remove();
			e.preventDefault();
		})
	}

	// Dom Ready
	$(function() {
		removePreloader();
		init_header();
		init_header04();
		ResponsiveMenu.initial($(window).width());
		setupMegaMenu();
		leftMenu();
		$(window).resize(function() {
			ResponsiveMenu.menuWidthDetect($(this).width());
			init_header04();
			fixHeight('.feature-box .image','.feature-box .text');
			if ( matchMedia('only screen and (min-width: 991px)').matches ) {
				fixHeight('.blog-post','.main-content');
				leftMenu();
			}
		});
		fixHeight('.feature-box','.feature-box .image');
		if ( matchMedia('only screen and (min-width: 991px)').matches ) {
			fixHeight('.blog-post','.main-content');
		}
		consCarousel('.testimonial');
		consCarousel('.offer');
		consCarousel('.testimonial02');
		consCarousel('.testimonial03');
		consIsotope('.portfolio');
		consIsotope('.masonry main > div.content');
		popupGallery();
		ajaxContactForm('#requestForm');
		ajaxContactForm('#subscribeForm');
		ajaxContactForm('#contact-form');
		googleMap();
		goTop();
		closeAlert();
	});

})(jQuery);