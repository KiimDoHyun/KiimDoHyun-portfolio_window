import portfolio from "../portfolio.json";
import { buildFileSystem } from "@shared/lib/file-system/buildFileSystem";
import { exportFileSystem } from "@shared/lib/file-system/exportFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

describe("portfolio.json", () => {
    it("conforms to PortfolioSchema and round-trips", () => {
        const schema = portfolio as PortfolioSchema;
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        expect(exported).toEqual(schema);
    });
});
