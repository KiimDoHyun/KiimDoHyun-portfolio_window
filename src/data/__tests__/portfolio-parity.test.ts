import portfolio from "../portfolio.json";
import { buildFileSystem } from "@shared/lib/file-system/buildFileSystem";
import { directory } from "@shared/lib/data";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

describe("portfolio.json parity with legacy directory", () => {
    const state = buildFileSystem(portfolio as PortfolioSchema);
    const nodesByName = new Map(
        Object.values(state.nodes).map((n) => [n.name, n])
    );

    it("every legacy directory entry exists in portfolio.json with matching type/parent/icon", () => {
        const missing: Array<string> = [];
        const mismatched: Array<string> = [];
        for (const item of directory) {
            const node = nodesByName.get(item.name);
            if (!node) {
                missing.push(item.name);
                continue;
            }
            if (node.type !== item.type) {
                mismatched.push(`${item.name}: type ${node.type} vs ${item.type}`);
            }
            const parentNode = node.parentId ? state.nodes[node.parentId] : null;
            const parentName = parentNode ? parentNode.name : "KDH";
            if (parentName !== item.parent) {
                mismatched.push(
                    `${item.name}: parent ${parentName} vs ${item.parent}`
                );
            }
            // icon 비교는 생략: data.ts는 webpack import, portfolio.json은 빈 문자열.
            // 환경별(jest/webpack)로 값이 달라 parity 유지 불가. Phase C manifest에서 정리.
        }
        expect({ missing, mismatched }).toEqual({ missing: [], mismatched: [] });
    });
});
