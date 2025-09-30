import PenpalCard from "./PenpalCard";

// 임시 데이터
const MOCK_HISTORY = [
  {
    id: 1,
    text: "오옷! 이렇게 관심사가 같은 분께 연락이 오다니!!! 저도 도란산 등산객입니다. 어제도 갔었고 이번주 토요일 오전에도 갈 예정입니다 ^^ 워낙 나무를 좋아해서 저희 집엔 묘목도 많습니다 ^^ 그리고 저는 요즘 부동산 공부 중입니다. 철수님도 좋은 하루 보내세요!!",
    from: "김용식",
    isSent: false,
    timestamp: "어제 오후 2:45",
  },
  {
    id: 2,
    text: "답장 감사합니다, 용식님. 부동산 공부라니 정말 대단하시네요. 저는 주로 주말 오전에 도란산에 오르는데, 혹시 다음에 마주치면 반갑게 인사 나눠요. 원예에도 관심이 많으시다니, 나중에 키우시는 묘목 사진도 구경하고 싶습니다. 좋은 하루 보내세요.",
    from: "이철수",
    isSent: true,
    timestamp: "오늘 오전 9:12",
  },
  // --- 새로 추가된 편지 내용 ---
  {
    id: 3,
    text: "철수님, 답장 잘 받았습니다. 주말 오전에 주로 오르시는군요! 저도 그 시간대에 자주 가니, 아마 곧 마주칠 수 있겠네요. 만나면 꼭 인사 나누겠습니다. 묘목에 관심을 가져주셔서 감사합니다. 날이 좀 더 풀리면 가장 예쁘게 자란 녀석으로 하나 사진 찍어 보내드릴게요. 부동산 공부는 어렵지만 재미있네요. 철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!철수님도 좋은 하루 보내세요!",
    from: "김용식",
    isSent: false,
    timestamp: "오늘 오후 4:10",
  },
];

export default function PenpalHistoryPage() {
  return (
    <div className="flex h-dvh flex-col bg-[#FDFAE3]">
      <header className="flex items-center justify-between bg-[#FDFAE3] p-4">
        <button className="text-gray-600">뒤로가기</button>
        <button className="text-sm font-semibold text-gray-800">
          펜팔 보내기
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <section className="sticky top-0 z-10 bg-[#FDFAE3] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-4xl">
              🙂
            </div>
            <div>
              <p className="font-bold">
                김용식{" "}
                <span className="text-sm font-normal text-gray-500">
                  @kimdragon52
                </span>
              </p>
              <p className="text-sm text-gray-600">#원예 #경제 #동산</p>
            </div>
          </div>
        </section>

        <main className="flex flex-col gap-4 p-4 pt-0">
          {MOCK_HISTORY.map((penpal) => (
            <PenpalCard key={penpal.id} {...penpal} />
          ))}
        </main>
      </div>
    </div>
  );
}
