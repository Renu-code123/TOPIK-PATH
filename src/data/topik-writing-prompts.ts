export interface WritingTask {
  id: string;
  taskNumber: 51 | 52 | 53 | 54;
  title: string;
  titleKo: string;
  targetLength: string;
  maxPoints: number;
  promptText: string;
  contextBox?: string;
  sampleAnswer: string;
  keyPhrases: string[];
  tips: string[];
}

export const WRITING_TASKS: WritingTask[] = [
  {
    id: "task-51",
    taskNumber: 51,
    title: "Task 51: Practical Email / Notice Completion",
    titleKo: "제51번: 실용문 빈칸 완성",
    targetLength: "1-2 short sentences (per blank)",
    maxPoints: 10,
    promptText: "다음 글을 읽고 ( ㉠ )과 ( ㉡ )에 들어갈 말을 각각 한 문장으로 쓰십시오.",
    contextBox: `[제목: 기숙사 퇴사 안내]
기숙사생 여러분, 이번 학기 퇴사일은 6월 25일입니다. 
퇴사 전 반드시 방 청소를 마쳐 주시고, 열쇠를 사감실에 (   ㉠   ). 
만약 정해진 시간 이후에 퇴사하게 될 경우, 미리 사감실로 (   ㉡   ). 협조 부탁드립니다.`,
    sampleAnswer: "㉠ 반납해 주시기 바랍니다 / 제출해 주십시오\n㉡ 연락해 주시기 바랍니다 / 연락을 주셔야 합니다",
    keyPhrases: ["-기 바랍니다", "-아/어 주십시오", "-으시기 바랍니다", "연락하다", "반납하다"],
    tips: [
      "Must match the formal honorific register (하십시오체 or -기 바랍니다).",
      "Pay strict attention to verbs: 열쇠를 '반납하다/돌려주다', 미리 '연락하다/알리다'.",
    ],
  },
  {
    id: "task-52",
    taskNumber: 52,
    title: "Task 52: Explanatory / Scientific Text Completion",
    titleKo: "제52번: 설명문 빈칸 완성",
    targetLength: "1-2 sentences (plain form ~ㄴ/는다)",
    maxPoints: 10,
    promptText: "다음 글을 읽고 ( ㉠ )과 ( ㉡ )에 들어갈 말을 각각 한 문장으로 쓰십시오.",
    contextBox: `식물은 빛을 받아 광합성을 함으로써 스스로 양분을 만든다. 
따라서 햇빛을 충분히 받지 못하면 식물은 제대로 (   ㉠   ). 
반대로 햇빛이 지나치게 강할 때에는 잎이 마르지 않도록 수분을 공급해 주는 것이 (   ㉡   ).`,
    sampleAnswer: "㉠ 자라지 못한다 / 성장할 수 없다\n㉡ 필요하다 / 중요하다",
    keyPhrases: ["-지 못한다", "-을 수 없다", "-는 것이 필요하다", "-는 것이 중요하다"],
    tips: [
      "Must use the plain written register (해라체: -ㄴ/는다, -다).",
      "Do NOT use honorific endings like -ㅂ니다 or -요 in Task 52.",
    ],
  },
  {
    id: "task-53",
    taskNumber: 53,
    title: "Task 53: Graph & Data Analysis Essay",
    titleKo: "제53번: 자료 및 통계 분석 작문",
    targetLength: "200 - 300 characters",
    maxPoints: 30,
    promptText: "다음을 참고하여 '1인 가구 증가 현황과 원인'에 대해 200~300자로 글을 쓰십시오.",
    contextBox: `[통계 자료]
1. 조사 기관: 통계청
2. 1인 가구 비율: 2010년 23.9% → 2020년 31.7% (약 8%p 증가)
3. 주된 원인: 미혼 인구의 증가, 고령화로 인한 독거노인 증가
4. 전망 및 과제: 1인 가구 맞춤형 주거 및 복지 정책 마련 필요`,
    sampleAnswer: "통계청의 조사에 따르면 1인 가구의 비율은 2010년 23.9%에서 2020년 31.7%로 크게 증가하였다. 이러한 증가의 주된 원인은 미혼 인구의 증가와 고령화에 따른 독거노인의 증가 때문이다. 따라서 앞으로 1인 가구를 위한 맞춤형 주거 및 복지 정책을 마련하는 것이 필요하다.",
    keyPhrases: [
      "-에 따르면",
      "-에서 -로 증가하였다 / 감소하였다",
      "주된 원인은 -기 때문이다",
      "-을/를 마련하는 것이 필요하다",
    ],
    tips: [
      "Do NOT insert personal feelings (like 'I think'). Keep it strictly factual.",
      "Follow standard graph progression: Topic/Source -> Number trends -> Reasons -> Outlook.",
    ],
  },
  {
    id: "task-54",
    taskNumber: 54,
    title: "Task 54: Argumentative / Discursive Long Essay",
    titleKo: "제54번: 논술형 종합 작문",
    targetLength: "600 - 700 characters",
    maxPoints: 50,
    promptText: "현대 사회에서 '실패에 대한 태도'의 중요성에 대해 600~700자로 자신의 생각을 쓰십시오.",
    contextBox: `[다음 세 가지 질문을 포함하여 작성할 것]
1. 사람들은 왜 실패를 두려워하는가?
2. 실패 경험이 개인에게 주는 긍정적인 영향은 무엇인가?
3. 실패를 극복하고 성장하기 위해 어떤 태도를 가져야 하는가?`,
    sampleAnswer: "현대 사회에서 많은 사람들은 실패를 두려워한다. 경쟁이 치열한 사회 구조 속에서 실패는 뒤처짐이나 무능함으로 여겨지기 때문이다. 그러나 실패는 단순한 좌절이 아니라 성공으로 나아가기 위한 귀중한 배움의 기회이다. 실패를 통해 자신의 부족한 점을 깨닫고 새로운 해결책을 모색할 수 있기 때문이다. 따라서 실패를 피하기보다 성장의 발판으로 삼는 유연하고 긍정적인 태도를 가져야 한다.",
    keyPhrases: ["-ㄴ/는다", "-기 마련이다", "-에 불과하다", "성장의 발판으로 삼다", "태도를 가져야 한다"],
    tips: [
      "Structure into 3 clear paragraphs: Introduction + Arguments + Conclusion.",
      "Address all 3 prompt questions systematically.",
    ],
  },
];
