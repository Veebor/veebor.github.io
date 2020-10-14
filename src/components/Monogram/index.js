import React from 'react';
import classNames from 'classnames';
import { useId } from 'hooks';
import './index.css';
import {ReactComponent as ReactLogo} from 'assets/icon.svg';
function Monogram({ highlight, className, ...props }) {
  const id = useId();
  const linearId = `linear-${id}`;
  const clipId = `monogram-clip-${id}`;

  return (
    <ReactLogo/>
  );
}

export default Monogram;
