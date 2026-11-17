'use client';

import type { ReactElement } from 'react';
import { diner } from '../content/diner';
import { signLine } from '../lib/hours';
import { useDinerNow } from './diner-clock';

/** One neon tube: a soft glass body, the coloured tube and a bright core. */
function Tube({ children, width = 7 }: { children: ReactElement<{ strokeWidth?: number }>; width?: number }) {
  return (
    <>
      <g className="neon-glass" strokeWidth={width + 4}>{children}</g>
      <g className="neon-core" strokeWidth={width}>{children}</g>
      <g className="neon-hot" strokeWidth={Math.max(1.5, width / 3)}>{children}</g>
    </>
  );
}

/**
 * The hero's neon sign, drawn from `diner.sign`. The name tubes are always lit. The OPEN panel
 * stays unlit glass in the static HTML ("Hours below") and lights with a single flicker-on in
 * the browser when the diner is open right now. It never claims open at build time.
 */
export function NeonSign() {
  const now = useDinerNow();
  const { script, block } = diner.sign;
  const scriptSize = Math.min(210, Math.round(1700 / Math.max(script.length, 1)));
  const blockSize = Math.min(118, Math.round((520 / Math.max(block.length, 1) - 20) / 0.52));
  const caption = now ? signLine(now.state, now.minutes) : 'Hours below';

  return (
    <div className="relative" data-open={now ? String(now.state.open) : undefined}>
      <svg className="neon" viewBox="0 0 1000 470" aria-hidden="true" focusable="false">
        {/* Transformer box and wiring behind the sign */}
        <path className="neon-wire" d="M97 98c0 70 40 150 95 172M936 134c0 70-20 110-51 151" />
        <rect className="neon-box" x="58" y="44" width="78" height="54" rx="6" />
        <path d="M70 58h54M70 68h54M70 78h54" stroke="var(--chrome-edge)" strokeWidth="2" opacity=".5" />
        <rect className="neon-box" x="906" y="96" width="60" height="38" rx="5" />

        {/* Script name */}
        <g className="neon-tube neon-red neon-lit">
          <Tube width={7}>
            <text x="480" y="232" textAnchor="middle" fontFamily="var(--font-script)" fontSize={scriptSize}>{script}</text>
          </Tube>
        </g>

        {/* Swash under the script, with end caps and mounting clips */}
        <g className="neon-tube neon-yellow neon-lit">
          <Tube width={6}><path d="M196 276c120-26 270-30 470-14 50 4 92 2 124-8" /></Tube>
        </g>
        <rect className="neon-cap" x="184" y="268" width="16" height="16" rx="4" />
        <rect className="neon-cap" x="786" y="246" width="16" height="16" rx="4" />
        {[300, 480, 660].map(x => <circle key={x} className="neon-clip" cx={x} cy={x === 480 ? 258 : 264} r="6" />)}

        {/* Block letters */}
        <g className="neon-tube neon-teal neon-lit">
          <Tube width={5}>
            <text x="480" y="388" textAnchor="middle" fontFamily="var(--font-sign)" fontWeight="900" fontSize={blockSize}
              letterSpacing="20" style={{ textTransform: 'uppercase' }}>{block}</text>
          </Tube>
        </g>

        {/* Starburst accent */}
        <g className="neon-tube neon-yellow neon-lit" transform="translate(120 330)">
          <Tube width={4}><path d="M0-46 9-14 42-24 18 0 42 24 9 14 0 46-9 14-42 24-18 0-42-24-9-14Z" /></Tube>
        </g>

        {/* OPEN panel: unlit glass until the browser says so */}
        <g transform="translate(790 300)">
          <rect className="neon-panel" x="0" y="0" width="190" height="104" rx="14" />
          <g className="neon-tube neon-red open-sign">
            <Tube width={5}>
              <rect x="12" y="12" width="166" height="80" rx="9" />
            </Tube>
            <Tube width={5}>
              <text x="95" y="75" textAnchor="middle" fontFamily="var(--font-sign)" fontWeight="900" fontSize="58" letterSpacing="8">OPEN</text>
            </Tube>
          </g>
          <circle className="neon-clip" cx="95" cy="-10" r="5" />
          <path className="neon-wire" d="M95-5V0" />
        </g>
        <text className="neon-caption" x="885" y="446" textAnchor="middle" fontSize="32" aria-hidden="true">{caption}</text>
      </svg>
    </div>
  );
}
