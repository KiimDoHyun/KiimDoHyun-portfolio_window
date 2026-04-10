import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const CYCLE_LIMIT = 5;
const STREAK_LIMIT = 4;
const MARKER = "[review-cycle]";

function getCounterPath(sessionId) {
  return join(tmpdir(), `claude-review-cycle-${sessionId}`);
}

function readCounter(counterPath) {
  try {
    return JSON.parse(readFileSync(counterPath, "utf-8"));
  } catch {
    return { cycleCount: 0, sameCycleStreak: 0 };
  }
}

function writeCounter(counterPath, counter) {
  writeFileSync(counterPath, JSON.stringify(counter), "utf-8");
}

const input = JSON.parse(readFileSync(process.stdin.fd, "utf-8"));
const toolInput = input.tool_input ?? {};
const description = toolInput.description ?? "";
const sessionId = process.env.CLAUDE_SESSION_ID ?? "default";

const counterPath = getCounterPath(sessionId);
const counter = readCounter(counterPath);

if (description.includes(MARKER)) {
  counter.cycleCount++;
  counter.sameCycleStreak = 0;
} else {
  counter.sameCycleStreak++;
}

writeCounter(counterPath, counter);

if (counter.cycleCount > CYCLE_LIMIT) {
  const result = {
    decision: "deny",
    reason: `리뷰 사이클 ${counter.cycleCount - 1}회 도달 (최대 ${CYCLE_LIMIT}회).\n현재까지의 리뷰 히스토리(라운드별 요약, 잔여 Must Fix, 미해결 사유)를 사용자에게 즉시 보고하세요.`,
  };
  process.stdout.write(JSON.stringify(result));
} else if (counter.sameCycleStreak >= STREAK_LIMIT) {
  const result = {
    decision: "deny",
    reason: `동일 사이클 카운트(${counter.cycleCount}회)에서 Agent가 ${STREAK_LIMIT}회 연속 호출되었습니다.\n카운트가 진행되지 않는 비정상 루프로 판단하여 차단합니다.\n현재까지의 리뷰 히스토리를 사용자에게 즉시 보고하세요.`,
  };
  process.stdout.write(JSON.stringify(result));
} else {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
}
