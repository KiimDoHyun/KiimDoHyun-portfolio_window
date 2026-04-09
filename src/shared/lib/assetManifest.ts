import kdhProfile from "@images/김도현.jpg";
import githubLine from "@images/icons/github_line.png";
import blogLine from "@images/icons/blog_line.png";
import companyLine from "@images/icons/company_line.png";
import linkedinLine from "@images/icons/linkedin_line.png";
import campusLineBlue from "@images/icons/campus_line_blue.png";
import bookLineBlue from "@images/icons/book_line_blue.png";
import codingLineBlue from "@images/icons/coding_line_blue.png";
import businessLineBlue from "@images/icons/business_line_blue.png";
import gearLineBlue from "@images/icons/gear_line_blue.png";
import webLineBlue from "@images/icons/web_line_blue.png";
import companyLineBlue from "@images/icons/company_line_blue.png";

const assetManifest: Record<string, string> = {
    kdh_profile: kdhProfile,
    github_line: githubLine,
    blog_line: blogLine,
    company_line: companyLine,
    linkedin_line: linkedinLine,
    campus_line_blue: campusLineBlue,
    book_line_blue: bookLineBlue,
    coding_line_blue: codingLineBlue,
    business_line_blue: businessLineBlue,
    gear_line_blue: gearLineBlue,
    web_line_blue: webLineBlue,
    company_line_blue: companyLineBlue,
};

export const resolveAsset = (key: string): string | undefined =>
    assetManifest[key];

export default assetManifest;
