import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import classNames from 'classnames';
import { usePrefersReducedMotion, useInViewport } from 'hooks';
import { Button } from 'components/Button';
import Icon from 'components/Icon';
import { Transition } from 'react-transition-group';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';import { tokens } from 'components/ThemeProvider/theme';
import { msToNum, numToMs } from 'utils/style';
import './index.css';

const Image = ({ className, style, reveal, delay = 0, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef();
  const inViewport = useInViewport(containerRef, true);

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={classNames('image', className, {
        'image--in-viewport': inViewport,
        'image--reveal': reveal,
      })}
      style={{ ...style, '--delay': numToMs(delay) }}
      ref={containerRef}
    >
      <ImageElements
        delay={delay}
        onLoad={onLoad}
        loaded={loaded}
        inViewport={inViewport}
        reveal={reveal}
        {...rest}
      />
    </div>
  );
};

const ImageElements = ({
  onLoad,
  loaded,
  inViewport,
  srcSet,
  placeholder,
  delay,
  src,
  alt,
  play = true,
  reveal,
  ...rest
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [playing, setPlaying] = useState(!prefersReducedMotion);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderSize, setPlaceholderSize] = useState();
  const placeholderRef = useRef();
  const videoRef = useRef();
  const isVideo = src?.endsWith('.mp4');
  const imgSrc = src || srcSet?.split(' ')[0];
  const showFullRes = !prerender && inViewport;

  useEffect(() => {
    const purgePlaceholder = () => {
      setShowPlaceholder(false);
    };

    const placeholderElement = placeholderRef.current;
    placeholderElement.addEventListener('transitionend', purgePlaceholder);

    return function cleanUp() {
      if (placeholderElement) {
        placeholderElement.removeEventListener('transitionend', purgePlaceholder);
      }
    };
  }, []);

  useEffect(() => {
    const { width, height } = placeholderRef.current;

    if (width && height) {
      setPlaceholderSize({ width, height });
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!play) {
      setPlaying(false);
      videoRef.current.pause();
    } else {
      setPlaying(true);
      videoRef.current.play();
    }
  }, [play]);

  const handlePlaceholderLoad = event => {
    const { width, height } = event.target;
    setPlaceholderSize({ width, height });
  };

  const togglePlaying = event => {
    event.preventDefault();

    if (videoRef.current.paused) {
      setPlaying(true);
      videoRef.current.play();
    } else {
      setPlaying(false);
      videoRef.current.pause();
    }
  };

  const handleShowPlayButton = () => {
    setShowPlayButton(true);
    setIsHovered(true);
  };

  const handleFocusPlayButton = () => {
    setShowPlayButton(true);
    setIsFocused(true);
  };

  return (
    <div
      className={classNames('image__element-wrapper', {
        'image__element-wrapper--reveal': reveal,
        'image__element-wrapper--in-viewport': inViewport,
      })}
      onMouseOver={isVideo ? handleShowPlayButton : undefined}
      onMouseOut={isVideo ? () => setIsHovered(false) : undefined}
      style={{ '--delay': numToMs(delay + 1000) }}
    >
      {isVideo && (
        <Fragment>
          <video
            muted
            loop
            playsInline
            className={classNames('image__element', { 'image__element--loaded': loaded })}
            autoPlay={!prefersReducedMotion}
            role="img"
            onLoadStart={onLoad}
            aria-label={alt}
            ref={videoRef}
            {...rest}
          >
            <source src={src} type="video/mp4" />
          </video>
          <Transition
            in={isHovered || isFocused}
            onExit={reflow}
            onExited={() => setShowPlayButton(false)}
            timeout={{ enter: 0, exit: msToNum(tokens.base.durationS) }}
          >
            {status => (
              <Button
                className={classNames('image__button', `image__button--${status}`, {
                  'image__button--visible': showPlayButton,
                })}
                onFocus={handleFocusPlayButton}
                onBlur={() => setIsFocused(false)}
                onClick={togglePlaying}
              >
                <Icon icon={playing ? 'pause' : 'play'} />
                {playing ? 'Pause' : 'Play'}
              </Button>
            )}
          </Transition>
        </Fragment>
      )}
      {!isVideo && (
        <img
          className={classNames('image__element', { 'image__element--loaded': loaded })}
          onLoad={onLoad}
          decoding="async"
          src={showFullRes ? imgSrc : undefined}
          srcSet={showFullRes ? srcSet : undefined}
          width={placeholderSize?.width}
          height={placeholderSize?.height}
          alt={alt}
          {...rest}
        />
      )}
      {showPlaceholder && (
        <img
          aria-hidden
          className={classNames('image__placeholder', {
            'image__placeholder--loaded': loaded,
          })}
          style={{ '--delay': numToMs(delay) }}
          ref={placeholderRef}
          src={placeholder}
          onLoad={handlePlaceholderLoad}
          width={placeholderSize?.width}
          height={placeholderSize?.height}
          decoding="async"
          alt=""
          role="presentation"
        />
      )}
    </div>
  );
};

export default Image;