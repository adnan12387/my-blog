import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function reviewPost({ title, excerpt, content }) {
    const prompt = `
تو یه ویراستار حرفه‌ای وبلاگ هستی. یه پست جدید برات اومده که باید بررسی کنی.

عنوان: ${title}

خلاصه: ${excerpt}

محتوا:
${content}

لطفاً این پست رو از این نظرها بررسی کن:
۱. آیا محتوا مناسبه و ارزش انتشار داره؟
۲. آیا کلمات توهین‌آمیز، تبعیض‌آمیز یا نامناسب داره؟
۳. آیا طول پست کافیه (حداقل ۲۰۰ کلمه)؟
۴. آیا ساختارش درسته (مقدمه، بدنه، نتیجه)؟
۵. آیا املا و نگارشش درسته؟

امتیاز ۰ تا ۱۰۰ بده که آیا این پست ارزش انتشار داره یا نه.

پاسخ رو **فقط** به این فرمت JSON بده (هیچ متن دیگه‌ای اضافه نکن):
{
  "score": عدد بین ۰ تا ۱۰۰,
  "approved": true یا false,
  "reason": "توضیح کوتاه فارسی (حداکثر ۲۰۰ کاراکتر)",
  "suggestions": ["پیشنهاد ۱", "پیشنهاد ۲"]
}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;

        // استخراج JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI response is not valid JSON");
        }

        const result = JSON.parse(jsonMatch[0]);

        return {
            score: Math.min(100, Math.max(0, result.score || 0)),
            approved: result.approved || false,
            reason: result.reason || "بدون توضیح",
            suggestions: result.suggestions || [],
        };
    } catch (error) {
        console.error("خطا در بررسی AI:", error);
        // اگه AI خطا داد، به عنوان تأیید دستی بفرست
        return {
            score: 50,
            approved: false,
            reason: "خطا در بررسی خودکار — نیاز به بررسی دستی",
            suggestions: [],
        };
    }
}
