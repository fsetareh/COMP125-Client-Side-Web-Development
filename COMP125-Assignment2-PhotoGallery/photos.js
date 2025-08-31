"use strict";

var photoOrder = [1, 2, 3, 4, 5];
var autoAdvance = setInterval(rightAdvance, 5000);
var figureCount = 3;
var isExpanded = false;

function populateFigures() {
   var filename, currentFig;
   if (figureCount === 3) {
      for (var i = 1; i < 4; i++) {
         filename = "images/IMG_0" + photoOrder[i] + "sm.jpg";
         currentFig = document.getElementsByTagName("img")[i - 1];
         currentFig.src = filename;
      }
   } else {
      for (var i = 0; i < 5; i++) {
         filename = "images/IMG_0" + photoOrder[i] + "sm.jpg";
         currentFig = document.getElementsByTagName("img")[i];
         currentFig.src = filename;
      }
   }
}

function rightArrow() {
   clearInterval(autoAdvance);
   rightAdvance();
   playAudio();
}

function leftArrow() {
   clearInterval(autoAdvance);
   for (var i = 0; i < 5; i++) {
      if ((photoOrder[i] - 1) === 0) {
         photoOrder[i] = 5;
      } else {
         photoOrder[i] -= 1;
      }
   }
   populateFigures();
   playAudio();
}

function rightAdvance() {
   for (var i = 0; i < 5; i++) {
      if ((photoOrder[i] + 1) === 6) {
         photoOrder[i] = 1;
      } else {
         photoOrder[i] += 1;
      }
   }
   populateFigures();
}

function playAudio() {
   const audio = document.getElementById("bgAudio");
   if (audio) {
      audio.currentTime = 0;
      audio.play();
   }
}

function pauseAudio() {
   const audio = document.getElementById("bgAudio");
   if (audio) {
      audio.pause();
   }
}

function toggleFigures() {
   const fig1 = document.getElementById("fig1");
   const fig5 = document.getElementById("fig5");
   const button = document.getElementById("toggleButton");

   if (!isExpanded) {
      fig1.style.display = "inline";
      fig5.style.display = "inline";
      figureCount = 5;
      button.textContent = "Show fewer patterns";
   } else {
      fig1.style.display = "none";
      fig5.style.display = "none";
      figureCount = 3;
      button.textContent = "Show more patterns";
   }
   isExpanded = !isExpanded;
   populateFigures();
}

function createEventListeners() {
   document.getElementById("leftarrow").addEventListener("click", leftArrow);
   document.getElementById("rightarrow").addEventListener("click", rightArrow);
   document.getElementById("toggleButton").addEventListener("click", toggleFigures);
}

function setUpPage() {
   createEventListeners();
   populateFigures();
}

window.addEventListener("load", setUpPage);
