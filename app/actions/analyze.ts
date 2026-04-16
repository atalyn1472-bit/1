"use server";

import { GoogleGenAI } from '@google/genai';

// 자동으로 process.env.GEMINI_API_KEY를 참조합니다.
const ai = new GoogleGenAI({});

export async function analyzeDiaryAction(text: string, lang: 'ko' | 'en' = 'ko') {
  const languageDirective = lang === 'en' 
    ? "5. All output texts (title, insights, tags) MUST be exactly in English." 
    : "5. All output texts (title, insights, tags) MUST be exactly in Korean.";

  const prompt = `
    다음 사용자의 일기 내용을 심리학적 관점에서 분석해줘.
    
    규칙:
    1. 사용자의 감정을 다음 5가지 중 무조건 하나로만 분류할 것: "melancholy", "neutral", "peaceful", "joyful", "inspired"
    2. 일기에 담긴 문맥을 파악하여 사용자에게 도움이 되는 부드럽고 따뜻한 조언이나 통찰을 2개 문단으로 작성할 것.
    3. 일기에서 발견된 중요한 테마나 긍정적인 요소에 대한 짧은 태그 3개를 작성할 것.
    4. 일기 내용을 바탕으로 내용에 걸맞은 감성적인 한 줄 제목을 스스로 지어줄 것.
    ${languageDirective}

    일기 내용: """${text}"""
    
    응답은 반드시 아래 JSON 형식으로만 반환해:
    {
      "title": "생성된 감성적인 제목",
      "sentiment": "peaceful", // 결정된 감정
      "insights": ["문단 1", "문단 2"],
      "tags": ["태그1", "태그2", "태그3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // (현재 가장 빠르고 안정적인 모델로 수정)
      contents: prompt,
      config: {
        responseMimeType: "application/json", // JSON으로만 깔끔하게 응답받기 위한 설정
      }
    });

    if (!response.text) throw new Error("응답이 비어있습니다.");
    
    // JSON 문자열을 Javascript 객체로 변환하여 브라우저로 반환
    return JSON.parse(response.text); 
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("분석 중 오류가 발생했습니다.");
  }
}
