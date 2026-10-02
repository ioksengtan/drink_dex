import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { computeCharacter } from "./rules.mjs";

const drinks = JSON.parse(readFileSync(new URL("./drinks.json", import.meta.url)));
const out = Object.fromEntries(drinks.map((d) => [d.id, computeCharacter(d)]));

// 預期值取自先前討論定案的規則表
const expected = {
  "itoen-jinxuan-oolong-535": ["修長少年", "標準", "眼神清醒", "無", "平靜"],
  "ochaen-mugicha-580": ["修長少年", "標準", "睡眼惺忪", "1～2 個小配件", "平靜"],
  "mrbrown-original-240": ["標準圓潤", "嬌小", "睜大眼睛", "1～2 個小配件", "開心笑臉"],
  "mrbrown-2in1-nosugar-240": ["修長少年", "嬌小", "睜大眼睛", "1～2 個小配件", "平靜"],
  "redbull-original-250": ["圓滾滾", "嬌小", "睜大眼睛", "3 個以上", "開心笑臉"],
  "redbull-sugarfree-250": ["修長少年", "嬌小", "睜大眼睛", "3 個以上", "眨眼或吐舌"],
  "coca-cola-330": ["圓滾滾", "標準", "眼神清醒", "1～2 個小配件", "開心笑臉"],
};

for (const [id, exp] of Object.entries(expected)) {
  const c = out[id];
  assert.deepEqual([c.body, c.height, c.eyes, c.accessories, c.face], exp, id);
}

// 邊界與覆寫
const base = drinks[0];
assert.equal(computeCharacter({ ...base, volume_ml: 600 }).height, "標準");
assert.equal(computeCharacter({ ...base, volume_ml: 601 }).height, "高大");
assert.equal(computeCharacter({ ...base, caffeine_per_100ml: 29 }).eyes, "眼神清醒");
assert.equal(computeCharacter({ ...base, caffeine_per_100ml: 30 }).eyes, "睜大眼睛");
assert.equal(computeCharacter({ ...base, caffeine_per_100ml: null }).eyes, "眼神清醒");
assert.equal(computeCharacter({ ...base, caffeine_override: 1 }).eyes, "睡眼惺忪");
assert.equal(computeCharacter({ ...base, additive_override: 3 }).accessories, "3 個以上");

console.log("全部通過：7 款飲料 + 邊界/覆寫");
