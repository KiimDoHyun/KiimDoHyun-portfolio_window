import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "./src/styled-system",

  // The JSX framework to use
  jsxFramework: "react",

  // Enable CSS variables for better theming
  cssVarRoot: ":root",

  // L2+ motion shorthand. 사용처는 `transition: "fast" | "medium" | "slow"` 한 줄만 본다.
  // transform 결과가 transitionProperty/Duration/TimingFunction 3개로 전개된다.
  utilities: {
    extend: {
      transition: {
        values: ["fast", "medium", "slow"],
        transform(value: string) {
          const durationMap: Record<string, string> = {
            fast: "0.2s",
            medium: "0.25s",
            slow: "0.4s",
          };
          const duration = durationMap[value];
          if (!duration) return { transition: value };
          return {
            transitionProperty: "all",
            transitionDuration: duration,
            transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
          };
        },
      },
    },
  },

  theme: {
    extend: {
      tokens: {
        // L1. Raw palette — 색 그 자체. 그룹명=색 이름, 단계=100 단위 (100=가장 옅음).
        // 역할 이름(accent, danger 등)은 이 층에 쓰지 않는다.
        colors: {
          white: {
            100: { value: "#ffffff" }, // 프로그램 창 프레임 배경
          },
          black: {
            100: { value: "#000000" }, // 프로그램 창 테두리, 버튼 선
          },
          gray: {
            100: { value: "#f3f3f3" }, // program-info 밝은 배경
            200: { value: "#ededed" }, // 섀시 밝은 텍스트
            300: { value: "#e8e8e8" }, // 상태바 제목
            400: { value: "#e7e7e7" }, // program-doc 콘텐츠
            500: { value: "#c7c7c7" }, // 화살표 아이콘
            600: { value: "#a9a9a9" }, // 중간 회색
            700: { value: "#4d4d4d" }, // 테두리
            800: { value: "#4b4b4b" }, // 어두운 본문
            900: { value: "#393a3b" }, // 섀시 다크 배경 (거의 중성)
            950: { value: "#202020" }, // 강조용 짙은 본문 (program-info desc)
          },
          slate: {
            100: { value: "#20343b" }, // 푸른빛 도는 다크
          },
          skyblue: {
            100: { value: "#e5f3ff" }, // folder hover
            200: { value: "#cce8ff" }, // folder 선택
            300: { value: "#99d1ff" }, // folder border
            400: { value: "#00adef" }, // taskbar 아이콘 hover
            500: { value: "#76b3e4" }, // info 링크 텍스트
          },
          blue: {
            100: { value: "#0078d7" }, // Windows 파랑 solid
          },
          red: {
            100: { value: "#ff1010" }, // 위험/닫기
          },
        },
        // Custom spacing scale — key 자체가 px 값, value는 rem(접근성).
        // Panda default의 `1 = 0.25rem = 4px` 관계를 가독성 위해 덮어쓴다.
        // Panda extend 모드이므로 default 키 중 여기에 없는 것(`0.5`, `1.5` 등)은 그대로 남아있지만,
        // 사용처에서는 아래 스케일만 사용한다. 최소 단위는 4, 1px/2px 같은 값은 border로 처리.
        spacing: {
          "0": { value: "0" },
          "4": { value: "0.25rem" }, // 4px
          "8": { value: "0.5rem" }, // 8px
          "12": { value: "0.75rem" }, // 12px
          "16": { value: "1rem" }, // 16px
          "20": { value: "1.25rem" }, // 20px
          "24": { value: "1.5rem" }, // 24px
          "32": { value: "2rem" }, // 32px
          "40": { value: "2.5rem" }, // 40px
        },
        sizes: {
          taskbar: { value: "50px" },
          windowHeader: { value: "32px" },
          windowBottom: { value: "20px" },
          program: {
            default: { value: "500px" }, // 프로그램 창 기본 width/height
            headerSub: { value: "25px" }, // 프로그램 헤더 서브 영역 (탭/경로바 등)
          },
          statusbar: {
            width: { value: "650px" },
            height: { value: "500px" },
          },
          timebar: {
            width: { value: "360px" },
            height: { value: "720px" },
          },
          infobar: {
            width: { value: "400px" },
          },
        },
        radii: {
          sm: { value: "4px" },
          md: { value: "8px" },
          full: { value: "9999px" },
        },
        shadows: {
          windowFrame: { value: "0 0 20px 3px {colors.black.100/38}" },
          panelUp: { value: "0 -3px 20px 3px {colors.black.100/38}" },
          stackItem: { value: "0 0 10px 2px {colors.gray.600}" }, // doc stackItem hover drop
        },
        durations: {
          fast: { value: "0.2s" },
          medium: { value: "0.25s" },
          slow: { value: "0.4s" },
        },
        easings: {
          standard: { value: "cubic-bezier(0, 0.5, 0, 1)" },
        },
      },
      semanticTokens: {
        // L2. Semantic tokens — 역할/의미. 사용처는 이 층만 참조한다.
        // base 값만 등록. 대체 테마의 condition 오버라이드는 Phase 6에서 추가.
        colors: {
          shell: {
            bg: { value: { base: "{colors.gray.900}" } },
            bgAlt: { value: { base: "{colors.slate.100/61}" } },
            text: { value: { base: "{colors.gray.200}" } },
            border: { value: { base: "{colors.gray.700}" } },
          },
          windowChrome: {
            bg: { value: { base: "{colors.white.100}" } },
            border: { value: { base: "{colors.black.100}" } },
            // 근사 대상 제외: #dddddd는 raw에 없어 이동 리스크 회피 위해 rgba 유지
            buttonHover: { value: { base: "rgba(221, 221, 221, 0.7)" } },
            closeHover: { value: { base: "{colors.red.100}" } },
          },
          surface: {
            light: { value: { base: "{colors.gray.100}" } },
            dark: { value: { base: "{colors.slate.100}" } },
            content: { value: { base: "{colors.gray.400}" } }, // 프로그램 콘텐츠 영역 배경 (doc/image)
            textPrimary: { value: { base: "{colors.gray.800}" } },
            textMuted: { value: { base: "{colors.gray.600}" } },
            textStrong: { value: { base: "{colors.gray.950}" } }, // 짙은 강조 본문 (info desc)
            border: { value: { base: "{colors.gray.400}" } }, // 프로그램 콘텐츠 영역의 옅은 border
            borderDim: { value: { base: "{colors.gray.500}" } }, // 흰 배경 위 hover 시 dim된 테두리 (login 버튼)
            raised: { value: { base: "{colors.gray.800}" } }, // 다크 배경 위 떠있는 블록
          },
          accent: {
            // "강조" 역할. base 테마에서는 blue/skyblue로 연결된다.
            solid: { value: { base: "{colors.blue.100}" } }, // active / 진한 강조
            hover: { value: { base: "{colors.skyblue.400}" } }, // taskbar 아이콘 hover
            soft: { value: { base: "{colors.skyblue.100}" } }, // folder hover
            select: { value: { base: "{colors.skyblue.200}" } }, // folder 선택
            line: { value: { base: "{colors.skyblue.300}" } }, // folder border
            underline: { value: { base: "{colors.skyblue.300}" } }, // taskbar 선택 밑줄 (원래 #aac5ff, 근사 이동)
            link: { value: { base: "{colors.skyblue.500}" } }, // info 링크 텍스트
          },
          overlay: {
            // 근사 대상 제외: #dfdfdf는 raw에 없어 이동 리스크 회피 위해 rgba 유지
            hover: { value: { base: "rgba(223, 223, 223, 0.07)" } },
            weak: { value: { base: "{colors.white.100/8}" } }, // 약한 반투명 배경
            active: { value: { base: "{colors.white.100/14}" } },
            activeHover: { value: { base: "{colors.white.100/17}" } }, // active + hover 중첩
            fadeEdge: { value: { base: "{colors.black.100/16}" } }, // image viewer 좌우 엣지 그라데이션
          },
        },
      },
      keyframes: {
        open: {
          from: { opacity: 0, transform: "scale(0.9)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        show_from_bottom: {
          from: { scale: "1 1.5", translate: "0 200px" },
          to: { translate: "0 0px", scale: "1 1.0" },
        },
        prevView_coverTransform: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
});
