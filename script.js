'use strict';
import {console_color,console_red,console_orange,console_yellow,console_green,
  console_blue,console_purple,console_magenta,console_cyan} from './logColor.js';

// ------------------------------------------------------------------------------------------------
//*                        ----- SLOT MACHINE COMPLETED VERSION -----  
// ------------------------------------------------------------------------------------------------

//	['.9','.8','.7','.6','.5','.4','.3','.2','.1']
    ['e6','cc','b3','99','80','66','4d','33','1a']


let reelCount = 1;
  let total = 0;
    let currentDept = 0;
      let panelsRemain = 3;
      let spinStopBtnEvent = false;
    let activeLight = false;
  let applyCheckOut = false;
    let checkOutDept = false; 
      let checkOutLock = false;  
        let bigSpin = false;
        let bigSpinFlash = false;
      let freeSpin = false;
    let pointsAdded = false;
  let stopAutomated = false;
let insertMoney = false;

class Panel {
  constructor() {
    const main = document.querySelector('main');
    const section = document.createElement('section'); 
      section.classList.add('panel');
      this.img = document.createElement('img');
      this.img.classList.add('panelImage');
      this.img.src = this.getRandomImg();
      this.stopBtn = document.createElement('div');
      this.stopBtn.classList.add('stop');
      this.stopBtn.textContent = 'STOP';
      this.stopBtn.Howl = new Howl({ src: ['mp3/stop.mp3'], volume: 0.5});
      this.stopBtn.volume = this.stopBtn.Howl._volume/1.5;
      this.panelShadow = document.createElement('span');
      section.appendChild(this.img);
      section.appendChild(this.stopBtn);
      section.appendChild(this.panelShadow); 
      main.appendChild(section); 
    //* event stopBtn --------------------------------------
    this.stopBtn.addEventListener('click', () => { 
      if(!spinStopBtnEvent) return;
      if(this.stopBtn.classList.contains('js_inActive')) return; //***> 
      this.stopBtn.classList.add('js_inActive'); //***> 
      this.stopBtn.classList.add('js_stopBtnAnimation'); // trf animation
      reelHandler.classList.remove('active'); 
      reelHandler.removeEventListener('click', stopAutomate); 
      this.stopBtn.Howl.play(); //*
      clearTimeout(this.timeout);
      this.manipulateReel(); //^^^^^^^^^^^^^^^^^^^^^^^^ */
      reelCount++
      panelsRemain--;
      // console.log(panelsRemain); //* log 
      if(panelsRemain === 0) { //* JUDGEMENT //
        if(insertPoint.classList.contains('js_blank')) { // reset BIG SPIN  
          winPoint.classList.remove('js_bigSpinRed'); // reset text & color 
          winPoint.classList.remove('adjustFontSize');
          bigSpinX.classList.remove('js_bigSpinX'); // BIG SPIN X remove
          winPointSetDefault();
        }
        freeSpinHowl.stop(); bigSpinHowl.stop(); 
        checkForMatchedAll(); checkForUnMatched(); checkForTwoPairMatched();  //* JUDGEMENT //
        checkForTwoPairSeven(); checkForTwoPairExtraSeven(); checkForExtraThreeSeven(); 
        checkForTwoPairExtraDiamond(); checkForTwoPairExtraDollar(); checkForTwoPairExtraPumpkin(); 
        bigSpinFailure(); //* JUDGEMENT // //* JUDGEMENT //
        saveData(); //*** 
        panelsRemain = 3; // reset counter 
        [spinStopBtnEvent, activeLight] = [false, false]; 
        [applyCheckOut, bigSpin] = [false, false]; 
        [pointsAdded, stopAutomated] = [false, false]; 
          spinBtn.classList.remove('js_inActive'); // reset btn opacity 
          spinBtn.classList.remove('js_spinBtnAnimation'); // reset trf animation  
          bigSpinX.classList.remove('activate'); // reset bigSpinX activate //*
          isClosure(); //*>
        if(total === 0) {  // rewrite default message 
          spinBtn.textContent = 'INSERT MONEY TO PLAY';
            betPoint.textContent = 0;
              deactivateBgmHowl(); //*
              setTimeout(() => { tryAgainHowl.play() }, 500); 
            insertMoney = false; //*
          insertPoint.classList.remove('active');
        }
        if(currentDept === 0 && total <= 0)  { 
          checkOutDept = true; // game over
          checkOutLock = false;
          checkOut.classList.remove('active');
        }
      }
    });
  } //* OUT OF Constructor 

  getRandomImg() {
    const images = ['img/dollar.jpg','img/dollar.jpg','img/dollar.jpg','img/bell.jpg'];
    // const images = ['img/bell.jpg','img/cherry.jpg','img/watermelon.jpg','img/diamond.jpg',
    //   'img/bar.jpg','img/seven.jpg','img/dollar.jpg','img/pumpkin.jpg','img/blueSeven.jpg'];
    return images[Math.floor(Math.random() * images.length)];
  }
  
  manipulateImg() {
    const image = ['img/pumpkin.jpg','img/bar.jpg',
      'img/watermelon.jpg','img/cherry.jpg','img/bell.jpg'];
    return image[Math.floor(Math.random() * image.length)];
  }

  manipulateReel() {
    if(reelCount <= 15) {
      // console.log('inactive'); //* log
      // console.log(`inactive ${reelCount}`); //* log
    }
    if(reelCount <= 15) return;
      // console.log('activate now'); //* log
      // console.log(`activate now ${reelCount}`); //* log
      this.img.src = this.manipulateImg();
    if(reelCount === 21) { reelCount = 0 }
  }

  spin() {
    this.panelShadow.classList.remove('js_unMatched-effect');  // reset shadow effect 
      this.stopBtn.classList.remove('js_inActive'); // stop btn opacity effect remove  
        this.stopBtn.classList.remove('js_stopBtnAnimation'); // reset trf animation 
      this.img.src = this.getRandomImg();
    this.timeout = setTimeout(() => {
      this.spin();
    }, 15);
  }

  matched(p1, p2) {
    return this.img.src === p1.img.src && this.img.src === p2.img.src;
  }

  unMatched(p1, p2) { 
    return this.img.src !== p1.img.src && this.img.src !== p2.img.src;
  }

  unMatchEffect() {
    this.panelShadow.classList.add('js_unMatched-effect'); // shadow effect
  }

  disableUnMatchEffect() {
    this.panelShadow.classList.remove('js_unMatched-effect');
  }
} //* OUT OF CLASS
const panels = [ new Panel(), new Panel(), new Panel() ]; //* instance ***

//* ---------------------------------------------------------------------------------------------------------

//* reelHandler EventListener ----------------
const reelHandler = document.querySelector('.reelHandler');
  function stopAutomate() {
    if(stopAutomated) return;
    autoStopHowl.play(); stopAutomated = true;
    reelHandler.classList.remove('active');
    setTimeout(() => { panels[0].stopBtn.click()}, 400);
    setTimeout(() => { panels[1].stopBtn.click()}, 700);
    setTimeout(() => { panels[2].stopBtn.click()}, 1200);
  }

  function bigSpinFailure() { //* bigSpinFailure
    if(bigSpinX.classList.contains('activate') && !pointsAdded) {
      deactivateBgmHowl(); //*
        loadFailureData(2000);
      setTimeout(() => { bigSpinFailureHowl.play() }, 500);
      setTimeout(() => { bigSpinFailureHowl.play() }, 1000);
    }
  }

//* audio sound event --------------------------------

let bgmHowlId;
let betXSound = false;
let gameStartSound = false;
let tryAgainSound = false;
let loadCount = 0;

const volArray = [
  0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45,
  0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 
  1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45,
  1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2,
];

var bgmHowl = new Howl({
  src: ['mp3/bgm.mp3'],
  onload: function() {
    loadCount++;
    // console.log(loadCount); //*log
  },
  loop: true,
  volume: 0.1, 
  //* volume must between 0.0 ~ 2.0
});
//* volume must between 0.0 ~ 1
var insertHowl = new Howl({src: ['mp3/insert.mp3'], volume: 0.5,
  onplay: function() { betXSound = true; gameStartSound = true },
});
var gameStartHowl = new Howl({ src: ['mp3/gameStart.mp3'], volume: 0.5});
var betXHowl = new Howl({src: ['mp3/betX.mp3'], volume: 0.5});
var spinHowl = new Howl({src: ['mp3/spin.mp3'], volume: 0.5});
var autoStopHowl = new Howl({src: ['mp3/autoStop.mp3'],volume: 0.5});
var outSuccessHowl = new Howl({src: ['mp3/outSuccess.mp3'],volume: 0.5});
var outFailureHowl = new Howl({src: ['mp3/outFailure.mp3'],volume: 0.5});
var cheerHowl = new Howl({src: ['mp3/cheer.mp3'],volume: 1});
var cheerShortHowl = new Howl({src: ['mp3/cheerShort.mp3'],volume: 1});
var coinTwoPairHowl = new Howl({src: ['mp3/coinTwoPair.mp3'],volume: 0.5});
var coinTwoPairExtraHowl = new Howl({src: ['mp3/coinTwoPairExtra.mp3'],volume: 0.5});
var winHowl = new Howl({src: ['mp3/win.mp3'],volume: 1});
var victoryHowl = new Howl({src: ['mp3/victory.mp3'],volume: 1});
var bigSpinHowl = new Howl({src: ['mp3/bigSpin.mp3'], loop: true, volume: 0.5});
var freeSpinHowl = new Howl({src: ['mp3/freeSpin.mp3'], loop: true, volume: 0.5});
var checkOutNoticeHowl = new Howl({src: ['mp3/checkOutNotice.mp3'], volume: 0.5, loop: true});
var bigSpinFailureHowl = new Howl({src: ['mp3/bigSpinFailure.mp3'], volume: 0.5});
var tryAgainHowl = new Howl({src: ['mp3/tryAgain.mp3'], volume: 0.5,
  onplay: function() { tryAgainSound = true },
  onend: function() { tryAgainSound = false}
});
  const fetchById = ['0biOxJbzaFmVWc6','zaFmVWc6gAhwW2','hwW2NqskjSREWz',
    'xJbzaFmVWc6gza','E3haFmVRE3mVWc6gA','gAhwW2NqskjSRE3hk'];
  window.addEventListener('click', (evt) => {
    evt.preventDefault();
  });

//* BGM & Machine volume event --------------------------------

let tid_Volume;
let bgmVolume = bgmHowl._volume*10*2; //*>
let machineVolume = gameStartHowl._volume*10*2; //*>
setBgmVolume(volArray[bgmVolume]);
setMachineVolume(volArray[machineVolume]);

const GMOsiDoGYmhO = fetchById.slice(2, -2);
const atADtRceSsISihT = fetchById.slice(-1);
const hCteFOTyEkyHpiG4 = fetchById.slice(0, 1);
const icons = document.querySelectorAll('.icon');
const layers = document.querySelectorAll('.layer');
const volGage = document.querySelector('.volGage');
volGage.style.setProperty('--vol', bgmVolume * 50 + '%');


icons.forEach((icon, index) => {
  icon.addEventListener('click', () => {
    icon.classList.add('active');
    volGage.classList.remove('activeMachineGage');
    volGage.classList.add('activateBgmGage');
    setTimeout(() => icon.classList.remove('active'), 100);
    volGage.style.opacity = 1;
    if(index === 1) {
      if(bgmVolume === volArray.length - 1) return;
      bgmVolume++;
      // console.log(bgmVolume); //* log
    } else { 
      if(bgmVolume === 0) return; 
      bgmVolume--;
    }
    setBgmVolume(volArray[bgmVolume]);
    volGage.style.setProperty('--vol', volArray[bgmVolume] * 50 + '%');
    clearTimeout(tid_Volume);
    tid_Volume = setTimeout(() => volGage.style.opacity = 0, 3000);
  });
});

layers.forEach((layer, index) => {
  layer.addEventListener('click', () => {
    layer.classList.add('active');
    volGage.classList.remove('activateBgmGage');
    volGage.classList.add('activeMachineGage');
    setTimeout(() => layer.classList.remove('active'), 100);
    volGage.style.opacity = 1;
    if(index === 1) {
      if(machineVolume === volArray.length - 21) return;
      machineVolume++;
    } else { 
      if(machineVolume === 0) return;
      machineVolume--;
    }
    setMachineVolume(volArray[machineVolume]);
    volGage.style.setProperty('--vol', volArray[machineVolume] * 100 + '%');
    clearTimeout(tid_Volume);
    tid_Volume = setTimeout(() => volGage.style.opacity = 0, 3000);
  });
});

function setBgmVolume(vol) { bgmHowl.volume(vol/5); }
function setMachineVolume(vol) {
  panels.forEach(panel => { panel.stopBtn.Howl.volume(vol/1.5)});
  insertHowl.volume(vol); gameStartHowl.volume(vol);
  betXHowl.volume(vol); spinHowl.volume(vol);
  autoStopHowl.volume(vol); outSuccessHowl.volume(vol); 
  outFailureHowl.volume(vol); cheerHowl.volume(vol*5); 
  coinTwoPairHowl.volume(vol); coinTwoPairExtraHowl.volume(vol); 
  winHowl.volume(vol*3); victoryHowl.volume(vol*3); 
  bigSpinHowl.volume(vol); bigSpinFailureHowl.volume(vol);
  tryAgainHowl.volume(vol);
}
function deactivateBgmHowl() { bgmHowl.stop(); bgmHowlId = ''; }

  const mobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
  const myDeviceHeight = 720;
  const process_env = `${hCteFOTyEkyHpiG4}`;
  const deviceHeight = innerHeight;
  let diff = deviceHeight - myDeviceHeight;
  const base64Str = `${GMOsiDoGYmhO}`;           
  const uuid = `${atADtRceSsISihT}`;
  const headPanel = 100; //* 110
  
//* desktop window with ios device size ---
  // document.documentElement.style.setProperty('--marginTop', `${0}px`);
//* --------------------------------------------------------------------

  //* iphone ---
    if(innerHeight <= 720) {
      document.documentElement.style.setProperty('--marginTop', `${0}px`);
      // document.documentElement.style.setProperty('--marginTop', `${diff + headPanel}px`);
    } else { document.documentElement.style.setProperty('--marginTop', `${diff/2}px`)}

  window.addEventListener('click', (evt) => { 
    evt.preventDefault();
  }, {passive: false});
  console.log(base64Str); //* log

  window.addEventListener('touchmove', (e) => {
    if(innerHeight <= 667 && innerWidth >= 375) {
    e.preventDefault()
  }
  }, {passive:false});

//* check matched & unMatched -----------------

function checkForMatchedAll() {
  if(panels[2].matched(panels[1], panels[0])) {  
    pointAdd_matchedAll(); // BIG SPIN includes    
  }
}

function checkForUnMatched() {
  if(panels[0].unMatched(panels[1], panels[2])) {  
    panels[0].unMatchEffect(); 
  }
  if(panels[1].unMatched(panels[0], panels[2])) {  
    panels[1].unMatchEffect(); 
  }
  if(panels[2].unMatched(panels[0], panels[1])) {  
    panels[2].unMatchEffect(); 
  }
}

//* check two pair ------------------------------------

function checkForTwoPairMatched() {
  if((panels[0].img.src === panels[2].img.src)  
    && panels[2].img.src !== panels[1].img.src) { 
      if(panels[2].img.src.includes('diamond') 
        || panels[2].img.src.includes('dollar')) {
        panels[1].disableUnMatchEffect();
      }
    if(panels[1].img.src.includes('seven') 
      || panels[1].img.src.includes('blueSeven') 
      || panels[1].img.src.includes('diamond') 
      || panels[1].img.src.includes('dollar') 
      || panels[1].img.src.includes('pumpkin')) return;
        pointAdd_twoPair();
    // console.log('checkForTwoPair'); //* log
  }
}

//* check two pair seven --------------------------------

function checkForTwoPairSeven() {
  if(!panels[1].img.src.includes('seven') && !panels[1].img.src.includes('blueSeven')) {
    if(panels[0].img.src.includes('seven') && panels[2].img.src.includes('blueSeven')
    || panels[0].img.src.includes('blueSeven') && panels[2].img.src.includes('seven')) {
      panels[0].disableUnMatchEffect(); panels[2].disableUnMatchEffect();
      if(panels[1].img.src.includes('diamond') || panels[1].img.src.includes('dollar') 
      || panels[1].img.src.includes('pumpkin')) {
        panels[1].disableUnMatchEffect(); pointAdd_twoPairSevenExtra();
      } else { pointAdd_twoPair() }
      // console.log('checkForTwoPairSeven'); //* log
    }
  }
}

function pointAdd_twoPairSevenExtra() {
  if(panels[1].img.src.includes('diamond')) { 
    pointRate(600); 
    setTimeout(() => { coinTwoPairHowl.play() }, 200); 
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 400);
  }
  if(panels[1].img.src.includes('dollar')) { 
    pointRate(400); 
    setTimeout(() => coinTwoPairExtraHowl.play(), 200);
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 400);
  }
  if(panels[1].img.src.includes('pumpkin')) { 
    pointRate(300); 
    setTimeout(() => coinTwoPairExtraHowl.play(), 200);
  }
  pointsAdded = true; //*>
}

//* check two pair extra seven ------------------------------------

function checkForTwoPairExtraSeven() { //* Tow Pair Match ! & center is seven or blueSeven
  if((panels[0].img.src === panels[2].img.src) && panels[1].img.src.includes('seven') 
  || (panels[0].img.src === panels[2].img.src) && panels[1].img.src.includes('blueSeven')) {
    pointAdd_twoPairExtraSeven(); // console.log('checkForTwoPairExtraSeven'); //* log
    if(panels[2].img.src.includes('seven') 
    || panels[2].img.src.includes('blueSeven') 
    || panels[2].img.src.includes('diamond') 
    || panels[2].img.src.includes('dollar') 
    || panels[2].img.src.includes('pumpkin') 
    || panels[2].img.src.includes('bar')) {
      panels[1].disableUnMatchEffect();
    }
  }
}

//* check two pair extra three seven ------------------------------------

function checkForExtraThreeSeven() {
  if((panels[0].img.src === panels[1].img.src && panels[1].img.src.includes('seven')) 
    && panels[2].img.src.includes('blueSeven')) {
    panels[2].disableUnMatchEffect();
    pointAdd_extraThreeSeven();
  } else if((panels[1].img.src === panels[2].img.src && panels[1].img.src.includes('seven')) 
    && panels[0].img.src.includes('blueSeven')) {
    panels[0].disableUnMatchEffect();
    pointAdd_extraThreeSeven();
  }

  if((panels[0].img.src === panels[1].img.src && panels[1].img.src.includes('blueSeven'))
  && panels[2].img.src.includes('seven')) {
    panels[2].disableUnMatchEffect();
    pointAdd_extraThreeSeven();
  } else if((panels[1].img.src === panels[2].img.src && panels[1].img.src.includes('blueSeven')) 
    && panels[0].img.src.includes('seven')) {
    panels[0].disableUnMatchEffect();
    pointAdd_extraThreeSeven();
  }
}

//* check two pair extras ------------------------------------


function checkForTwoPairExtraDiamond() {
  if((panels[0].img.src === panels[2].img.src) 
    && panels[1].img.src.includes('diamond')) {
      panels[1].disableUnMatchEffect();
    pointAdd_twoPairExtraDiamond();
    pointsAdded = true; //*>
  }
}

function checkForTwoPairExtraDollar() { 
  if((panels[0].img.src === panels[2].img.src) 
    && panels[1].img.src.includes('dollar')) {
      panels[1].disableUnMatchEffect();
    pointAdd_twoPairExtraDollar();
  }
}

function checkForTwoPairExtraPumpkin() { 
  if((panels[0].img.src === panels[2].img.src) 
    && panels[1].img.src.includes('pumpkin')) {
      pointAdd_twoPairExtraPumpkin();
    if(panels[2].img.src.includes('bar') // shade off
      || panels[2].img.src.includes('watermelon') 
        || panels[2].img.src.includes('cherry') 
      || panels[2].img.src.includes('bell')) return;
    panels[1].disableUnMatchEffect();
  }
}

//* point panel -------------------------------------------------

  const bigSpinX = document.querySelector('.btn-bigSpinX');
    const winPoint = document.querySelector('.win-point');
      const totalPoint = document.querySelector('.total-point');
        const betPoint = document.querySelector('.bet-point');
        const deptPoint = document.querySelector('.dept-point');
      const winText = document.querySelector('.win-text');
    const totalText = document.querySelector('.total-text');
      const betText = document.querySelector('.bet-text');
        winPoint.textContent = 0;
      totalPoint.textContent = 0;
    betPoint.textContent = 0;
  deptPoint.textContent = 0;

//* save data to local storage ------------------------------------

function saveData() { 
  localStorage.setItem('total', total);
  localStorage.setItem('currentDept', currentDept);
  adjustPointsFontSize();
} 

function getData() { 
  totalPoint.textContent = parseFloat(localStorage.getItem('total'));
  deptPoint.textContent = parseFloat(localStorage.getItem('currentDept'));
  total = parseFloat(localStorage.getItem('total'));
  currentDept = parseFloat(localStorage.getItem('currentDept'));
  adjustPointsFontSize();
} 
if(localStorage.getItem('total')) { getData(); checkOutLock = true } //***

//^ pointAdd // Matched All -----------------------------------------------------

function pointAdd_matchedAll() {
  if(panels[2].img.src.includes('seven')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200); 
    cheerHowl.play(); releaseConfetti(300, 1); 
    getFetchData('threeSeven', 70, 53, 0, 5000);  
    pointRate(5000); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 3000); 
  } 
  else if(panels[2].img.src.includes('blueSeven')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200); 
    cheerHowl.play(); releaseConfetti(200, 1); 
    getFetchData('threeBlueSeven', 55, 49, 0, 3500); 
    pointRate(4000); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 2500);
  } 
  else if(panels[2].img.src.includes('diamond')) { //* BIG SPIN 
    if(bigSpinFlash) { pointRate(3000) }
    activateBigSpinX(); //* BIG SPIN //* BIG SPIN
  } 
  else if(panels[2].img.src.includes('dollar')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    cheerHowl.play(); releaseConfetti(75, 150); 
    getFetchData('dollar', 57, 47, 0, 3500); 
    pointRate(2000); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 2000);
  } 
  else if(panels[2].img.src.includes('pumpkin')) { //* FREE SPIN
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    cheerShortHowl.play(); 
    pointRate(1500); pointsAdded = true;
    freeSpinPumpkinMatched(); //* FREE SPIN //* FREE SPIN
  } 
  else if(panels[2].img.src.includes('bar')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    releaseConfetti(30, 150); cheerShortHowl.play(); 
    getFetchData('bar', 48, 55, 0, 3000); 
    pointRate(1000); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 1800);
  } 
  else if(panels[2].img.src.includes('watermelon')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    releaseConfetti(30, 150); cheerShortHowl.play(); 
    getFetchData('watermelon', 65, 50, -100, 3000);
    pointRate(500); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 1800);
  } 
  else if(panels[2].img.src.includes('cherry')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    releaseConfetti(30, 150); cheerShortHowl.play(); 
    getFetchData('cherry', 65, 50, -225, 3000); 
    pointRate(500); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 1800);
  } 
  else if(panels[2].img.src.includes('bell')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    releaseConfetti(30, 150); cheerShortHowl.play(); 
    getFetchData('bell', 43, 51, 0, 3000); 
    pointRate(500); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 1800);
  }
}

let tid_BigSpin;
function activateBigSpinX() {
  //* spinBtn disabled dblclick
  [gameStartSound, betXSound] = [true, true]; 
  tid_BigSpin = setTimeout(() => { //* BIG SPIN //* BIG SPIN
    panels.forEach(panel => { panel.spin() });
    bigSpinHowl.play(); //*** */
    bigSpin = true;
      bigSpinFlash = true; 
        applyCheckOut = true;
      spinStopBtnEvent = true; // disabled dblclick
    freeSpin = false; //*
    spinBtn.classList.add('js_inActive'); //* 
      insertPoint.classList.add('js_blank'); 
      winPoint.classList.remove('js_winRed');
        winPoint.classList.add('js_bigSpinRed');
        bigSpinX.classList.add('js_bigSpinX');
        bigSpinX.classList.add('activate'); //***
        winPoint.textContent = 'BIG SPIN'; 
      winPoint.classList.add('adjustFontSize');
      winPoint.classList.add('bigSpinFontSize');
      reelHandler.classList.add('active'); //*
      reelHandler.addEventListener('click', stopAutomate); //*
    [gameStartSound, betXSound] = [false, false]; 
  }, 500); //* BIG SPIN //* 
}

let tid_freeSpin;
function freeSpinPumpkinMatched() {
  //* spinBtn disabled dblclick
  [gameStartSound, betXSound] = [true, true]; 
  tid_freeSpin = setTimeout(() => { //* FREE SPIN //* FREE SPIN
    panels.forEach(panel => { panel.spin() })
    freeSpinHowl.play(); //*** */
    freeSpin = true;
    bigSpin = true;
      activeLight = true; // disabled 5x2x click  
        applyCheckOut = true;
      spinStopBtnEvent = true; // disabled dblclick
    spinBtn.classList.add('js_inActive'); //* 
      insertPoint.classList.add('js_blank'); 
      winPoint.classList.remove('js_winRed');
        winPoint.classList.add('js_bigSpinRed');
        winPoint.classList.add('adjustFontSize');
        winPoint.classList.add('pumpkinFontSize');
      winPoint.textContent = 'FREE SPIN'; 
      reelHandler.classList.add('active'); //*
      reelHandler.addEventListener('click', stopAutomate); //*
    [gameStartSound, betXSound] = [false, false]; 
  }, 1000); //* FREE SPIN //*
}

//^ pointAdd // Two Pair ------------------------------------

function pointAdd_twoPair() {
  if(panels[0].img.src.includes('seven') 
    && panels[2].img.src.includes('seven')) {
    setTimeout(() => coinTwoPairHowl.play(), 200); 
    pointRate(500); pointsAdded = true; return;
  } else if(panels[0].img.src.includes('blueSeven') 
    && panels[2].img.src.includes('blueSeven')) {
    setTimeout(() => coinTwoPairHowl.play(), 200); 
    pointRate(400); pointsAdded = true; return;
  } else if(panels[2].img.src.includes('seven') 
    || panels[2].img.src.includes('blueSeven')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(200); pointsAdded = true; 
  } else if(panels[2].img.src.includes('diamond')) {
    setTimeout(() => coinTwoPairHowl.play(), 200); 
    pointRate(300); pointsAdded = true; 
  } else if(panels[2].img.src.includes('dollar')) {
    setTimeout(() => coinTwoPairHowl.play(), 200); 
    pointRate(200); pointsAdded = true; 
  } else if(panels[2].img.src.includes('pumpkin')) {
    setTimeout(() => coinTwoPairHowl.play(), 200); 
    pointRate(150); pointsAdded = true; 
  } else if(panels[2].img.src.includes('bar')) {
    setTimeout(() => coinTwoPairHowl.play(), 200); 
    pointRate(100); pointsAdded = true; 
  }  else if(panels[2].img.src.includes('watermelon')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true; 
  } else if(panels[2].img.src.includes('cherry')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true; 
  } else if(panels[2].img.src.includes('bell')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true; 
  } 
}

//^ pointAdd // Two Pair Extra Seven ----------------------------
//* Center Seven ---

function pointAdd_twoPairExtraSeven() { 
  //* Three Seven & Red seven center 
  if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('blueSeven')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200); 
    cheerHowl.play(); releaseConfetti(200, 1);
    getFetchData('redSevenCenter', 65, 53, 0, 3800); 
    pointRate(3000); pointsAdded = true; 
    setTimeout(() => { winHowl.play() }, 2000);
  }
  //* redSeven Center & Two Pair
  if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('diamond')) {
    coinTwoPairHowlMix();
    pointRate(3000); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('dollar')) {
    coinTwoPairHowlMix();
    pointRate(2000); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('pumpkin')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(250); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('bar')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(100); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('watermelon')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('cherry')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('seven') 
  && panels[2].img.src.includes('bell')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  //* Three Seven & blueSeven center 
  if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('seven')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    cheerHowl.play(); releaseConfetti(200, 1);
    getFetchData('blueSevenCenter', 55, 50, 0, 3800); 
    pointRate(2500); pointsAdded = true; 
    setTimeout(() => { winHowl.play() }, 2000);
  }
    //* blueSeven Center & Two Pair
  if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('diamond')) {
    coinTwoPairHowlMix();
    pointRate(2400); pointsAdded = true; 
  }
  else if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('dollar')) {
    coinTwoPairHowlMix();
    pointRate(1600); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('pumpkin')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(200); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('bar')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(100); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('watermelon')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('cherry')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('blueSeven') 
  && panels[2].img.src.includes('bell')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
}

//^ pointAdd // Extra Three Seven ----------------------------

function pointAdd_extraThreeSeven() {
  //* Three Seven // One blueSeven
  if(panels[0].img.src.includes('seven') 
    && panels[1].img.src.includes('seven') 
      && panels[2].img.src.includes('blueSeven') 
  || panels[0].img.src.includes('blueSeven') 
    && panels[1].img.src.includes('seven') 
      && panels[2].img.src.includes('seven')) {
        setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
          cheerHowl.play(); releaseConfetti(150, 100); 
        getFetchData('twoRedSeven', 60, 55, 0, 3800); 
      pointRate(2000); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 2000);
  }
  //* Three Seven // One redSeven
  if(panels[0].img.src.includes('blueSeven') 
    && panels[1].img.src.includes('blueSeven') 
      && panels[2].img.src.includes('seven') 
  || panels[0].img.src.includes('seven') 
    && panels[1].img.src.includes('blueSeven') 
      && panels[2].img.src.includes('blueSeven')) {
        setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
          cheerHowl.play(); releaseConfetti(150, 100); 
        getFetchData('twoBlueSeven', 45, 45, 0, 3800); 
      pointRate(1500); pointsAdded = true;
    setTimeout(() => { winHowl.play() }, 2000);
  }
}


//^ pointAdd // Two Pair Extra Diamond ----------------------------

function pointAdd_twoPairExtraDiamond() {
  if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('seven')) { //* SIDE SEVEN
    coinTwoPairHowlMix();
    pointRate(1500); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('blueSeven')) {
    coinTwoPairHowlMix();
    pointRate(1200); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('dollar')) {
    coinTwoPairHowlMix();
    pointRate(600); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
    && panels[2].img.src.includes('pumpkin')) {
      setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(450); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('bar')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(300); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('watermelon')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(150); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('cherry')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(150); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('diamond') 
  && panels[2].img.src.includes('bell')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(150); pointsAdded = true;
  }
}

//^ pointAdd // Two Pair Extra Dollar ----------------------------
//* Center Dollar & Two Pair Match ---

function pointAdd_twoPairExtraDollar() {
  if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('seven')) { 
    coinTwoPairHowlMix();
    pointRate(1000); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('blueSeven')) {
    coinTwoPairHowlMix();
    pointRate(800); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('diamond')) {
    coinTwoPairHowlMix();
    pointRate(500); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('pumpkin')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(300); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('bar')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(200); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('watermelon')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(100); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('cherry')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(100); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('dollar') 
  && panels[2].img.src.includes('bell')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(100); pointsAdded = true;
  }
}

//^ pointAdd Two Pair Extra Pumpkin ---------------------------- 

function pointAdd_twoPairExtraPumpkin() {
  if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('seven')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(750); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('blueSeven')) {
    pointRate(650); pointsAdded = true;
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('diamond')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200); 
    pointRate(900); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('dollar')) {
    setTimeout(() => { coinTwoPairExtraHowl.play() }, 200);
    pointRate(600); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('bar')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(100); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('watermelon')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('cherry')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
  else if(panels[1].img.src.includes('pumpkin') 
  && panels[2].img.src.includes('bell')) {
    setTimeout(() => coinTwoPairHowl.play(), 200);
    pointRate(50); pointsAdded = true;
  }
}

//^ sound coin two pair mix ---------------------------- 

function coinTwoPairHowlMix() {
  setTimeout(() => coinTwoPairHowl.play(), 200); 
  setTimeout(() => coinTwoPairExtraHowl.play(), 400);
  setTimeout(() => coinTwoPairExtraHowl.play(), 600);
}

//* check betX and Point Rating ----------------------------------------------------

function pointRate(arg) { 
  winRed_add_bigSpinRed_remove(); //*
  if(parseInt(betPoint.textContent) === 500) {
    if(insertPoint.classList.contains('js_blank') && !freeSpin) { //* X POINT 
      // console.log('contain read in checkBetAmount 5x2x');
      total += arg * 100; 
        winPoint.textContent = arg * 100;
          totalPoint.textContent = total;
        insertPoint.classList.remove('js_blank');
      return;
    } else {
        total += arg * 10;
          winPoint.textContent = arg * 10;
        totalPoint.textContent = total;
        // console.log(' read in pointRate 5x2x');
      return;
    }
  } else if(parseInt(betPoint.textContent) === 250) {
    if(insertPoint.classList.contains('js_blank') && !freeSpin) { //* X POINT 
      // console.log('contain read in checkBetAmount 5x');
      total += arg * 50;
        winPoint.textContent = arg * 50;
          totalPoint.textContent = total;
        insertPoint.classList.remove('js_blank');
      return;
    } else {
        total += arg * 5;
          winPoint.textContent = arg * 5;
        totalPoint.textContent = total;
        // console.log(' read in pointRate 5x');
      return;
    }
  }
  if(parseInt(betPoint.textContent) === 100) {
    if(insertPoint.classList.contains('js_blank') && !freeSpin) { //* X POINT 
      // console.log('contain read in checkBetAmount 2x');
      total += arg * 20;
        winPoint.textContent = arg * 20;
          totalPoint.textContent = total;
        insertPoint.classList.remove('js_blank');
      return;
    } else { 
        total += arg * 2;
          winPoint.textContent = arg * 2;
        totalPoint.textContent = total;
        // console.log(' read in pointRate 2x');
      return; 
    }
  } else {
    if(insertPoint.classList.contains('js_blank') && !freeSpin) { //* X POINT 
      // console.log('contain read in checkBetAmount 1x');
      total += arg * 10;
        winPoint.textContent = arg * 10;
          totalPoint.textContent = total;
        insertPoint.classList.remove('js_blank');
      return;
    } else {
      total += arg;
        winPoint.textContent = arg;
      totalPoint.textContent = total;
      // console.log(' read in pointRate 1x');
    }
  }
}

//* WIN point BIG SPIN red --------------

function winRed_add_bigSpinRed_remove() {
    winPoint.classList.add('js_winRed');
  winPoint.classList.remove('js_bigSpinRed');  
}

//* players bet --------------------------

function playerBet() {
  if(bet5x.classList.contains('js_bet5x-activeEffect') 
      && bet2x.classList.contains('js_bet2x-activeEffect')) {
        total -= 500;
      totalPoint.textContent = total;
    return;
  } 
  else if(bet5x.classList.contains('js_bet5x-activeEffect')) {
    total -= 250;
      totalPoint.textContent = total;
    return;
  } 
  if(bet2x.classList.contains('js_bet2x-activeEffect')) {
    total -= 100;
      totalPoint.textContent = total;
  } else {
      total -= 50;
    totalPoint.textContent = total;
  }
}

//* bet counter ---------------------------

function betCounter() {
  // console.log('read bet counter'); //* log
    if(bet5x.classList.contains('js_bet5x-activeEffect') 
        && bet2x.classList.contains('js_bet2x-activeEffect')) {
      betAmount(500);
    return;
  } 
  else if(bet5x.classList.contains
    ('js_bet5x-activeEffect')) {
      betAmount(250);
    return;
  }
  else if(bet2x.classList.contains
    ('js_bet2x-activeEffect')) {
      betAmount(100);
    return;
  }
  else { betAmount(50) }
}

function betAmount(arg) {
  betPoint.textContent ='';
  setTimeout(() => {
    betPoint.textContent = arg;
  }, 50);
}

//* 5x2xBtn active effect turn off auto ---------

  function btn5x2x_ActiveEffect_TurnOffAuto() {
    if(bet2x.classList.contains('js_bet2x-activeEffect') && total < 500) {
      reset5x_activeEffect();
    }
    if(total < 250) { reset5x_activeEffect()} 
    if(total < 100) { reset2x_activeEffect()}                              
  }

  function reset2x_activeEffect() {
      bet2x.classList.remove('js_bet2x-activeEffect'); 
    bet2x.classList.remove('js_bet2x-textColorBright'); 
  }

  function reset5x_activeEffect() {
      bet5x.classList.remove('js_bet5x-activeEffect'); 
    bet5x.classList.remove('js_bet5x-textColorBright'); 
  }

//* adjust point font size  -----------------------------------

  function adjustPointsFontSize() {
    if(innerWidth > 374) { //* iphone
      if(total > 9999999) { totalPoint.style.fontSize = 0.9 + 'em'} 
      else if(total > 999999) { totalPoint.style.fontSize = 1 + 'em'} 
      else { totalPoint.style.fontSize = 1.2 + 'em'}
      //* deptPoint ---
      if(currentDept > 9999999) { deptPoint.style.fontSize = 0.9 + 'em'} 
      else if(currentDept > 999999) { deptPoint.style.fontSize = 1 + 'em'} 
      else { deptPoint.style.fontSize = 1.2 + 'em'}
      //* winPoint ---
      if(winPoint.textContent > 999999) { winPoint.style.fontSize = 1 + 'em'} 
      else { winPoint.style.fontSize = ''}
    } 
    else if(innerWidth < 325) { //* Galaxy S9
      if(total > 9999999) { totalPoint.style.fontSize = 0.6 + 'em'} 
      else if(total > 999999) { totalPoint.style.fontSize = 0.7 + 'em'} 
      else { totalPoint.style.fontSize = 0.9 + 'em'}
      //* deptPoint ---
      if(currentDept > 9999999) { deptPoint.style.fontSize = 0.6 + 'em'} 
      else if(currentDept > 999999) { deptPoint.style.fontSize = 0.7 + 'em'} 
      else { deptPoint.style.fontSize = 0.9 + 'em'}
      //* winPoint ---
      if(winPoint.textContent > 999999) { winPoint.style.fontSize = 1 + 'em'} 
      else { winPoint.style.fontSize = ''}
    }
    else if(innerWidth < 365) { //* Galaxy Note3 S5
      if(total > 9999999) { totalPoint.style.fontSize = 0.7 + 'em'} 
      else if(total > 999999) { totalPoint.style.fontSize = 0.8 + 'em'} 
      else { totalPoint.style.fontSize = 1 + 'em'}
      //* deptPoint ---
      if(currentDept > 9999999) { deptPoint.style.fontSize = 0.7 + 'em'} 
      else if(currentDept > 999999) { deptPoint.style.fontSize = 0.8 + 'em'} 
      else { deptPoint.style.fontSize = 1 + 'em';}
      //* winPoint ---
      if(winPoint.textContent > 999999) { winPoint.style.fontSize = 1 + 'em'} 
      else { winPoint.style.fontSize = ''}
    }
  } 

//* Game Over Func -------------------

  function isGameOver() {
    if(currentDept > 99999999) {
      [checkOutDept, applyCheckOut] = [true, true];
      clearTimeout(tid_gameStartHowl);
      checkOut.classList.add('js_checkOut-lost');
      checkOut.textContent = `LOST ENOUGH`;
      assignTextAndColor(winText, 'LOST', '#0af');
      assignTextAndColor(totalText, 'BIG', '#0af');
      assignTextAndColor(betText, 'TIME', '#0af');
      assignTextAndColor(winPoint, 'YOU', '#f00');
      assignTextAndColor(totalPoint, 'ARE', '#f00');
      assignTextAndColor(betPoint,'DONE', '#f00');
      assignTextAndColor(deptPoint, 'MILLION', '#0af');
      if(localStorage.hasOwnProperty('gameOver')) return;
      outFailureHowl.play(); insertHowl.stop();
      localStorage.setItem('gameOver', true);
    }
  }

  function assignTextAndColor(elem, txt, clr) {
    elem.textContent = txt;
    elem.style.color = clr;
  }
  
  function isClosure() {
    if(total > 99999999) {
      assignTextAndColor(totalPoint, 'millionaire', '#ff0');
      totalPoint.style.marginLeft = -1.5 + 'px';
      setClosureText(); checkOutNoticeHowl.stop();
      checkOut.classList.remove('notification');
      if(currentDept === 0) {
        [applyCheckOut, checkOutDept] = [true, true];
        checkOut.classList.add('js_checkOut-win');
        checkOut.textContent = `WIN + ${total - currentDept}`;
        deactivateBgmHowl(); winHowl.volume(0); 
        if(localStorage.hasOwnProperty('millionaire')) return;
        clearTimeout(tid_BigSpin); clearTimeout(tid_freeSpin); 
        localStorage.setItem('millionaire', true);
        localStorage.setItem('closure', true);
        // winPoint.classList.remove('js_winRed');
        setClosureText();
        if(panels[2].matched(panels[1], panels[0])) {  
          if(panels[2].img.src.includes('pumpkin')) {
            victoryConfettiOne(1500);
          } else if(panels[2].img.src.includes('diamond')) {
            cheerHowl.play(); victoryConfettiOne(1500);
          } else if(panels[2].img.src.includes('seven') 
          || panels[2].img.src.includes('blueSeven')) {
            victoryConfettiTwo(3500);
          } else { cheerHowl.play(); victoryConfettiTwo(2000)} // else matched
        } else { cheerHowl.play(); victoryConfettiOne(1500)} // twoPair
      } else if(currentDept > 0 && (total - currentDept) > 99999999) {
        clearTimeout(tid_BigSpin); clearTimeout(tid_freeSpin); 
        releaseConfetti(300, 100); cheerHowl.play(); // Millionaire
        checkOutDept = true; gameStartSound = false;
        setTimeout(() => {
          checkOutNoticeHowl.play();
          checkOut.classList.add('notification');
          localStorage.setItem('closure', true);
        }, 3000);
      }
    } else { 
      assignTextAndColor(totalPoint, total, '#fff');
      totalPoint.style.marginLeft = '';
    }
  }

  function victoryConfettiOne(duration) {  
    releaseConfetti(600, 100);
    outSuccessHowl.play();
    setTimeout(() => { 
      victoryHowl.play();
    }, duration);
  }

  function victoryConfettiTwo(duration) {  
    outSuccessHowl.play();
    setTimeout(() => {
      releaseConfetti(600, 100);
      victoryHowl.play();
    }, duration);
  }

  function setClosureText() {
    if(localStorage.hasOwnProperty('closure')) {
      assignTextAndColor(winText, 'WON', '#ff0');
      assignTextAndColor(winPoint, 'BIG', '#00ff00e6');
      assignTextAndColor(betPoint, 'END', '#0af');
      betPoint.style.fontSize = 1 + 'em';
      betPoint.style.marginTop = 7 + 'px';
    }
  } 

  //* insertPoint Event -------------------

  let tid_gameStartHowl;
  const insertPoint = document.querySelector('.btn-insert');
  insertPoint.addEventListener('click', () => {
    if(total > 0 || tryAgainSound) return;
    [insertMoney, checkOutLock] = [true, true];
    checkOutDept = false; 
    total += 10000; //*** 
    currentDept += 10000; //***
    insertHowl.play(); 
    saveData(); //*** 
    tid_gameStartHowl = setTimeout(() => gameStartHowl.play(), 600); 
    setTimeout(() => betXSound = false, 2100); 
    setTimeout(() => gameStartSound = false, 3600);
    winPoint.textContent = 0;
    betPoint.textContent = 0;
    totalPoint.textContent = total; 
    deptPoint.textContent = currentDept; 
      isGameOver(); //*>
      spinBtn.textContent = 'SPIN'; // rewrite textContent to SPIN 
        checkOut.textContent = 'CHECK OUT'; 
          checkOut.classList.remove('js_checkOut-lost');
        insertPoint.classList.add('js_insertPoint-activeEffect'); // insert btn flash effect 
      insertPoint.classList.add('js_insertPoint-textColorBright');
    checkOut.classList.add('active'); //*
    setTimeout(() => { 
        insertPoint.classList.remove('js_insertPoint-activeEffect');
      insertPoint.classList.remove('js_insertPoint-textColorBright');
      insertPoint.classList.add('active');
    }, 300);
    if(currentDept > 99999999) {
      checkOut.classList.add('js_checkOut-lost');
      checkOut.textContent = `LOST ENOUGH`;
    }
  });


//* bet2x & bet5x Event -------------------

const bet2x = document.querySelector('.btn-bet2x'); 
  bet2x.addEventListener('click', function () {
    if(bigSpin || betXSound || checkOutDept || !insertMoney && total <= 0) return;
      checkOutLock = true;
    if(total < 500 && bet5x.classList.contains('js_bet5x-activeEffect') || total < 100) return; 
      checkOut.textContent = 'CHECK OUT';  // reset check out text 
      checkOut.classList.remove('js_checkOut-win', 'js_checkOut-lost'); // reset message 
    if(activeLight || total <= 0) return;
      betXHowl.play(); 
      bet2x.classList.toggle('js_bet2x-activeEffect'); // bets2x btn flash effect
    bet2x.classList.toggle('js_bet2x-textColorBright');
  });


const bet5x = document.querySelector('.btn-bet5x');
  bet5x.addEventListener('click', function () {
    if(bigSpin || betXSound || checkOutDept || !insertMoney && total <= 0) return;
      checkOutLock = true;
    // disable click // activeEffect disable click 
    if(total < 500 && bet2x.classList.contains('js_bet2x-activeEffect') || total < 250) return;   
      checkOut.textContent = 'CHECK OUT';  // reset check out text 
      checkOut.classList.remove('js_checkOut-win', 'js_checkOut-lost'); // reset colored 
    if(activeLight || total <= 0) return;
      betXHowl.play();
      bet5x.classList.toggle('js_bet5x-activeEffect');; // bets5x btn flash effect 
    bet5x.classList.toggle('js_bet5x-textColorBright');
  });


//* checkOut Event -------------------

const checkOut = document.querySelector('.check-out');
  checkOut.addEventListener('click', function () {
    if(!checkOutLock || applyCheckOut) return;
    if(gameStartSound || tryAgainSound) return;
    if(currentDept === 0) return; 
    betPoint.textContent = 0;
    reset2x_activeEffect(); reset5x_activeEffect();
    checkOutLock = false;
    if(total > currentDept) {
      outSuccessHowl.play(); 
      checkOut.classList.add('js_checkOut-win');
      checkOut.textContent = `WIN + ${total - currentDept}`;
      totalPoint.textContent = total - currentDept;
      total = total - currentDept;
      currentDept = 0;
      deptPoint.textContent = currentDept;
      winPointSetDefault(); //*
      saveData() //***
      isClosure();
      checkOut.classList.remove('active'); //*
    } else if(currentDept > total) { 
        deactivateBgmHowl(); //*
          outFailureHowl.play(); 
        checkOut.classList.add('js_checkOut-lost');
      checkOut.textContent = `LOST - ${currentDept - total}`;
    }
    else {
      if(!checkOutDept) { // runs only total even currentDept
        outSuccessHowl.play();
        deptPoint.textContent = total - currentDept;
          totalPoint.textContent = total - currentDept;
            [total, currentDept] = [0,0];
              [checkOutDept, insertMoney] = [true, false];
            saveData() //***
          checkOut.textContent = `LOST - ${currentDept - total}`;
          setTimeout(() => { checkOut.textContent = 'CHECK OUT' }, 3000);
        if(total === 0) { 
          insertPoint.classList.remove('active');
          spinBtn.textContent = 'INSERT MONEY TO PLAY'; 
          deactivateBgmHowl(); //*
          winPointSetDefault(); //*
          setTimeout(() => { checkOut.classList.remove('active')}, 3000);
        }
      } 
    }
  }); 

  function winPointSetDefault() {
    winPoint.textContent = 0; // reset winPoint
    winPoint.classList.remove('js_winRed'); // reset winRed
  }

//* SpinBtn Event -------------------

const spinBtn = document.getElementById('spin');
  if(total > 0) { spinBtn.textContent = 'SPIN'}

  spinBtn.addEventListener('click', () => { 
    if(gameStartSound || confetti || embedFrame) return;
    if(bigSpin || checkOutDept || total === 0) return;
    bigSpinFlash = false;
      winPointSetDefault(); //*
        checkOut.textContent = 'CHECK OUT';  // reset // check out text 
      checkOut.classList.remove('js_checkOut-win', 'js_checkOut-lost');
    if(total < 50) return; // when point 0 disable spinBtn click event 
      [spinStopBtnEvent, activeLight] = [true, true];
    [applyCheckOut, checkOutLock] = [true, true];
    spinBtn.classList.add('js_spinBtnAnimation'); // trf animation add 
    if(spinBtn.classList.contains('js_inActive')) return; // avoid dbl click
      if(!bgmHowlId) { bgmHowlId = bgmHowl.play() } 
      outFailureHowl.stop(); spinHowl.play(); //*
    spinBtn.classList.add('js_inActive');
      insertPoint.classList.remove('js_blank') // BIG SPIN 
        reelHandler.classList.add('active'); //*
      reelHandler.addEventListener('click', stopAutomate); //*
        playerBet(); 
        betCounter(); 
    panels.forEach(panel => {
      panel.spin();
      btn5x2x_ActiveEffect_TurnOffAuto(); 
    });
  });


//* resize Event randomMp4 -------------------

const mp4s = ['img/Seoul.mp4', 'img/City.mp4'];
  const video = document.querySelector('.video');
  video.src = 'img/City.mp4';
  window.addEventListener('resize', () => {
    video.src = mp4s[Math.floor(Math.random() * mp4s.length)];
  });

//* Confetti & Giphy Func -------------------

  const squareOneClr = ['#f00','#f50','#0f0','#0ff','#f0f'];
  const giphy = document.querySelector('.giphy');
  let [confetti, embedFrame] = [false, false];
  
  function releaseConfetti(quantity, num) {
    confetti = true;
    const squareOne = document.createElement('span');
    const squareTwo = document.createElement('span');
    const squareRange = document.createElement('div');
    squareOne.classList.add('squareOne');
    squareTwo.classList.add('squareTwo');
    squareOne.style.setProperty('--bgc',
      squareOneClr[Math.floor(Math.random() * squareOneClr.length)]);
    squareRange.classList.add('squareRange');
    document.documentElement.style.setProperty('--top', innerHeight + 'px');
    squareRange.appendChild(squareOne);
    squareRange.appendChild(squareTwo);
    document.body.appendChild(squareRange);
    for (let i = 0; i < quantity; i++) {
      const rectangle = document.createElement('span');
      rectangle.classList.add('rectangle');
      rectangle.style.width = 7 + Math.random() * 10 + 'px';
      rectangle.style.left = Math.random() * innerWidth + 'px';
      rectangle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      rectangle.style.setProperty('--skew', 15 + Math.random() * 20 +'deg');
      rectangle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
      rectangle.style.setProperty('--x', (Math.random() - 0.5) * 360 + 'deg');
      rectangle.style.setProperty('--y', (Math.random() - 0.5) * 180 + 'deg');
      rectangle.style.setProperty('--scale', 1 + Math.random());
      rectangle.style.animationDelay = (i + Math.random() * num) * 0.01 + 's';
      rectangle.style.animationDuration = 1.5 + Math.random() * 1.5 + 's';
      document.body.appendChild(rectangle);
    }
    squareRange.addEventListener('animationend', () => {
      squareRange.classList.remove('squareRange');
      squareRange.remove();
    });
    const rectangles = document.querySelectorAll('.rectangle'); //*>
    rectangles.forEach(rectangle => {
      rectangle.addEventListener('animationend', () => {
        rectangle.classList.remove('rectangle');
        rectangle.remove();
        const rectangles = document.querySelectorAll('.rectangle');
        if(rectangles.length < 10) { confetti = false }
      });
    });
  } console.clear(); //* log clear

//* Cheer Version (localStorage) ---------------------------------

//* failure Id ---
const failureId = [
  'lkNWfGN9QhZHgYOkK7','hbAC0G8SkRDn4vfGLa','PC5Cfhr6sllsNbHut5','1RiQpbXvzsw6pRjhBH',
  'fy4g4f6ULlSSlwLzvt','jgrxrmr3xTD4TIP4pt','ZlBq2Kbr3T28jHGRcu','XsvHYypHC9wnSwCXRp',
  'V947LKIR6rLXdSHbTv','DTmMtwivczjQp4k9y4','SWtMdJsIZ8el2x7VXO','z9Oq59fWvyZxMPwqqC',
  'Ev8n5Ox16vaZMN2bXe','fXPaZBu5YrdY5AJ6Fj','czMKlV6Kizhyl5yTR1','MBCT80rDEXWxBpISlQ',
  'yR3OleHSUxiGzRlHHb','unvp7wR3D9U5jt6vDz','qqrWvoQcOGs69cUbWH','uNls3XcVcU1NbDXaxm',
  'EnkIFPiFRrmdSguEXG','5msTNFAg8ZnT235ZqR','FtRl4kIph9zJn3ILja','U60efVbqdL09hI1HI6',
  'oZvIA0CvREeSBaBBmy','35HUBD2bFW0HgTu1Ax', 'UHAQncqfXmLXaK2DVo', 'RWy5XUTI8SJSh69k4D'
]; //*>
//* Remove failure Id ---
if(localStorage.hasOwnProperty('fetchFailureId')) {
  failureId.forEach((id, index) => localStorage.removeItem(index+1, id));
  localStorage.removeItem('fetchFailureId')
}

const fetchId = {
  threeSeven: '5nxwXml2GZZ3MVfPNR',
  redSevenCenter: '3gMaHF12K2JOJSp54h',
  twoRedSeven: '26pTJYXEEjIV96lxYq',
  threeBlueSeven: 'lEzhYyrW078EHfa16O',
  blueSevenCenter: 'Hqwgy0GAu3FhDVAPlG',
  twoBlueSeven: '9xClMb06GVuNr3L2cw',
  dollar: 'TH0OJ8Mu46DXbYKYbZ',
  bar: 'wYFgWVU8R5Tdo5NGG4',
  watermelon: 'DnsnWChYJaTpYv3S3Z',
  cherry: 'cA9Z3Rh090mPceHcce',
  bell: 'ihklB5wITnDE7lXRmb',
  failure: 'TLVAAgmN8GC5EeZbcZ',
}

async function initFetch() {
  for (const index of Object.entries(fetchId)) {
    const key = `${process_env}${uuid}`;
    const baseURL = `https://api.giphy.com/v1/content/${index[1]}?`; //* BY ID
    const GIPHY_API = `${baseURL}api_key=${key}`;
    const response = await fetch(GIPHY_API);
    const data = await response.json(); 
    fetchImage.src = data.data.images.downsized_medium.url; 
    localStorage.setItem(index[0], data.data.images.downsized_medium.url);
  }
} 

if(!localStorage.hasOwnProperty('threeSeven')) {
  initFetch(); console.log('fetched'); //* log
}

const fetchImage = document.querySelector('.frame');
  function getFetchData(title, height, left, bottom, duration) {
    embedFrame = true;
    const url = localStorage.getItem(title);
    fetchImage.src = url; 
    fetchImage.style.setProperty('--left', left + '%');
    fetchImage.style.setProperty('--bottom', bottom + 'px');
    giphy.style.setProperty('--height', height + '%');
    fetchImage.classList.add('active');
    setTimeout(() => fetchImage.classList.add('alpha'), 0);
    setTimeout(() => {
      embedFrame = false;
      fetchImage.classList.remove('alpha');
      setTimeout(() => fetchImage.classList.remove('active'), 2000);
    }, duration);
  }



//* loader Event -------------------------------

const panelImages = document.querySelectorAll('.panelImage');
  panelImages.forEach(img => {
    img.addEventListener('load', loadImages);
  });

function loadImages() {
  loadCount++; // console.log(loadCount); //* log
}

const loader = document.querySelector('.loader');
const iid_load = setInterval(() => {
  if(total > 0) { insertPoint.classList.add('active')} //*
  if(currentDept > 0) { checkOut.classList.add('active')} //*
  if(localStorage.hasOwnProperty('gameOver')) { isGameOver() }
  if(localStorage.hasOwnProperty('closure')) { isClosure() }
  if(loadCount === 4) {
    loader.querySelectorAll('img').forEach(img => {
      img.classList.remove('active');
      img.style.opacity = 0;
    });
    panelImages.forEach(img => {
      img.removeEventListener('load', loadImages);
    });
    loader.style.opacity = 0;
    setTimeout(() => loader.remove(), 1000);
    clearInterval(iid_load);
  }
}, 10);

// ---------------------------------------------------------------------------------------------
//* GET localStorage KEY ------------
// function forEachKey() {
//   for (let i = 0; i < localStorage.length; i++) {
//     console.log(parseFloat(localStorage.key(i)));
//     console.log(localStorage.key(i));
//   }
// } forEachKey();
// ---------------------------------------------------------------------------------------------



























































