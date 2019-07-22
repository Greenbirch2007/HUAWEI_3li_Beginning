/*
 *  sso.passport.js
 *  单点登录
 *  版本:v1.0
 *  本插件依赖于jquery，使用前必须引入 jquery
 * 1.弹窗登录
 * $.ssoDialogLogin([option])
 * 用法：页面中引用该JS，需要登录时，使用代码$.ssoDialogLogin([option])
 * 输入参数说明：option:可选参数，function | bool | default值,
 * 值为function时可返回bool值 ,为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
 * 值为bool时，为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
 * *************************
 * 2.页面登录
 * 用法：页面中引用该JS，
 * 在需要的地方插入<iframe name="sso-LoginIframe" frameborder="0" scrolling="no"></iframe>
 * 注意：name值不可更改     *
 * **************************
 * 3.弹窗注册
 * $.ssoDialogRegist([option])
 *
 * **************************
 * 4.页面注册
 * 用法：页面中引用该JS，
 * 在需要的地方插入<iframe name="sso-RegistIframe" frameborder="0" scrolling="no"></iframe>
 * 注意：name值不可更改     *
 *
 * **************************
 * 5.页面修改密码
 * 用法：页面中引用该JS，
 * 在需要的地方插入<iframe name="sso-ChangepwdIframe" frameborder="0" scrolling="no"></iframe>
 * 注意：name值不可更改     *
 *  Created by lc on 2016-03-07.
 *  Copyright 2016 lc. All rights reserved.
 *
 *
 */

//引入jQuery postMessage,用于跨域传参
/*
 * jQuery postMessage - v0.5 - 9/11/2009
 * 修复jquery1.9版本以上报错
 * Created by lc on 2016-03-07.
 * Copyright 2016 lc. All rights reserved.
 */
;
(function(d) {
	var e, k, n = 1,
		f, g = this,
		l, m = g.postMessage && !/opera/.test(navigator.userAgent.toLowerCase());
	d.postMessage = function(b, a, c) {
		a && (b = "string" === typeof b ? b : d.param(b), c = c || parent, m ? c.postMessage(b, a.replace(
			/([^:]+:\/\/[^\/]+).*/, "$1")) : a && (c.location = a.replace(/#.*$/, "") + "#" + +new Date +
			n++ + "&" + b))
	};
	d.receiveMessage = l = function(b, a, c) {
		if(m)
			if(b && (f && l(), f = function(h) {
					if("string" === typeof a && h.origin !== a || d.isFunction(a) && !1 === a(h.origin)) return !
						1;
					b(h)
				}), g.addEventListener) g[b ? "addEventListener" :
				"removeEventListener"]("message", f, !1);
			else g[b ? "attachEvent" : "detachEvent"]("onmessage", f);
		else e && clearInterval(e), e = null, b && (e = setInterval(function() {
			var a = document.location.hash,
				c = /^#?\d+&/;
			a !== k && c.test(a) && (k = a, b({
				data: a.replace(c, "")
			}))
		}, "number" === typeof a ? a : "number" === typeof c ? c : 100))
	}
})(jQuery);
/*
 * getUrlParam：自定义获得url参数值插件
 * 自定义插件,获得URL参数值
 * 使用示例：var xx = $.getUrlParam('reurl');
 */
;
(function($) {
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
})(jQuery);
//插件开始
;
(function($) {
	//从页面中获得相关参数
	var getSSOEle = $("#sso_script");
	var setSSO_host = getSSOEle.attr("data-ssoSite"), //设置单点登录管理站点域名
		setSSO_referer = getSSOEle.attr("data-ssoReferer"), //获得跳转地址
		setSSO_scene = getSSOEle.attr('data-ssoScene'),// 登陆场景
		setSSO_siteID = getSSOEle.attr("data-ssoSiteid"); //获得登录站点ID
		setSSO_referer = setSSO_referer != undefined ? setSSO_referer : "";
		setSSO_scene = setSSO_scene != undefined ? setSSO_scene : "";

	var getTid = $.getUrlParam("tid"); //获得广告推广ID
	getTid = !!getTid ? getTid : "";

	//设置登录框的URL
	var setLoginSrc = setSSO_host
		+ "/login?referer=" + setSSO_referer
		+ "&siteid=" + setSSO_siteID
		+ "&scene=" + setSSO_scene
		+ "#" + encodeURIComponent(location.href);
	//设置注册框的URL
	var setRegistSrc = setSSO_host
		+ "/register"
		+ "?tid=" + getTid
		+ "&referer=" + setSSO_referer
		+ "&siteid=" + setSSO_siteID
		+ "&scene=" + setSSO_scene
		+ "#" + encodeURIComponent(location.href);
	//设置换密框的URL
	var setChangepwdSrc = setSSO_host
		+ "/password/changepwd?siteid="
		+ setSSO_siteID + "#"
		+ encodeURIComponent(location.href);
	
	//针对论坛活动，修改注册地址
	if($.getUrlParam("special")=="activity"){
		setRegistSrc = setSSO_host
		+ "/register"
		+ "?tid=" + getTid
		+ "&referer=" + $.getUrlParam("referer")
		+ "&special=activity"
		+ "&siteid=" + setSSO_siteID
		+ "&scene=" + setSSO_scene
		+ "#" + encodeURIComponent(location.href);
	}

	//判断不是页面登录，是采用引窗登录时，动态加载弹窗css文件
	if($("iframe[name^='sso-']").length == 0) {
		var setDialogCssUrl = setSSO_host + "/public/pc/css/sso.dialogPassport.css"; //设置弹窗CSS相对路径
		$("head").append('<link rel="stylesheet" href="' + setDialogCssUrl + '"/>');
	}

	$.extend({
		/*
		 * 弹窗登录
		 * 用法：需要登录时，使用代码$.ssoDialogLogin([option])
		 * 输入参数说明：option:可选参数，function | bool | str | default值,
		 * 值为function时可返回bool值 ,为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
		 * 值为bool时，为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
		 * 值为str时，必须是一个跳转地址，登录成功后，将会跳转到该地址
		 */
		ssoDialogLogin: function(callback) {
			//设置对话框文本
			var setDialogHtml = $(
				'<div class="sso_layer"></div>' +
				'<div class="sso_dialog">' +
				'<div class="sso_dialog_header">' +
				'<span class="sso_dialog_title">登录</span>' +
				'<button class="sso_dialog_close">×</button>' +
				'</div>' +
				'<div class="sso_dialog_content"><iframe frameborder="0" scrolling="no" onload=""></iframe></div>' +
				'</div>'
			);
			setDialogHtml.appendTo("body").find("iframe").attr("src", setLoginSrc); //置入到body中去
			//弹窗点击关闭按钮
			setDialogHtml.on("click", ".sso_dialog_close", function() {
				setDialogHtml.remove();
			});

			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {

				var getIframe = setDialogHtml.find("iframe");
				// 接收到纯数字时设置iframe的高度
				if($.isNumeric(msg.data)) {
					getIframe.css("height", msg.data + "px");
					//调整dialog的高度及位置
					var getTitleHeight = setDialogHtml.find(".sso_dialog_header").height();
					var getContentHeight = setDialogHtml.find(".sso_dialog_content").outerHeight();
					var getTotalHeight = getTitleHeight + getContentHeight;

					$(".sso_dialog").css({
						"height": getTotalHeight + "px",
						"margin-top": 0 - getTotalHeight / 2 + "px"
					});

				}
				//当子框架要求页面刷新时
				else if(msg.data == "reload") {
					window.location.reload();
				}
				//其他情况
				else if(typeof(msg.data) == "string") {
					$.ajax({
						type: "get",
						url: decodeURIComponent(msg.data),
						success: function(res) {
							if(typeof(callback) == "string") {
								window.location.href = callback;
								return;
							}
							else if(typeof(callback) == "function") {
								var uFn = callback(msg);
								if(callback == true) {
									window.location.reload();
								}
								return;
							}
							else if(callback == false) {
								return;
							}
							else if(callback == true) {
								window.location.reload();
								return;
							}
							//                          if(setSSO_referer==""){
							//                              window.location.reload();
							//                              return;
							//                          }
							else {
								//将本地地址传入到参数中去
								$.postMessage(res, setLoginSrc, getIframe.get(0).contentWindow);
							}
						}
					});
				}

			}, setSSO_host);
		},
		/*
		 * 弹窗注册
		 * 用法：需要登录时，使用代码$.ssoDialogRegist([option])
		 * 输入参数说明：option:可选参数，function | bool | str | default值,
		 * 值为function时可返回bool值 ,为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
		 * 值为bool时，为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
		 * 值为str时，必须是一个跳转地址，登录成功后，将会跳转到该地址
		 */
		ssoDialogRegist: function(callback) {

			//设置对话框文本
			var setDialogHtml = $(
				'<div class="sso_layer"></div>' +
				'<div class="sso_dialog">' +
				'<div class="sso_dialog_header">' +
				'<span class="sso_dialog_title">注册</span>' +
				'<button class="sso_dialog_close">×</button>' +
				'</div>' +
				'<div class="sso_dialog_content"><iframe frameborder="0" scrolling="no" onload=""></iframe></div>' +
				'</div>'
			);
			setDialogHtml.appendTo("body").find("iframe").attr("src", setRegistSrc); //置入到body中去
			//弹窗点击关闭按钮
			setDialogHtml.on("click", ".sso_dialog_close", function() {
				setDialogHtml.remove();
			});

			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {

				var getIframe = setDialogHtml.find("iframe");
				// 接收到纯数字时设置iframe的高度
				if($.isNumeric(msg.data)) {
					getIframe.css("height", msg.data + "px");
					//调整dialog的高度及位置
					var getTitleHeight = setDialogHtml.find(".sso_dialog_header").height();
					var getContentHeight = setDialogHtml.find(".sso_dialog_content").outerHeight();
					var getTotalHeight = getTitleHeight + getContentHeight;
					setDialogHtml.find(".sso_dialog").css({
						"height": getTotalHeight + "px",
						"margin-top": 0 - getTotalHeight / 2 + "px"
					});

				} else if(typeof(msg.data) == "string") {
					$.ajax({
						type: "get",
						url: decodeURIComponent(msg.data),
						success: function(res) {
							if(typeof(callback) == "string") {
								window.location.href = callback;
								return;
							}
							else if(typeof(callback) == "function") {
								var uFn = callback(msg);
								if(callback == true) {
									window.location.reload();
								}
								return;
							}
							else if(callback == false) {
								return;
							}
							else if(callback == true) {
								window.location.reload();
								return;
							}
							if(setSSO_referer == "") {
								window.location.reload();
								return;
							}
							else {
								$.postMessage(res, setLoginSrc, getIframe.get(0).contentWindow);
							}
						}
					});
				}
			}, setSSO_host);
		},



		/*
		 * 主站非首页滚动加载的弹窗
		 * */
		scrollLogin: function(callback) {

			//设置登录框的URL
			var setRegistSrc = setSSO_host
				+ "/register"
				+ "?tid=" + getTid
				+ "&special=wwwquick"
				+ "&referer=" + setSSO_referer
				+ "&siteid=" + setSSO_siteID
				+ "&scene=" + setSSO_scene
				+ "#" + encodeURIComponent(location.href);
			var setLoginSrc = setRegistSrc;


			//设置对话框文本
			var setDialogHtml = $("#ssoScrollLog");
			setDialogHtml.append("<iframe></iframe>"); //置入到body中去
			setDialogHtml.find('iframe').attr("src", setLoginSrc)
			//弹窗点击关闭按钮
			/*	setDialogHtml.on("click", ".sso_dialog_close", function() {
			 setDialogHtml.remove();
			 });
			 */
			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {

				var getIframe = setDialogHtml.find("iframe");
				// 接收到纯数字时设置iframe的高度
				if($.isNumeric(msg.data)) {
					getIframe.css("height", msg.data + "px");
					//调整dialog的高度及位置
					var getTitleHeight = setDialogHtml.find(".sso_dialog_header").height();
					var getContentHeight = setDialogHtml.find(".sso_dialog_content").outerHeight();
					var getTotalHeight = getTitleHeight + getContentHeight;

					$("#ssoScrollLog iframe").css({
						"height": 350 + "px",
						"margin-top": 45 + "px"
					});

				}
				//当子框架要求页面刷新时
				else if(msg.data == "reload") {
					window.location.reload();
				}
				//其他情况
				else if(typeof(msg.data) == "string") {
					$.ajax({
						type: "get",
						url: decodeURIComponent(msg.data),
						success: function(res) {
							if(typeof(callback) == "string") {
								window.location.href = callback;
								return;
							}
							else if(typeof(callback) == "function") {
								var uFn = callback(msg);
								if(callback == true) {
									window.location.reload();
								}
								return;
							}
							else if(callback == false) {
								return;
							}
							else if(callback == true) {
								window.location.reload();
								return;
							}
							//                          if(setSSO_referer==""){
							//                              window.location.reload();
							//                              return;
							//                          }
							else {
								//将本地地址传入到参数中去
								$.postMessage(res, setLoginSrc, getIframe.get(0).contentWindow);
							}
						}
					});
				}

			}, setSSO_host);
		},


		/*
		 * 页面登录
		 * 用法：需要登录时，使用代码$.ssoPageLogin()
		 */
		ssoPageLogin: function() {
			var getLoginIframe = $("iframe[name='sso-LoginIframe']"); //获得容器
			getLoginIframe.attr("src", setLoginSrc);
			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {
				// 接收到纯数字时设置iframe的高度

				if($.isNumeric(msg.data)) {
					getLoginIframe.css("height", msg.data + "px");
				} else if(typeof(msg.data) == "string") {
					$.ajax({
						type: "get",
						url: decodeURIComponent(msg.data),
						success: function(res) {
							if(setSSO_referer == "") {
								window.location.href = "/";
							}
							else {
								$.postMessage(res, setLoginSrc, getLoginIframe.get(0).contentWindow);
							}
						}
					});
				}
			}, setSSO_host);
		},
		/*
		 * 页面注册
		 * 用法：需要使用时，使用代码$.ssoPageRegist()
		 */
		ssoPageRegist: function() {
			var getRegistIframe = $("iframe[name='sso-RegistIframe']"); //获得容器
			getRegistIframe.attr("src", setRegistSrc);
			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {
				// 接收到纯数字时设置iframe的高度
				if($.isNumeric(msg.data)) {
					getRegistIframe.css("height", msg.data + "px");
				} else if(typeof(msg.data) == "string") {
					$.ajax({
						type: "get",
						url: decodeURIComponent(msg.data),
						success: function(res) {
							if(setSSO_referer == "") {
								window.location.href = "/";
							}
							else {
								$.postMessage(res, setRegistSrc, getRegistIframe.get(0).contentWindow);
							}
						}
					});
				}
			}, setSSO_host);
		},
		// 页面形式修改密码
		ssoPageChangepwd: function() {
			var getChangepwdIframe = $("iframe[name='sso-ChangepwdIframe']"); //获得容器
			getChangepwdIframe.attr("src", setChangepwdSrc);
			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {

				// 接收到纯数字时设置iframe的高度
				if($.isNumeric(msg.data)) {
					getChangepwdIframe.css("height", msg.data + "px");
				} else if(typeof(msg.data) == "string") {
					// 已登录状态下才能修改密码，所以本站点不用再登录
					$.postMessage("success", setChangepwdSrc, getChangepwdIframe.get(0).contentWindow);
				}
			}, setSSO_host);
		},



		/*
		 * 弹窗登录==专门为论坛活动开发的
		 * 用法：需要登录时，使用代码
		 * 输入参数说明：option:可选参数，function | bool | str | default值,
		 * 值为function时可返回bool值 ,为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
		 * 值为bool时，为true时，刷新页面，为false时，不刷新页面，默认执行系统跳转
		 * 值为str时，必须是一个跳转地址，登录成功后，将会跳转到该地址
		 */
		tActivityLogin: function(callback) {

			//设置登录框的URL
			var setLoginSrc = setSSO_host
				+ "/login?special=t&referer=" + setSSO_referer
				+ "&siteid=" + setSSO_siteID
				+ "#" + encodeURIComponent(location.href);

			//设置对话框文本
			var setDialogHtml = $(
				'<div class="sso_layer"></div>' +
				'<div class="sso_dialog" id="activity_login">' +
				'<div class="sso_dialog_header">' +

				'<button class="sso_dialog_close">×</button>' +
				'</div>' +
				'<div class="sso_dialog_content"><iframe frameborder="0" scrolling="no" ></iframe></div>' +
				'</div>'
			);
			setDialogHtml.appendTo("body").find("iframe").attr("src", setLoginSrc); //置入到body中去
			//弹窗点击关闭按钮
			setDialogHtml.on("click", ".sso_dialog_close", function() {
				setDialogHtml.remove();
			});

			//跨域接收iframe传过来的参数
			$.receiveMessage(function(msg) {

				var getIframe = setDialogHtml.find("iframe");
				// 接收到纯数字时设置iframe的高度
				if($.isNumeric(msg.data)) {
					getIframe.css("height", msg.data + "px");
					//调整dialog的高度及位置
					var getTitleHeight = setDialogHtml.find(".sso_dialog_header").height();
					var getContentHeight = setDialogHtml.find(".sso_dialog_content").outerHeight();
					var getTotalHeight = getTitleHeight + getContentHeight;

					$(".sso_dialog").css({
						"height": getTotalHeight + "px",
						"margin-top": 0 - getTotalHeight / 2 + "px"
					});

				}
				//当子框架要求页面刷新时
				else if(msg.data == "reload") {
					window.location.reload();
				}
				//其他情况
				else if(typeof(msg.data) == "string") {
					$.ajax({
						type: "get",
						url: decodeURIComponent(msg.data),
						success: function(res) {
							if(typeof(callback) == "string") {
								window.location.href = callback;
								return;
							}
							else if(typeof(callback) == "function") {
								var uFn = callback(msg);
								if(callback == true) {
									window.location.reload();
								}
								return;
							}
							else if(callback == false) {
								return;
							}
							else if(callback == true) {
								window.location.reload();
								return;
							}
							//                          if(setSSO_referer==""){
							//                              window.location.reload();
							//                              return;
							//                          }
							else {
								//将本地地址传入到参数中去
								$.postMessage(res, setLoginSrc, getIframe.get(0).contentWindow);
							}
						}
					});
				}

			}, setSSO_host);
		}
	});
})(jQuery);
//如果页面中需要页面形式登录
if($("iframe[name='sso-LoginIframe']").length != 0) {
	$.ssoPageLogin();
}
else if($("iframe[name='sso-RegistIframe']").length != 0) {
	$.ssoPageRegist();
}
else if($("iframe[name='sso-ChangepwdIframe']").length != 0) {
	$.ssoPageChangepwd();
}