// 飲料 → 角色參數規則（對應已定案的規則表）

const BODY = ["修長少年", "標準偏瘦", "標準圓潤", "圓滾滾"];
const HEIGHT = ["嬌小", "標準", "高大"];
const EYES = ["睡眼惺忪", "眼神清醒", "睜大眼睛"];
const HAIR = ["柔順服貼", "整齊俐落", "頭髮炸開"];
const ACCESSORY = ["無", "1～2 個小配件", "3 個以上"];
const EXPRESSION = {
  none: { face: "平靜", personality: "冷靜、自律" },
  natural: { face: "微笑", personality: "親切、陽光" },
  sugar: { face: "開心笑臉", personality: "熱情、愛撒嬌" },
  artificial: { face: "眨眼或吐舌", personality: "俏皮、有點狡黠" },
};
const OUTFIT = {
  green: "青色漢服", black: "英式紳士西裝", oolong: "茶藝師長衫",
  herbal: "休閒居家服", milk_tea: "甜點師圍裙", coffee: "咖啡師制服",
  soda: "運動風或街頭風", juice: "夏日清爽服",
};

// 各函式回傳級距（從 1 起算）
export const sugarLevel = (g) => (g <= 0.5 ? 1 : g < 5 ? 2 : g < 9 ? 3 : 4); // 0.5g 以下視為無糖
export const heightLevel = (ml) => (ml <= 300 ? 1 : ml <= 600 ? 2 : 3);
export const caffeineLevel = (mg) => (mg == null ? 2 : mg === 0 ? 1 : mg < 30 ? 2 : 3); // 未標示歸 2
export const additiveLevel = (n) => (n <= 2 ? 1 : n <= 6 ? 2 : 3);

export function computeCharacter(d) {
  const caf = d.caffeine_override ?? caffeineLevel(d.caffeine_per_100ml);
  const add = d.additive_override ?? additiveLevel(d.additive_count);
  const outfit = OUTFIT[d.tea_type];
  const expr = EXPRESSION[d.sweetener_type];
  if (!outfit) throw new Error(`${d.id}: 未知的 tea_type "${d.tea_type}"`);
  if (!expr) throw new Error(`${d.id}: 未知的 sweetener_type "${d.sweetener_type}"`);
  return {
    id: d.id,
    name: d.name,
    body: BODY[sugarLevel(d.sugar_per_100ml) - 1],
    height: HEIGHT[heightLevel(d.volume_ml) - 1],
    eyes: EYES[caf - 1],
    hair: HAIR[caf - 1],
    outfit,
    accessories: ACCESSORY[add - 1],
    face: expr.face,
    personality: expr.personality,
  };
}
