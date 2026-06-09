import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";
import type { ComponentProps } from "react";

const streamdownPlugins = { cjk, code, math, mermaid };

export type StreamdownResponseProps = ComponentProps<typeof Streamdown>;

export default function StreamdownResponse(props: StreamdownResponseProps) {
  return <Streamdown plugins={streamdownPlugins} {...props} />;
}
