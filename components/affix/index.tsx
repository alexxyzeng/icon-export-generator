import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import ResizeObserver from 'rc-resize-observer';
import { ConfigContext, ConfigConsumerProps } from '../config-provider';
import { throttleByAnimationFrameDecorator } from '../_util/throttleByAnimationFrame';

import {
  addObserveTarget,
  removeObserveTarget,
  getTargetRect,
  getFixedTop,
  getFixedBottom,
} from './utils';
