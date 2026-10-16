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

    // Follow the visible CV heading without ScrollSpy's forced last-section
    // activation at the bottom of the page (several CV sections are short).
    var isCvPage = $(".cv").length > 0;
    if (isCvPage) {
      var cvSections = $myNav.find("a.nav-link").toArray().map(function (link) {
        return { link: link, heading: document.getElementById(decodeURIComponent(link.hash.slice(1))) };
      }).filter(function (section) {
        return section.heading;
      });
      var updateCvToc = function () {
        var navbar = document.querySelector(".navbar.fixed-top, .navbar.sticky-top");
        var threshold = (navbar ? navbar.getBoundingClientRect().bottom : 0) + 8;
        var activeSection = cvSections[0];
        cvSections.forEach(function (section) {
          if (section.heading.getBoundingClientRect().top <= threshold) activeSection = section;
        });
        cvSections.forEach(function (section) {
          var active = section === activeSection;
          section.link.classList.toggle("active", active);
          if (active) section.link.setAttribute("aria-current", "location");
          else section.link.removeAttribute("aria-current");
        });
      };
      var cvTocFramePending = false;
      var scheduleCvTocUpdate = function () {
        if (cvTocFramePending) return;
        cvTocFramePending = true;
        window.requestAnimationFrame(function () {
          cvTocFramePending = false;
          updateCvToc();
        });
      };
      $(window).on("scroll resize load hashchange", scheduleCvTocUpdate);
      if (document.fonts) document.fonts.ready.then(scheduleCvTocUpdate);
      updateCvToc();
    } else {
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
