import { RawImg } from "@components";

export default function MyComponent(props) {
  return (
    <div
      css={{
        color: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255, 255, 255)",
        font: "400 16px/24px Rethink, Arial, sans-serif ",
      }}
    >
      <div
        css={{
          fontWeight: "400",
        }}
      >
        <div
          css={{
            fontWeight: "400",
            left: "0%",
            position: "fixed",
            top: "0%",
          }}
        />
        <div
          css={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgb(248, 249, 250)",
            fontWeight: "400",
            gap: "100px",
            justifyContent: "center",
            overflowX: "hidden",
            overflowY: "hidden",
            position: "relative",
            textWrap: "nowrap",
            whiteSpace: "nowrap",
            padding: "12px 0",
          }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "center",
              animationDuration: "45s",
              animationIterationCount: "infinite",
              animationName: "scroll-left",
              animationTimingFunction: "linear",
              fontWeight: "400",
            }}
          >
          </div>
        </div>
      </div>
    </div>
  );
}
