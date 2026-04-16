"use server";

export async function saveDiaryAction(diaryText: string) {
  const scriptUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;

  if (!scriptUrl) {
    throw new Error("GOOGLE_SHEET_WEBAPP_URL 환경 변수가 설정되지 않았습니다.");
  }

  const payload = {
    daytime: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
    memo: diaryText
  };

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain", 
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const resultText = await response.text();
    
    // We expect the script to return "success" or JSON
    return { success: true, detail: resultText };
  } catch (error) {
    console.error("Save to sheet error:", error);
    throw new Error("일기 저장 중 문제가 발생했습니다.");
  }
}
