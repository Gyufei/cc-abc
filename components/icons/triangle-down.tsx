import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <defs>
      <clipPath id="a">
        <rect width={15} height={15} rx={0} />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <path
        fill="#18181B"
        d="M10.09 5c.163 0 .323.037.464.108.14.07.255.172.334.293a.68.68 0 0 1 .112.397.693.693 0 0 1-.142.39l-2.59 3.454a.868.868 0 0 1-.33.263 1.04 1.04 0 0 1-.876 0 .868.868 0 0 1-.33-.263l-2.59-3.455A.693.693 0 0 1 4 5.797a.68.68 0 0 1 .112-.396.848.848 0 0 1 .335-.293c.14-.07.3-.108.463-.108h5.18Z"
      />
    </g>
  </svg>
);
export default SvgComponent;
