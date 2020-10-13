import React, { useState, useEffect, useRef, Fragment, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from 'components/ThemeProvider';
import Intro from './Intro';
import ProjectSummary from './ProjectSummary';
import Profile from './Profile';
import Footer from 'components/Footer';
import { usePrefersReducedMotion, useRouteTransition } from 'hooks';
// import modernTexture from 'assets/modern.jpg';
// import modernTextureLarge from 'assets/modern-large.jpg';
// import modernTexturePlaceholder from 'assets/modern-placeholder.jpg';
import supernoteTexture from 'assets/supernote.jpg';
import montiAppLoginLight from 'assets/montiapp-login.jpg';
import montiAppLoginDark from 'assets/montiapp-login-dark.jpg';
import supernoteTexturePlaceholder from 'assets/supernote-placeholder.jpg';
import supernoteHomeTexture from 'assets/supernote-home.jpg';
import lslAppLoginLight from 'assets/lsl-login.jpeg';
import lslAppLoginDark from 'assets/lsl-login-dark.jpeg';
import lslAppMainLight from 'assets/lsl.jpeg';
import lslAppMainDark from 'assets/lsl-dark.jpeg';
import montiAppMainLight from 'assets/montiapp-large.jpg';
import montiAppMainDark from 'assets/montiapp-large-dark.jpeg';
import supernoteHomeTexturePlaceholder from 'assets/supernote-home-placeholder.jpg';
import dttTexture from 'assets/smarthome-large.png';
import dttTextureLarge from 'assets/smarthome-large.png';
import dttTexturePlaceholder from 'assets/dtt-placeholder.jpg';
import iphone11 from 'assets/iphone-11.glb';
import macbookPro from 'assets/macbook-pro.glb';

const disciplines = ['Development', 'Sysadmin', 'Design', 'Research'];

export default function Home(props) {
  const { status } = useRouteTransition();
  const { hash, state } = useLocation();
  const theme = useTheme();
  const { themeId } = theme;
  const isDark = themeId === 'dark';
  const initHash = useRef(true);
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const about = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const revealSections = [intro, projectOne, projectTwo, projectThree, about];

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);
          if (visibleSections.includes(section)) return;
          setVisibleSections(prevSections => [...prevSections, section]);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    const indicatorObserver = new IntersectionObserver(([entry]) => {
      setScrollIndicatorHidden(!entry.isIntersecting);
    }, { rootMargin: '-100% 0px 0px 0px' });

    revealSections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  useEffect(() => {
    const hasEntered = status === 'entered';
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    let scrollObserver;
    let scrollTimeout;

    const handleHashchange = (hash, scroll) => {
      clearTimeout(scrollTimeout);
      const hashSections = [intro, projectOne, projectTwo, projectThree, about];
      const hashString = hash.replace('#', '');
      const element = hashSections.filter(item => item.current.id === hashString)[0];
      if (!element) return;
      const behavior = scroll && !prefersReducedMotion ? 'smooth' : 'instant';
      const top = element.current.offsetTop;

      scrollObserver = new IntersectionObserver((entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          scrollTimeout = setTimeout(() => {
            element.current.focus();
          }, prefersReducedMotion ? 0 : 400);
          observer.unobserve(entry.target);
        }
      }, { rootMargin: '-20% 0px -20% 0px' });

      scrollObserver.observe(element.current);

      if (supportsNativeSmoothScroll) {
        window.scroll({
          top,
          left: 0,
          behavior,
        });
      } else {
        window.scrollTo(0, top);
      }
    };

    if (hash && initHash.current && hasEntered) {
      handleHashchange(hash, false);
      initHash.current = false;
    } else if (!hash && initHash.current && hasEntered) {
      window.scrollTo(0, 0);
      initHash.current = false;
    } else if (hasEntered) {
      handleHashchange(hash, true);
    }

    return () => {
      clearTimeout(scrollTimeout);
      if (scrollObserver) {
        scrollObserver.disconnect();
      }
    };
  }, [hash, state, prefersReducedMotion, status]);

  return (
    <Fragment>
      <Helmet>
        <title> Veebor | UI Designer + Back-end developer</title>
        <meta
          name="description"
          content="Veebor –  designers and full-stack developers." />
        <link rel="prefetch" href={iphone11} as="fetch" crossorigin="" />
        <link rel="prefetch" href={macbookPro} as="fetch" crossorigin="" />
      </Helmet>
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="MontiApp"
        description="Building the new horizon of school apps."
        buttonText="View Website"
        buttonLink="https://liceomonti.edu.it"
        model={{
          type: 'phone',
          alt: 'MontiApp\'s splash screen.',
          textures: [
            {
              src: supernoteHomeTexture,
              srcSet: `${supernoteHomeTexture} 254w, ${isDark ? montiAppMainDark : montiAppMainLight} 508w`,
              placeholder: supernoteHomeTexturePlaceholder,
            },
            {
              src: supernoteTexture,
              srcSet: `${supernoteTexture} 254w, ${isDark ? montiAppLoginDark : montiAppLoginLight} 508w`,
              placeholder: supernoteTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="SmartHome"
        description="An open source IoT project"
        buttonText="View Project"
        buttonLink="https://github.com/Veebor/SmartHome"
        model={{
          type: 'laptop',
          alt: 'SmartHome Landing Page',
          textures: [
            {
              src: dttTexture,
              srcSet: `${dttTexture} 800w, ${dttTextureLarge} 1440w`,
              placeholder: dttTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="LightSpeedLearn"
        description="An app created to help students"
        buttonText="View Website"
        buttonLink="lightspeedlearn.net"
        model={{
          type: 'phone',
          alt: 'LSL\'s splash screen.',
          textures: [
            {
              src: supernoteHomeTexture,
              srcSet: `${supernoteHomeTexture} 254w, ${isDark ? lslAppMainDark : lslAppMainLight} 508w`,
              placeholder: supernoteHomeTexturePlaceholder,
            },
            {
              src: supernoteTexture,
              srcSet: `${supernoteTexture} 254w, ${isDark ? lslAppLoginDark : lslAppLoginLight} 508w`,
              placeholder: supernoteTexturePlaceholder,
            },
          ],
        }}
      />

      <Profile
        sectionRef={about}
        visible={visibleSections.includes(about.current)}
        id="about"
      />

      <Footer />
    </Fragment>
  );
}
