import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found via process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateZenReflection = async (tasks: Task[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "请配置您的 API Key 以启用禅意回顾功能。";

  // Filter for today's context
  const completedTasks = tasks.filter(t => t.isCompleted);
  const openTasks = tasks.filter(t => !t.isCompleted);
  
  // Construct a prompt that feeds the "Basket" content to the AI
  const promptParts = [
    `你是一个名为“Basket”的极简主义效率助手。`,
    `你的目标是减少用户的焦虑，并对他们的一天进行温柔的“禅意回顾”。请用简体中文回复。`,
    `以下是用户今天“筐”（时间块）里的内容：`,
    `\n已完成的任务:`,
    ...completedTasks.map(t => `- [x] ${t.title} (包含 ${t.memos.length} 条随手记)`),
    `\n未完成的任务 (稍后继续，没有压力):`,
    ...openTasks.map(t => `- [ ] ${t.title} (包含 ${t.memos.length} 条随手记)`),
    `\n随手记 (扔进筐里的随机想法/灵感):`,
    ...tasks.flatMap(t => t.memos.map(m => `"${m.content}" (在“${t.title}”筐里)`)).join('\n'),
    `\n\n请提供一段简短、治愈的总结。`,
    `1. 肯定已经完成的工作。`,
    `2. 简要提及随手记中发现的有趣想法。`,
    `3. 告诉用户剩下的事情明天再做也没关系。`,
    `保持语气温暖、简洁、轻松。不要过度使用 Markdown 加粗。`
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptParts.join('\n'),
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for UI feedback
      }
    });

    return response.text || "暂时无法生成回顾，但你今天已经做得很棒了。";
  } catch (error) {
    console.error("Gemini Reflection Error:", error);
    return "禅意向导正在冥想中（服务错误）。深呼吸，休息一下吧。";
  }
};