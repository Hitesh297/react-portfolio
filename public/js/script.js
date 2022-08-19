//handle events for right menu
window.onload = function() {
  var hamburger = document.getElementById("hamburger");
  var rightmenu = document.getElementById("right-menu");
  var rightmenuitems = document.querySelectorAll("#right-menu ol a");
  var hamburgericon = document.getElementById("hamburger-icon");
  var closeicon = document.getElementById("close-icon");
  rightmenuitems.forEach((element) => {
    element.onclick = toggleMenu;
  });

  // hamburger.onclick = toggleMenu;

  function toggleMenu() {
    rightmenu.classList.toggle("open");
    if (rightmenu.classList.contains("open")) {
      hamburgericon.style.display = "none";
      closeicon.style.display = "block";
    } else {
      hamburgericon.style.display = "block";
      closeicon.style.display = "none";
    }
  }

  //hide navbar on scroll
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("header").style.top = "0";
    } else {
      document.getElementById("header").style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;

    // slide and show section
    var reveals = document.querySelectorAll(".reveal");

    for (let i = 0; i < reveals.length; i++) {
      var windowheight = window.innerHeight;
      var revealtop = reveals[i].getBoundingClientRect().top;
      var revealpoint = 30;

      if (revealtop < windowheight - revealpoint) {
        reveals[i].classList.add("activescroll");
      } else {
        reveals[i].classList.remove("activescroll");
      }
    }
  };

  // show tab selector movement in experience section
  // const tabs = document.getElementsByClassName("tabs");
  // console.log(tabs.length);
  // for (var i = 0; i < tabs.length; i++) {
  //   // if (i == 0) {
  //   //   tabs[i].classList.add("active");
  //   // }
  //   tabs[i].addEventListener("click", (e) => handleClick(e));
  // }

  // const roleDescriptions = document
  //   .getElementsByClassName("content__section")[0]
  //   .classList.add("visible");
  // console.log("check error");
  // console.log(roleDescriptions[0]);
  // roleDescriptions[0].classList.add('visible');

  // load the typing effect after 6 seconds
  window.setTimeout(function() {
    var roletitle = document.getElementById("role-title");
    var options = {
      strings: ["Software Engineer", "Full Stack Developer", "Web Developer"],
      typeSpeed: 50,
      backSpeed: 20,
      backDelay: 2000,
      loop: true,
    };

    roletitle.innerText = "";
    roletitle.classList.add("auto-type");
    var typed = new Typed(".auto-type", options);
  }, 6000);

  // handle form submit
  // $("#contact-form").bind("submit", function (e) {
  //   e.preventDefault();
  //   var name = $("#name").val();
  //   var email = $("#email").val();
  //   var message = $("#message").val();

  //   console.log(name, email, message);

  //   $.ajax({
  //     url: "send_email.php",
  //     type: "POST",
  //     data: {
  //       name: name,
  //       email: email,
  //       message: message,
  //     },
  //     success: function (msg) {
  //       // var message = document.getElementById('message-alert');
  //       // message.innerHTML = 'Message Sent!';
  //       $("#contact-form")[0].reset();
  //       alert("Message Sent!");
  //     },
  //   });
  // });
};
