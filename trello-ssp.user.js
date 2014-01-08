//list toggler stuff
startCustomizing = function() {
    var body;

    (function(fn) {
        var s;
        s = document.createElement('script');
        s.textContent = '(' + fn + ')()';
        return document.body.appendChild(s);
    })(
        body = function() {

            var cookie_name, debounce, is_active, recalc_list_size, recalc_list_size_debounced, save_cookie, toggle, _ref;

            debounce = function(fn, time) {
                return _.debounce(time, fn);
            };

            //TODO: set list widths
            // $('.list-card').css('max-width', 'none');
            // $('.list').width(350);
            // $('.list-area').width($('.list').length * (350 + 12));
            // $('body').addClass('layout-horiz-scroll');

            (function(style) {
                return $('<style>').attr({
                    type: 'text/css'
                }).text(style).appendTo('head');
            })(".toggler { cursor: pointer; }\n.toggler.active { background-color: gainsboro; }\n#board-header .org-name.toggler { overflow: visible; }");

            recalc_list_size = function() {
                return Controller.boardCurrent.view.renderLists();
            };

            recalc_list_size_debounced = debounce(2000, recalc_list_size);

            toggle = function(list, button, from_cookie) {
                if (from_cookie === null) {
                    from_cookie = false;
                }
                button.toggleClass('active');
                list.toggle().toggleClass('list invisible-list');
                if (!from_cookie) {
                    save_cookie();
                    return recalc_list_size_debounced();
                }
            };


            $('.list').each(debounce(200, function() {
                if (!$('.toggler').length) {
                    $('#board-header').append($('.list, .invisible-list').map(function(_, list) {
                        var button, listTitle, name;
                        list = $(list);
                        listTitle = list.find('h2')[0];
                        button = $('<a>').text(name = listTitle ? listTitle.firstChild.textContent : "Add...").addClass('quiet org-name toggler active');
                        button.click(function() {
                            return toggle(list, button);
                        });
                        if (!is_active(name)) {
                            toggle(list, button, true);
                        }
                        return button.get(0);
                    }));
                    if ($('.invisible-list').length) {
                        return recalc_list_size();
                    }
                }
            }));

            hashCode = function(s) {
                return s.split("").reduce(function(a, b) {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
            };

            cookie_name = 'inactive_lists_ssp_trello_' + ((_ref = location.href.match(/\/b\/[^\/]+\/([^\/]+)/)) !== null ? _ref[1] : void 0) || 'unknown';

            save_cookie = function() {
                return document.cookie = cookie_name + '=|' + $('.toggler:not(.active)').map(function() {
                    return hashCode(this.textContent);
                }).get().join('|') + '|';
            };

            return is_active = function(name) {
                return !(document.cookie.match(RegExp("" + cookie_name + "=[^;]*\\|" + hashCode(name) + "\\|")));
            };

        });
};

window.addEventListener("load", setTimeout(startCustomizing, 2000), false);

//ugly polling hack to catch navigation
var oldTitle = document.title;
window.setInterval(function() {
    if (document.title !== oldTitle) {
        startCustomizing();
    }
    oldTitle = document.title;
}, 100);