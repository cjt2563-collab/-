// ⚠️ 이전처럼 토큰을 직접 적지 않고, 스크립트 속성에서 불러옵니다.
const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('timer_token');
const REPO_OWNER = "cjt2563-collab";
const REPO_NAME = "timer-app";
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Vibe Custom Timer')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


// 시트를 열 때 자동으로 실행되는 함수
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  // 시트 상단 메뉴에 '타이머 관리' 메뉴를 만듭니다.
  ui.createMenu('🚀 타이머 관리')
      .addItem('타이머 웹앱 열기', 'openWebAppUrl')
      .addToUi();
}

// 메뉴 클릭 시 웹앱 주소를 안내해주는 보조 함수
function openWebAppUrl() {
  const url = ScriptApp.getService().getUrl();
  const html = `<div style="padding: 20px; font-family: sans-serif;">
                  <p>아래 링크를 클릭하여 타이머를 실행하세요:</p>
                  <a href="${url}" target="_blank" style="color: #4f46e5; font-weight: bold;">타이머 웹앱 실행하기</a>
                </div>`;
  const output = HtmlService.createHtmlOutput(html).setWidth(300).setHeight(150);
  SpreadsheetApp.getUi().showModalDialog(output, '웹앱 주소 확인');
}

// 1. 초기 데이터 가져오기
function getTimerSettings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = sheet.getRange("A1:C2").getValues();
  return {
    btn1: { mins: data[0][0], img: data[1][0] },
    btn2: { mins: data[0][1], img: data[1][1] },
    btn3: { mins: data[0][2], img: data[1][2] }
  };
}

// 2. 파일 업로드 및 설정 저장
function updateButtonSettings(btnIndex, mins, fileData) {
  try {
    let imageUrl = "";
    
    // 이미지를 업로드할 경우 (파일 데이터가 있을 때)
    if (fileData) {
      const fileName = `btn_${btnIndex}_${Date.now()}.jpg`;
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;
      
      const payload = {
        message: `Upload image for button ${btnIndex}`,
        content: fileData.base64, // 이미 Base64로 전달됨
        branch: "main"
      };

      const options = {
        method: "put",
        headers: { "Authorization": "token " + GITHUB_TOKEN },
        contentType: "application/json",
        payload: JSON.stringify(payload)
      };

      UrlFetchApp.fetch(url, options);
      imageUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${fileName}?raw=true`;
    }

    // 구글 시트 업데이트
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const col = btnIndex; // 1, 2, 3 열
    sheet.getRange(1, col).setValue(mins); // 1행에 분 저장
    if (imageUrl) sheet.getRange(2, col).setValue(imageUrl); // 2행에 이미지 URL 저장

    return { success: true, newUrl: imageUrl };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
