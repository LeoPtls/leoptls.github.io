$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);

    // On CV page, avoid Bootstrap ScrollSpy mis-highlighting adjacent short sections.
    // We keep TOC links, but control active state explicitly on click + hash changes.
    var isCvPage = window.location.pathname.replace(/\/$/, "") === "/cv";
    if (isCvPage) {
      var setActiveCvToc = function (hash) {
        if (!hash) return;
        var normalizedHash = hash.startsWith("#") ? hash : "#" + hash;
        var $links = $(navSelector + " a.nav-link");
        $links.removeClass("active");
        $links.filter('[href="' + normalizedHash + '"]').addClass("active");
      };

      $(navSelector).on("click", "a.nav-link", function () {
        setActiveCvToc($(this).attr("href"));
      });

      $(window).on("hashchange", function () {
        setActiveCvToc(window.location.hash);
      });

      setActiveCvToc(window.location.hash);
      return;
    }

    // Keep ScrollSpy highlight aligned with the real sticky header height.
    // This avoids activating the next section too early (e.g., Academic -> Other).
    var navbarHeight = $(".navbar").outerHeight() || 0;
    var scrollSpyOffset = Math.max(20, navbarHeight + 8);
    $("body").scrollspy({
      target: navSelector,
      offset: scrollSpyOffset,
    });

    // Ensure ScrollSpy recalculates positions after page/layout settles.
    $(window).on("load", function () {
      $("body").scrollspy("refresh");
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
