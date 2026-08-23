export interface MockQuestion {
  id: string;
  section: "LISTENING" | "READING";
  questionNumber: number;
  audioScript?: string;
  passage?: string;
  prompt: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  points: number;
  explanation: string;
}

export interface MockExam {
  id: string;
  title: string;
  examType: "TOPIK_I" | "TOPIK_II";
  timeLimitMinutes: number;
  totalPoints: number;
  passLevel1Min?: number;
  passLevel2Min?: number;
  passLevel3Min?: number;
  passLevel4Min?: number;
  questions: MockQuestion[];
}

export const SAMPLE_MOCK_TESTS: MockExam[] = [
  {
    id: "topik-1-mock-01",
    title: "TOPIK I Official Format Mini Simulation (제83회 형식)",
    examType: "TOPIK_I",
    timeLimitMinutes: 15,
    totalPoints: 100,
    passLevel1Min: 40,
    passLevel2Min: 70,
    questions: [
      {
        id: "t1-q1",
        section: "LISTENING",
        questionNumber: 1,
        audioScript: "여: 어디에 가요?\n남: 도서관에 가요.",
        prompt: "[듣기] 남자는 어디에 갑니까? (Where is the man going?)",
        options: ["식당 (Restaurant)", "도서관 (Library)", "은행 (Bank)", "병원 (Hospital)"],
        correctAnswer: 1,
        points: 10,
        explanation: "남자가 '도서관에 가요'라고 명확하게 대답했으므로 정답은 도서관입니다.",
      },
      {
        id: "t1-q2",
        section: "LISTENING",
        questionNumber: 2,
        audioScript: "여: 이 사과 얼마예요?\n남: 한 개에 천 원이에요.",
        prompt: "[듣기] 두 사람은 무엇에 대해 이야기하고 있습니까?",
        options: ["가격 (Price)", "장소 (Place)", "시간 (Time)", "날씨 (Weather)"],
        correctAnswer: 0,
        points: 10,
        explanation: "'얼마예요?'와 '천 원이에요'는 가격을 묻고 답하는 표현입니다.",
      },
      {
        id: "t1-q3",
        section: "READING",
        questionNumber: 3,
        passage: "오늘은 일요일입니다. 학교에 안 갑니다. 집에서 영화를 봅니다.",
        prompt: "[읽기] 무엇에 대한 글입니까?",
        options: ["주말 (Weekend)", "계절 (Season)", "취미 (Hobby)", "나이 (Age)"],
        correctAnswer: 0,
        points: 10,
        explanation: "일요일에 학교에 가지 않고 집에서 보내는 주말 일정에 대한 글입니다.",
      },
      {
        id: "t1-q4",
        section: "READING",
        questionNumber: 4,
        passage: "저는 커피를 좋아합니다. 아침마다 따뜻한 커피를 ( ____ ).",
        prompt: "[읽기] 빈칸에 들어갈 알맞은 말을 고르십시오.",
        options: ["마십니다", "입습니다", "읽습니다", "배웁니다"],
        correctAnswer: 0,
        points: 10,
        explanation: "커피와 어울리는 동작 동사는 '마십니다'입니다.",
      },
      {
        id: "t1-q5",
        section: "READING",
        questionNumber: 5,
        passage: "내일 친구 생일입니다. 그래서 백화점에서 예쁜 모자를 샀습니다.",
        prompt: "[읽기] 글의 내용과 같은 것을 고르십시오.",
        options: [
          "오늘은 친구 생일입니다.",
          "백화점에서 모자를 샀습니다.",
          "친구에게 옷을 선물했습니다.",
          "모자를 사고 싶지 않습니다."
        ],
        correctAnswer: 1,
        points: 10,
        explanation: "'백화점에서 예쁜 모자를 샀습니다'가 본문과 정확히 일치합니다.",
      },
    ],
  },
  {
    id: "topik-2-mock-01",
    title: "TOPIK II Intermediate Mini Simulation (Level 3-4 Focus)",
    examType: "TOPIK_II",
    timeLimitMinutes: 20,
    totalPoints: 100,
    passLevel3Min: 45,
    passLevel4Min: 70,
    questions: [
      {
        id: "t2-q1",
        section: "READING",
        questionNumber: 1,
        passage: "스마트폰 사용 시간의 증가는 현대인의 수면의 질을 저하시키는 주요 ( ____ )으로 지목되고 있다.",
        prompt: "[읽기 - 빈칸 채우기] 괄호 안에 들어갈 가장 알맞은 어휘를 고르십시오.",
        options: ["원인 (Cause)", "대책 (Countermeasure)", "목표 (Goal)", "해결 (Solution)"],
        correctAnswer: 0,
        points: 20,
        explanation: "수면의 질 저하를 일으키는 요인이므로 '원인(Cause)'이 가장 적절합니다.",
      },
      {
        id: "t2-q2",
        section: "READING",
        questionNumber: 2,
        passage: "최근 친환경 소비에 대한 대중의 관심이 높아지면서 일회용품 사용을 줄이고자 하는 운동이 ( ____ ).",
        prompt: "[읽기 - 문맥 어휘] 괄호에 알맞은 표현을 고르십시오.",
        options: ["확산되고 있다 (Is spreading)", "축소되고 있다 (Is shrinking)", "단절되고 있다 (Is cut off)", "침체되고 있다 (Is stagnant)"],
        correctAnswer: 0,
        points: 20,
        explanation: "관심이 높아지면서 실천 운동이 널리 퍼지고 있으므로 '확산되고 있다'가 정답입니다.",
      },
      {
        id: "t2-q3",
        section: "READING",
        questionNumber: 3,
        passage: "전문가들에 따르면 스트레스를 받을 때 적절한 유산소 운동을 하는 것은 심신 안정에 긍정적인 영향을 미친다고 한다.",
        prompt: "[읽기 - 핵심 주제] 위 글의 중심 생각으로 알맞은 것을 고르십시오.",
        options: [
          "운동을 과도하게 하면 스트레스가 가중된다.",
          "유산소 운동은 스트레스 해소 및 심신 안정에 효과적이다.",
          "전문가들은 운동보다 휴식을 권장한다.",
          "스트레스는 약물 치료로만 완화할 수 있다."
        ],
        correctAnswer: 1,
        points: 20,
        explanation: "유산소 운동이 스트레스 완화와 심신 안정에 도움을 준다는 것이 중심 내용입니다.",
      },
    ],
  },
];
