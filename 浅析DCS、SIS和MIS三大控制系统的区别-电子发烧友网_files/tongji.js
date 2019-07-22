if (window.location.href.indexOf('/www/admin/') == -1 && window.location.href.indexOf('elecfans.com/public/') == -1) {
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

!function(){
    var idList = ['UA-135788944-1','UA-135779088-1','UA-135895998-1','UA-135936165-1'];
    var nowDay = new Date().getDate();
    ga('create', idList[Math.floor(nowDay/4/2)], 'auto');
}()
ga('send', 'pageview');


var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?6d75bd923eb90994727fa1979f3e101d";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

/**
 * Utility to wrap the different behaviors between W3C-compliant browsers
 * and IE when adding event handlers.
 *
 * @param {Object} element Object on which to attach the event listener.
 * @param {string} type A string representing the event type to listen for
 *     (e.g. load, click, etc.).
 * @param {function()} callback The function that receives the notification.
 */
function addListener(element, type, callback) {
    if (element.addEventListener) element.addEventListener(type, callback);
    else if (element.attachEvent) element.attachEvent('on' + type, callback);
}
/**
 * 获取 a 标签中的href属性值
 */
function getHrefFromElement(elmName) {
    if (elmName != null) {
        var hrefValue = elmName.getAttribute('href', 2);
        return (hrefValue != elmName.href) ? hrefValue : elmName.href;
    }
}

var adlinks = document.getElementsByTagName('a');
for (i=0; i<adlinks.length; i++) {
    addListener(adlinks[i], 'click', function() {
        var href = getHrefFromElement(this);
        var banneridArr = href.match(/__bannerid(=|%3D)(\d+)__/);
        var zoneidArr = href.match(/__zoneid(=|%3D)(\d+)__/);
        if (banneridArr.length == 3) {
            var bannerid = banneridArr[2];
            var zoneid = zoneidArr[2];
            if (zoneid == 842) {
                ga('send', 'event', 'TE textlink', 'click', 'zoneid:'+zoneid+',bannerid: '+bannerid, 1);
                _hmt.push(['_trackEvent', 'TE textlink', 'click', 'zoneid:'+zoneid+',bannerid: '+bannerid, 1]);
            } else {
                ga('send', 'event', 'linkclick', 'click', 'zoneid:'+zoneid+',bannerid: '+bannerid, 1);
                _hmt.push(['_trackEvent', 'linkclick', 'click', 'zoneid:'+zoneid+',bannerid: '+bannerid, 1]);
            }
        }
    });
}

    try {
    !function(doc){
        var scripts = doc.getElementsByTagName("script");
        var gas = [];
        for (var i = 0; scripts[i]; i++) {
            if (scripts[i].getAttribute("type") === "watchGA") {
                gas.push(scripts[i]);
            }
        }
        for (var i = 0; gas[i]; i++) {
            var dom = gas[i].nextSibling;
            var ganame = gas[i].innerText.replace(/^\s+|\s+$/g,"");
            if (!ganame) {
                continue;
            }
            while(1) {
                if (dom.nodeType === 1 && dom.tagName === "DIV") {
                    _fn(dom,ganame)
                    break;
                } else {
                    dom = dom.nextSibling;
                }
            }
        }
        var IframeOnClick = {
            resolution: 200,
            iframes: [],
            interval: null,
            Iframe: function() {
                this.element = arguments[0];
                this.cb = arguments[1];
                this.hasTracked = false;
            },
            track: function(element, cb) {
                this.iframes.push(new this.Iframe(element, cb));
                if (!this.interval) {
                    var _this = this;
                    this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);
                }
            },
            checkClick: function() {
                if (doc.activeElement) {
                    var activeElement = doc.activeElement;
                    for (var i in this.iframes) {
                        if (activeElement === this.iframes[i].element) { // user is in this Iframe
                            if (this.iframes[i].hasTracked == false) {
                                this.iframes[i].cb.apply(window, []);
                                this.iframes[i].hasTracked = true;
                            }
                        } else {
                            this.iframes[i].hasTracked = false;
                        }
                    }
                }
            }
        };

        function _fn(dom,ganame) {
            var arg = arguments;
            setTimeout(function(){
                var iframe = dom.getElementsByTagName("iframe");
                if (iframe.length) {
                    IframeOnClick.track(iframe[0], function() {
                        // GA统计代码写这里
                        console.log(ganame)
                        ga('send', 'event', 'doubleclickAds', 'click', ganame, 1);
                    });
                } else {
                    arg.callee();
                }
            },200)
        }
    }(document);
    } catch (e) {
        console.log(e)
    }
}

