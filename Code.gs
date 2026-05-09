function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🛠️ 나만의 도구')
    .addItem('바이브 타이머 열기', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Page')
    .setTitle('Vibe Timer')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

// 시트의 A1, B1, C1 셀에서 숫자를 읽어오는 함수
function getTimerSettings() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const values = sheet.getRange("A1:C1").getValues()[0]; 
    return {
      btn1: values[0] || 1, 
      btn2: values[1] || 2, 
      btn3: values[2] || 3  
    };
  } catch (e) {
    return { btn1: 1, btn2: 2, btn3: 3 }; // 에러 시 기본값
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Vibe Timer Web App')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 시트 데이터를 읽어오는 함수 (웹 앱에서 호출됨)
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Vibe Photo Timer')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getTimerSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    
    // A1:C2 범위를 가져옵니다 (1행은 분, 2행은 이미지 URL)
    const data = sheet.getRange("A1:C2").getValues();
    
    return {
      btn1: { mins: data[0][0] || 1, img: data[1][0] || "" },
      btn2: { mins: data[0][1] || 2, img: data[1][1] || "" },
      btn3: { mins: data[0][2] || 3, img: data[1][2] || "" }
    };
  } catch (e) {
    return { 
      btn1: { mins: 1, img: "" }, 
      btn2: { mins: 2, img: "" }, 
      btn3: { mins: 3, img: "" } 
    };
  }
}
