(function ($) {

    //this script relies on responsive.js
    var _Responsive = Responsive ||
            // ensure no js errors if not included
            { init: function () { alert('Method not implemented; please include responsive.js script in page head!'); } },


    //flags
        _menu_created,
        _menu_open,


    //method to create the custom sidebar menu for smaller window sizes
        _createMenu = function () {
            var asrs = "<div class='menu-section'>" + $(".header-subbranding").html() + "</div>";
            var accountNav = "<div class='menu-section'>" + $(".account-nav").html() + "</div>";
            var navExtra = "<ul class='menu-list'>" + $(".nav-extra").html() + "</ul>";
            var navPrimary = ($(".nav-primary").length > 0) ? "<ul class='menu-list'>" + $(".nav-primary").html() + "</ul>" : "";
            
            var menu = "<div class='menu' id='menu-nav'>" +
                    "<div class='menu-head'>Menu <a class='menu-close' href='#'><i class='fal fa-times'></i></a></div>" +
                    navPrimary +
                    navExtra +
                    accountNav +
                    asrs +
                "</div>";
            
            $("body").append(menu);
            
            $("#toggle-menu").on("click touchstart", function (e) {
                $("body").addClass("menu-open masked");
                _menu_open = true;
                e.stopPropagation();
                return false;
            });
            
            $(".menu-close").on("click touchstart", function (e) {
                $("body").removeClass("menu-open masked");
                _menu_open = true;
                e.stopPropagation();
                return false;
            });
            
            $("#toggle-search").on("click touchstart", function (e) {
                $("body").removeClass("menu-open");
                $("body").addClass("search-open masked");
                _menu_open = true;
                e.stopPropagation();
                return false;
            });

            $("#mask").on("click touchstart", function (e) {
                if (_menu_open && $("#menu").has(e.target).length === 0) {
                    $("body").removeClass("masked menu-open search-open");
                    _menu_open = false;
                    e.stopPropagation();
                    return false;
                }
            });
        },

    //method to remove the custom sidebar menu
        _removeMenu = function () {
            $("body").removeClass("masked menu-open search-open");
            $(".menu").remove();
        };


    // initialize responsive layouts
    _Responsive.init({
        layouts: {
            MENU: { maxWidth: 900, stylesheet: false }
        },
        //listen for responsive layout change; will also be fired once on page load
        onLayoutChange: function (layout) {
            if (layout == _Responsive.LayoutType.MENU) {
                if (!_menu_created)
                    _createMenu();
                _menu_created = true;
            }
            else {
                if (_menu_created)
                    _removeMenu();
                _menu_created = false;
            }
        }
    });

})(jQuery);
